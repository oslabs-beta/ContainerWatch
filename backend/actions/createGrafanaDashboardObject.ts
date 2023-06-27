// import panelCreator from './buildPanel';
import { GrafanaDashboard } from '../types';

// export default async function dashboardCreator(containerName: string): Promise<Object> {

// export default const createGrafanaDashboardObject: GrafanaDashboard = function(containerName) {
  
// }

export default async function createGrafanaDashboardObject(containerName:any): Promise<GrafanaDashboard> {
  // fetch datasource information from grafana API.
  // this datasource is PRECONFIGURED on launch using grafana config
  const datasourceResponse = await fetch('http://host.docker.internal:2999/api/datasources');
  const datasourceData = await datasourceResponse.json();

  // create a datasource object to be used within panels
  const promDatasource = {
    type: datasourceData[0].type,
    uid: datasourceData[0].uid,
  };

  console.log('successfully retrieved datasource information:', promDatasource);
  // console.log(panelCreator('hello', 1, 'hello'));
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
