import axios from "axios";
import createGrafanaDashboardObject from "../grafana/createGrafanaDashboardObject";
import startContainerMetricsStream from "./startContainerMetricsStream";
import { DOCKER_DAEMON_SOCKET_PATH } from "../../constants";
import { DockerContainer } from "../../types";

export default async function onLoadSetup(datasource) {
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
    startContainerMetricsStream(id);
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

  

}
