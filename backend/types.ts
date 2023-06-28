export type GrafanaDashboard = {
  dashboard: {
    id: null | number;
    title: string;
    tags: string[];
    timezone: string;
    schemaVersion: number;
    version: number;
    refresh: string;
    panels: GrafanaPanel[]; 
  };
  folderId: number;
  message: string;
  overwrite: boolean;
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
  };
  overrides: string[];
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
};
