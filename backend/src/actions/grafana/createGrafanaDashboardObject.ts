import createGrafanaPanelObject from './createGrafanaPanelObject';
import { GrafanaDashboard, GrafanaDatasource } from '../../types';
import createPromQLQueries from './createPromQLQueries';

export default async function createGrafanaDashboardObject(
  containerID: string,
  containerName: string | undefined,
  datasource: GrafanaDatasource
): Promise<GrafanaDashboard> {
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
      refresh: '5s',
      panels: [],
    },
    folderId: 0,
    overwrite: true,
  };

  // create an object by running imported createPromQLQueries function passing in ID
  const promQLQueries = createPromQLQueries(containerID);
  Object.keys(promQLQueries).forEach((panelID) => {
    // push panels into dashboard object FOR EACH entry in promQLQueries object
    dashboard.dashboard.panels.push(
      createGrafanaPanelObject(
        containerName,
        containerID,
        parseInt(panelID),
        promQLQueries[panelID],
        datasource
      )
    );
  });

  return dashboard;
}
