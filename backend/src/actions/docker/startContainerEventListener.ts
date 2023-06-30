import axios from 'axios';
import startContainerMetricsStream from './startContainerMetricsStream';
import createGrafanaDashboard from '../grafana/createGrafanaDashboard';
import { DOCKER_DAEMON_SOCKET_PATH } from '../../constants';
import { GrafanaDatasource } from '../../types';

// Open up a streaming connection that listens for container 'start' and 'destroy events.
// Whenever a container starts we will create a dashboard with grafana graphs for that container.
// Whenever a container is destroyed, we will delete the corresponding grafana dashboard. (WIP)
export default async function startContainerEventListener(datasource: GrafanaDatasource) {
  // Make a get request to docker socket /events endpoint passing in filter params
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

  // Retrieve 'data' key from events stream
  const eventStream = eventsRequest.data;
  eventStream.on('data', async (eventData: Buffer) => {
    // Parse event data
    const event = JSON.parse(eventData.toString());

    // These will check for two actions, start and destroy.
    // Start action: Start metrics stream and create new grafana graphs for new container.
    if (event.Action === 'start') {
      // Display event start in console.
      console.log('🚩 STARTED CONTAINER: ', event.Actor.Attributes.name, '!!');

      // Invoke functions to start metrics stream and create Grafana Dashboard
      startContainerMetricsStream(event.Actor.ID);
      createGrafanaDashboard(event.Actor.ID, event.Actor.Attributes.name, datasource);
    }

    // Destroy action: delete grafana DASHBOARD with the same name
    if (event.Action === 'destroy') {
      console.log('💣 DESTROYED CONTAINER: ', event.Actor.Attributes.name, '!!');
      try {
        // Request to Grafana API to delete the Dashboard of the stopped container.
        // Metrics are already being stopped when the container stops running.
        // Properly cleaning up Dashboards for containers that are deleted.
        const deleteResponse = await axios.delete(
          `http://host.docker.internal:2999/api/dashboards/uid/${event.Actor.ID.slice(0, 12)}`,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        // Console logs to tell the user if the request was successful or not.
        if (deleteResponse.status >= 400) {
          console.log('Dashboard deletion failed 👎');
        } else {
          console.log('Dashboard', event.Actor.ID.slice(0, 12), 'successfully deleted 👋');
        }
      } catch (err) {
        console.log(err);
      }
    }
  });

  eventStream.on('end', () => {
    console.log('event request ended');
  });
}
