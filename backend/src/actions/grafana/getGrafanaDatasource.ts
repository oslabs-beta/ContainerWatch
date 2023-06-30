import { GrafanaDatasource, GrafanaDatasourceResponse } from '../../types';
import axios from 'axios';

export default async function getGrafanaDatasource(): Promise<GrafanaDatasource> {
  // Fetch datasource information from grafana API.
  // This datasource is PRECONFIGURED on launch using grafana config.
  const datasourceResponse = await axios.get('http://host.docker.internal:2999/api/datasources');

  // Axios parses data for you in the response
  // This line is unnecessary. It is simply here for readability.
  const datasourceData: GrafanaDatasourceResponse[] = datasourceResponse.data;

  // Create a datasource object to be used within panels.
  const datasource: GrafanaDatasource = {
    type: datasourceData[0].type,
    uid: datasourceData[0].uid,
  };

  return datasource;
}
