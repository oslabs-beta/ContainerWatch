export type GrafanaDashboard = {
  dashboard: {
    id: null | number;
    uid: string;
    title: string | undefined;
    tags: string[];
    timezone: string;
    schemaVersion: number;
    version: number;
    refresh: string;
    panels: GrafanaPanel[];
  };
  folderId: number;
  overwrite: boolean;
};

export type GrafanaDatasourceResponse = {
  id: number;
  uid: string;
  orgId: number;
  name: string;
  type: string;
  typeName: string;
  typeLogoUrl: string;
  access: string;
  url: string;
  user: string;
  database: string;
  basicAuth: boolean;
  isDefault: true;
  jsonData: {};
  readOnly: false;
};

export type GrafanaDatasource = {
  type: string;
  uid: string;
};

export type GrafanaPanelTargetsKey = [
  {
    datasource: GrafanaDatasource;
    editorMode: string;
    expr: string;
    instant: boolean;
    range: boolean;
    refId: string;
  }
];

export type GrafanaPanelFieldConfigKey = {
  defaults: {
    color: {
      mode: string;
    };
    custom: {
      axisCenteredZero: boolean;
      axisColorMode: string;
      axisLabel: string;
      axisPlacement: string;
      barAlignment: number;
      drawStyle: string;
      fillOpacity: number;
      gradientMode: string;
      hideFrom: {
        legend: boolean;
        tooltip: boolean;
        viz: boolean;
      };
      lineInterpolation: string;
      lineWidth: number;
      pointSize: number;
      scaleDistribution: {
        type: string;
      };
      showPoints: string;
      spanNulls: boolean;
      stacking: {
        group: string;
        mode: string;
      };
      thresholdsStyle: {
        mode: string;
      };
    };
    mappings: string[];
    thresholds: {
      mode: string;
      steps: {
        color: string;
        value: number | null;
      }[];
    };
    min?: number;
    max?: number;
  };
  overrides: panelOverrideProperties[];
};

export type panelOverrideProperties = {
  matcher: {
    id: string;
    options: string;
  };
  properties: {
    id: string;
    value: string;
  }[];
};

export type GrafanaPanelOptionsKey = {
  legend: {
    calcs: string[];
    displayMode: string;
    placement: string;
    showLegend: boolean;
  };
  tooltip: {
    mode: string;
    sort: string;
  };
};

export type GrafanaPanel = {
  datasource: GrafanaDatasource;
  fieldConfig: GrafanaPanelFieldConfigKey;
  gridPos: {
    h: number;
    w: number;
    x: number;
    y: number;
  };
  options: GrafanaPanelOptionsKey;
  id: number;
  targets: GrafanaPanelTargetsKey;
  title: string;
  type: string;
  interval: string;
};

export type DockerContainer = {
  Id: string;
  Names: string[];
  Image: string;
  ImageID: string;
  Command: string;
  Ports: Object[];
  Labels: Object;
  State: string;
  Status: string;
  HostConfig: Object;
  NetworkSettings: Object;
  Mounts: Object[];
};

export type QueryStringPanelID = {
  panelID: number;
  queryString: string;
};
