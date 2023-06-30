import fs from 'fs';
import axios from 'axios';
import extensionServer from './src/extensionServer';
import metricsServer from './src/metricsServer';
import createGrafanaDashboardObject from './src/actions/grafana/createGrafanaDashboardObject';
import getGrafanaDatasource from './src/actions/grafana/getGrafanaDatasource';
import startContainerMetricsStream from './src/actions/docker/startContainerMetricsStream';
import { DockerContainer } from './src/types';
import { DOCKER_DAEMON_SOCKET_PATH, SOCKETFILE, METRICS_PORT } from './src/constants';

// After a server is done with the unix domain socket, it is not automatically destroyed.
// You must instead unlink the socket in order to reuse that address/path.
// To do this, we delete the file with fs.unlinkSync()
try {
  fs.unlinkSync(SOCKETFILE);
  console.log('Deleted the UNIX socket file.');
} catch (err) {
  console.log('Did not need to delete the UNIX socket file.');
}

// Start the extension server and the metrics server
extensionServer.listen(SOCKETFILE, () => {
  console.log(`🚀 Server listening on ${SOCKETFILE}`);
});

metricsServer.listen(METRICS_PORT, () => {
  console.log(`📈 Metrics are available on ${METRICS_PORT}/metrics`);
});

(async () => {
  try {
    // Wait 15 seconds to give the Grafana container extra time to spin up and be ready to respond
    // to requests. This implementation can be improved later.
    console.log('⏳ Waiting ... ');
    await new Promise((r) => setTimeout(r, 1000 * 10));
    console.log('⌛ Done waiting.');

    // Get a list of all the Docker containers
    const response = await axios.get('/containers/json', {
      socketPath: DOCKER_DAEMON_SOCKET_PATH,
      params: { all: true },
    });

    // Populate two arrays, mapping through them in order ensures that their INDEX VALUES
    // can properly CORRELATE each container's respective IDs and Names.

    const containerIDs: string[] = [];
    const containerNames: string[] = [];
    (response.data as DockerContainer[]).forEach((el) => {
      containerIDs.push(el.Id);
      containerNames.push(el.Names[0].replace(/^\//, ''));
    });

    // Get necessary datasource information from Grafana directly.
    const datasource = await getGrafanaDatasource();

    // Iterate through ID array and create a dashboard object for each container.
    containerIDs.forEach(async (id, index) => {
      const dashboard = createGrafanaDashboardObject(id, containerNames[index], datasource);

      // Post request to Grafana API to create a dashboard using the returned dashboard object.
      await axios.post(
        'http://host.docker.internal:2999/api/dashboards/db',
        JSON.stringify(dashboard),
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      // A simple console log to show when graphs are done being posted to Grafana.
      console.log(`📊 Grafana graphs 📊 for the ${containerNames[index]} container are ready!!`);
    });

    // Open up a streaming connection that listens for container 'start' and 'destroy events.
    // Whenever a container starts we will create a dashboard with grafana graphs for that container.
    // Whenever a container is destroyed, we will delete the corresponding grafana dashboard. (WIP)
    const eventsRequest = await axios.get('/events', {
      socketPath: DOCKER_DAEMON_SOCKET_PATH,
      params: {
        type: 'container',
        filters: JSON.stringify({
          event: ['start', 'destroy'],
        }),
      },
      responseType: 'stream',
    });

    const eventStream = eventsRequest.data;
    eventStream.on('data', async (eventData: Buffer) => {
      const event = JSON.parse(eventData.toString());
      console.log(`------------------------NEW EVENT------------------------`);
      // console.log(event); // to view event object for debugging

      // These will check for two actions, start and stop

      // Start action: create new grafana graphs using name and id
      if (event.Action === 'start') {
        // Log
        console.log('🚩 STARTED CONTAINER: ', event.Actor.Attributes.name, '!!');
        const dashboard = createGrafanaDashboardObject(
          event.Actor.ID,
          event.Actor.Attributes.name,
          datasource
        );

        await axios.post(
          'http://host.docker.internal:2999/api/dashboards/db',
          JSON.stringify(dashboard),
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
      }

      // Destroy action: delete grafana DASHBOARD with the same name
      // May need to consider swapping ID and container name in grafana dashboard
      // to account for containers with the same name but different IDs
      if (event.Action === 'destroy') {
        console.log('💣 DESTROYED CONTAINER: ', event.Actor.Attributes.name, '!!');
      }
    });

    eventStream.on('end', () => {
      console.log('event request ended');
    });

    // For each container, create an HTTP request to the Docker Engine to get the stats.
    // This is a streaming connection that will close when the container is deleted.
    containerIDs.forEach(async (id) => {
      // invoke function to open metrics stream
      startContainerMetricsStream(id);
    });
  } catch (err) {
    console.error(err);
  }
})();
