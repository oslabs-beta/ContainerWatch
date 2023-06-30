import axios from 'axios';
import createGrafanaDashboard from '../grafana/createGrafanaDashboard';
import startContainerMetricsStream from './startContainerMetricsStream';
import { DOCKER_DAEMON_SOCKET_PATH } from '../../constants';
import { DockerContainer, GrafanaDatasource } from '../../types';

export default async function onLoadSetup(datasource: GrafanaDatasource) {
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

  // Iterate through ID array and create a dashboard object for each container.
  containerIDs.forEach(async (id, index) => {
    // Invoke function to start metrics stream and create Grafana Dashboard
    startContainerMetricsStream(id);
    await createGrafanaDashboardObject(id, containerNames[index], datasource);
  });
}
