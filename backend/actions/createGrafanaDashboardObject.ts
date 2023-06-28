import createGrafanaPanelObject from './createGrafanaPanelObject.ts';
import { GrafanaDashboard, GrafanaDatasource } from '../types';

// export default async function dashboardCreator(containerName: string): Promise<Object> {

// export default const createGrafanaDashboardObject: GrafanaDashboard = function(containerName) {
  
// }

export default async function createGrafanaDashboardObject(containerID: string, containerName: string, datasource: GrafanaDatasource): Promise<GrafanaDashboard> {

  console.log('in createGrafanadDashboardObject', datasource);

  const dashboard: GrafanaDashboard = {
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

  dashboard.dashboard.panels.push(createGrafanaPanelObject(containerName, 1, datasource));

  return dashboard;
}
