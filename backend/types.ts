export type GrafanaDashboard = {
  dashboard: {
    id: null | number;
    title: string;
    tags: string[];
    timezone: string;
    schemaVersion: number;
    version: number;
    refresh: string;
    panels: any[]; // will replace with panel type
  };
  folderId: number;
  message: string;
  overwrite: boolean;
}

export type GrafanaDatasource = {
  type: string;
  uid: string;
}

export type GrafanaPanelTarget = {
  datasource: GrafanaDatasource;
  editorMode: string;
  expr: string;
  instant: boolean;
  range: boolean;
  refId: string;
}

export type GrafanaPanel = {
  
}