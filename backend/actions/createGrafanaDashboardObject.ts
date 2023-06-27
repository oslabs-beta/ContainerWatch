// import panelCreator from './buildPanel';
import { GrafanaDashboard, GrafanaDatasource } from '../types';

// export default async function dashboardCreator(containerName: string): Promise<Object> {

// export default const createGrafanaDashboardObject: GrafanaDashboard = function(containerName) {
  
// }

export default async function createGrafanaDashboardObject(containerName:any, datasource: GrafanaDatasource): Promise<GrafanaDashboard> {

  console.log('in createGrafanadDashboardObject', datasource);

  const dashboard = {
    dashboard: {
      id: null,
      title: containerName,
      tags: ['templated'],
      timezone: 'browser',
      schemaVersion: 16,
      version: 0,
      refresh: '15s',
      panels: [],
    },
    folderId: 0,
    message: 'DockerPulse is the BEST',
    overwrite: true,
  };

  // dashboard.dashboard.panels.push(panelCreator(containerName, 1, promDatasource));

  return dashboard;
}
