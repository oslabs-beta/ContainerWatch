import axios from "axios";
import createGrafanaDashboardObject from "../grafana/createGrafanaDashboardObject";
import startContainerMetricsStream from "./startContainerMetricsStream";
import { DOCKER_DAEMON_SOCKET_PATH } from "../../constants";
import { GrafanaDatasource } from "../../types";

// Open up a streaming connection that listens for container 'start' and 'destroy events.
// Whenever a container starts we will create a dashboard with grafana graphs for that container.
// Whenever a container is destroyed, we will delete the corresponding grafana dashboard. (WIP)
export default async function startContainerEventListener(datasource: GrafanaDatasource) {
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
    // Parse event data
    const event = JSON.parse(eventData.toString());
 
    // These will check for two actions, start and destroy.
    // Start action: create new grafana graphs using name and id.
    if (event.Action === 'start') {
      // Display event start in console.
      console.log('🚩 STARTED CONTAINER: ', event.Actor.Attributes.name, '!!');

      // Open up a metrics stream for data collection.
      startContainerMetricsStream(event.Actor.ID);

      // Create a Grafana dashboard for the new container.
      const dashboard = createGrafanaDashboardObject(
        event.Actor.ID,
        event.Actor.Attributes.name,
        datasource
      );
  
      // Post request to Grafana API that creates the dashboard using our dashboard object.
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
}

