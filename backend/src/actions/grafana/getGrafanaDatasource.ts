import { GrafanaDatasource } from '../../../types';

export default async function getGrafanaDatasource(): Promise<GrafanaDatasource> {
  // fetch datasource information from grafana API.
  // this datasource is PRECONFIGURED on launch using grafana config
  const datasourceResponse: any = await fetch('http://host.docker.internal:2999/api/datasources');

  // parse datasource response
  const datasourceData = await datasourceResponse.json();

  // create a datasource object to be used within panels
  const datasource: GrafanaDatasource = {
    type: datasourceData[0].type,
    uid: datasourceData[0].uid,
  };

  return datasource;
}
