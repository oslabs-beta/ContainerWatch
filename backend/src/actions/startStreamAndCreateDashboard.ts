import axios from 'axios';
import startContainerMetricsStream from './docker/startContainerMetricsStream';
import createGrafanaDashboardObject from './grafana/createGrafanaDashboardObject';
import { GrafanaDatasource } from '../types';

// Function that aggregates container info needed to get metrics and make dashboards.
// Uses relevant container info and starts a metrics stream and creates a Grafana dashboard.
export default async function startStreamAndCreateDashboard(
  id: string,
  containerName: string,
  datasource: GrafanaDatasource
) {
  startContainerMetricsStream(id);
  const dashboard = createGrafanaDashboardObject(id, containerName, datasource);

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
  console.log(`📊 Grafana graphs 📊 for the ${containerName} container are ready!!`);
}
