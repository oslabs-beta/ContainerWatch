import createGrafanaPanelObject from './createGrafanaPanelObject';
import { GrafanaDashboard, GrafanaDatasource } from '../types';

export default async function createGrafanaDashboardObject(
  containerID: string,
  containerName: string,
  datasource: GrafanaDatasource
): Promise<GrafanaDashboard> {
  // create dashboard object boilerplate
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

  // push grafana panels into panels key by invoking createGrafanaPanelObject
  dashboard.dashboard.panels.push(createGrafanaPanelObject(containerName, 1, datasource));

  return dashboard;
}
