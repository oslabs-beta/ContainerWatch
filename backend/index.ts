import fs from 'fs';
import axios from 'axios';
import extensionServer from './src/extensionServer';
import metricsServer from './src/metricsServer';
import createGrafanaDashboardObject from './src/actions/grafana/createGrafanaDashboardObject';
import getGrafanaDatasource from './src/actions/grafana/getGrafanaDatasource';
import startContainerMetricsStream from './src/actions/docker/startContainerMetricsStream';
import startContainerEventListener from './src/actions/docker/startContainerEventListener';
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
    
    // Get necessary datasource information from Grafana directly.
    const datasource = await getGrafanaDatasource();

    // Start data collection and create Grafana graphs for all containers available on load.

    // Start container event listener
    startContainerEventListener(datasource);
  } catch (err) {
    console.error(err);
  }
})();
