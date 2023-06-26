import panelCreator from './buildPanel.ts'

const dashboard = {
  dashboard: {
    id: null,
    title: 'prometheuscpu',
    tags: ['templated'],
    timezone: 'browser',
    schemaVersion: 16,
    version: 0,
    refresh: '15s',
    panels: [],
  },
  folderId: 0,
  message: 'DockerPulse is the BEST',
  overwrite: false,
};


const databaseResponse = await fetch('http://host.docker.internal:2999/api/datasources');
const databaseData = await databaseResponse.json();
console.log(databaseData);

const promDatasource = {
  type: databaseData[0].type,
  uid: databaseData[0].uid,
};

console.log(promDatasource);

export default function dashboardCreator(containerNames: Array<string>): void{

}