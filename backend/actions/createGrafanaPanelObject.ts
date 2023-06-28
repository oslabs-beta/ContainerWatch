import {
  GrafanaDatasource,
  GrafanaPanelTargetsKey,
  GrafanaPanelFieldConfigKey,
  GrafanaPanel,
  GrafanaPanelOptionsKey,
} from '../types';

export default function createGrafanaPanelObject(
  containerName: string,
  id: number,
  promDatasource: GrafanaDatasource
): GrafanaPanel {

  const targets: GrafanaPanelTargetsKey = [
    {
      datasource: promDatasource,
      editorMode: 'builder',
      expr: `sum(rate(container_cpu_usage_seconds_total{name="${containerName}"}[$__interval])) * 100`,
      instant: false,
      range: true,
      refId: 'A',
    },
  ];

  const fieldConfigObject: GrafanaPanelFieldConfigKey = {
    defaults: {
      color: {
        mode: 'palette-classic',
      },
      custom: {
        axisCenteredZero: false,
        axisColorMode: 'text',
        axisLabel: '',
        axisPlacement: 'auto',
        barAlignment: 0,
        drawStyle: 'line',
        fillOpacity: 0,
        gradientMode: 'none',
        hideFrom: {
          legend: false,
          tooltip: false,
          viz: false,
        },
        lineInterpolation: 'linear',
        lineWidth: 1,
        pointSize: 5,
        scaleDistribution: {
          type: 'linear',
        },
        showPoints: 'auto',
        spanNulls: false,
        stacking: {
          group: 'A',
          mode: 'none',
        },
        thresholdsStyle: {
          mode: 'off',
        },
      },
      mappings: [],
      thresholds: {
        mode: 'absolute',
        steps: [
          {
            color: 'green',
            value: null,
          },
          {
            color: 'red',
            value: 80,
          },
        ],
      },
    },
    overrides: [],
  };

  const optionsObject: GrafanaPanelOptionsKey = {
    legend: {
      calcs: [],
      displayMode: 'list',
      placement: 'bottom',
      showLegend: true,
    },
    tooltip: {
      mode: 'single',
      sort: 'none',
    },
  };

  const dashboardPanel: GrafanaPanel = {
    datasource: promDatasource,
    fieldConfig: fieldConfigObject,
    gridPos: {
      h: 8,
      w: 12,
      x: 0,
      y: 0,
    },
    options: optionsObject,
    id: id,
    targets: targets,
    title: `${containerName} CPU`,
    type: 'timeseries',
  };

  return dashboardPanel;
}
