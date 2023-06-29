import fs from 'fs';
import axios from 'axios';
import extensionServer from './src/extensionServer';
import metricsServer from './src/metricsServer';
import { cpuGauge, memoryGauge } from './src/promClient';
import createGrafanaDashboardObject from './src/actions/grafana/createGrafanaDashboardObject';
import getGrafanaDatasource from './src/actions/grafana/getGrafanaDatasource';
import calculateDockerStats from './src/actions/docker/calculateDockerStats';
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
    await new Promise((r) => setTimeout(r, 1000 * 15));
    console.log('⌛ Done waiting.');

    // Get a list of all the Docker containers
    const response = await axios.get('/containers/json', {
      socketPath: DOCKER_DAEMON_SOCKET_PATH,
      params: { all: true },
    });
    const containerIDs = (response.data as DockerContainer[]).map(({ Id }) => Id);
    const containerNames = (response.data as DockerContainer[]).map(({ Names }) =>
      Names.pop()?.slice(1)
    );
    // ###########################################################
    // # TODO: Create Grafana dashboards for each container here #
    // ###########################################################

    // console.log('container ids', containerIDs);
    // console.log('container names', containerNames)
    const datasource = await getGrafanaDatasource();
    containerIDs.forEach(async (id, index) => {
      const dashboard = await createGrafanaDashboardObject(id, containerNames[index], datasource);

      const dashboardReponse = await fetch('http://host.docker.internal:2999/api/dashboards/db', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dashboard),
      });

      console.log('response status:', dashboardReponse.status);
    });

    // For each container, create and HTTP request to the Docker Engine to get the stats.
    // This is a streaming connection that will close when the container is deleted.
    containerIDs.forEach(async (id) => {
      const response = await axios.get(`/containers/${id}/stats`, {
        socketPath: DOCKER_DAEMON_SOCKET_PATH,
        params: { all: true },
        responseType: 'stream',
      });

      const stream = response.data;

      stream.on('data', (data: Buffer) => {
        const stats = JSON.parse(data.toString());
        // Calculate the CPU % and MEM %
        // If the container is stopped, these values will be NaN
        const { cpu_usage_percent, memory_usage_percent } = calculateDockerStats(stats);
        // Set the metrics gauges of the prometheus client
        cpuGauge.labels({ id }).set(cpu_usage_percent);
        memoryGauge.labels({ id }).set(memory_usage_percent);
      });

      stream.on('end', () => {
        console.log(`Stream ended for ${id} stats`);
      });
    });
  } catch (err) {
    console.error(err);
  }
})();
