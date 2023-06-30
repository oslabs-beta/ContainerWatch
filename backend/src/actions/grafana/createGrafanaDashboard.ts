import axios from 'axios';
import createGrafanaPanelObject from './createGrafanaPanelObject';
import { GrafanaDashboard, GrafanaDatasource, QueryStringPanelID } from '../../types';
import createPromQLQueries from './createPromQLQueries';

export default async function createGrafanaDashboard(
  containerID: string,
  containerName: string | undefined,
  datasource: GrafanaDatasource
): Promise<number> {
  // create dashboard object boilerplate
  const dashboard: GrafanaDashboard = {
    dashboard: {
      id: null,
      uid: containerID.slice(0, 12),
      title: containerName,
      tags: ['templated'],
      timezone: 'browser',
      schemaVersion: 16,
      version: 0,
      refresh: '10s',
      panels: [],
    },
    folderId: 0,
    overwrite: true,
  };

  // create an object by running imported createPromQLQueries function passing in ID
  const promQLQueries = createPromQLQueries(containerID);
  promQLQueries.forEach((queryObject: QueryStringPanelID) => {
    // push panels into dashboard object FOR EACH entry in promQLQueries object
    dashboard.dashboard.panels.push(
      createGrafanaPanelObject(
        containerName,
        containerID,
        queryObject.panelID,
        queryObject.queryString,
        datasource
      )
    );
  });

  try {
    const dashboardResponse = await axios.post(
      'http://host.docker.internal:2999/api/dashboards/db',
      JSON.stringify(dashboard),
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    // Descriptive error log for developers
    if (dashboardResponse.status >= 400) {
      console.log(
        'Error with POST request to Grafana Dashboards API. In createGrafanaDashboardObject.'
      );
    } else {
      // A simple console log to show when graphs are done being posted to Grafana.
      console.log(`📊 Grafana graphs 📊 for the ${containerName} container are ready!!`);
    }

    return dashboardResponse.status;
  } catch (err) {
    console.log(err);
  }

  return 400;
}
