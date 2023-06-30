import fs from 'fs';
import extensionServer from './src/extensionServer';
import metricsServer from './src/metricsServer';
import getGrafanaDatasource from './src/actions/grafana/getGrafanaDatasource';
import startContainerEventListener from './src/actions/docker/startContainerEventListener';
import onLoadSetup from './src/actions/docker/onLoadSetup';
import { SOCKETFILE, METRICS_PORT } from './src/constants';

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
    // STRETCH GOAL: Not a very likely scenario but consider this scenario:
    // A CPU or MEM spike causes DockerPulse container to stop/restart
    // but Grafana stays running, we may end up creating double the amount
    // of containers. May need to delete all dashboards first.

    // Get necessary datasource information from Grafana directly.
    const datasource = await getGrafanaDatasource();

    // Start data collection and create Grafana graphs for all containers available on load.
    onLoadSetup(datasource);

    // Start container event listener
    startContainerEventListener(datasource);
  } catch (err) {
    console.error(err);
  }
})();
