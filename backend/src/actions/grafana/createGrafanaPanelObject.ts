import {
  GrafanaDatasource,
  GrafanaPanelTargetsKey,
  GrafanaPanelFieldConfigKey,
  GrafanaPanel,
  GrafanaPanelOptionsKey,
} from '../../types';

export default function createGrafanaPanelObject(
  containerName: string | undefined,
  containerID: string,
  panelId: number,
  promQLQuery: string,
  promDatasource: GrafanaDatasource
): GrafanaPanel {
  let metricsName = '';
  // switch case to handle name of panel
  // if you add more metrics, add more cases here!
  switch (panelId) {
    case 1: {
      metricsName = 'CPU %';
      break;
    }
    case 2: {
      metricsName = 'MEM %';
      break;
    }
    default: {
      // panelId is being assigned in the file: createPromQLQueries.ts
      console.log('Please ensure you are properly assigning panelId');
      break;
    }
  }

  // create targets key for grafana panel
  const targets: GrafanaPanelTargetsKey = [
    {
      datasource: promDatasource,
      editorMode: 'builder',
      expr: promQLQuery,
      instant: false,
      range: true,
      refId: 'A',
    },
  ];

  // create fieldConfig key for grafana panel
  const fieldConfigObject: GrafanaPanelFieldConfigKey = {
    defaults: {
      color: {
        mode: 'palette-classic',
      },
      custom: {
        axisCenteredZero: false,
        axisColorMode: 'text',
        axisLabel: metricsName,
        axisPlacement: 'auto',
        barAlignment: 0,
        drawStyle: 'line',
        fillOpacity: 10, // Fill area under line
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
      min: 0,
    },
    overrides: [
      {
        matcher: {
          id: 'byName',
          options: 'Time',
        },
        properties: [
          {
            id: 'custom.fillBelowTo',
            value: 'Value',
          },
        ],
      },
    ],
  };

  // create options key for grafana panel
  const optionsObject: GrafanaPanelOptionsKey = {
    legend: {
      calcs: [],
      displayMode: 'list',
      placement: 'bottom',
      showLegend: false, // Do not show legend
    },
    tooltip: {
      mode: 'single',
      sort: 'none',
    },
  };

  // create grafana panel using previously built objects
  const grafanaPanel: GrafanaPanel = {
    datasource: promDatasource,
    fieldConfig: fieldConfigObject,
    gridPos: {
      h: 8,
      w: 12,
      x: 0,
      y: 0,
    },
    options: optionsObject,
    id: panelId,
    targets: targets,
    title: '', // No title on panel to conserve vertical space
    type: 'timeseries',
    interval: '10s',
  };

  // return the compiled grafana panel object
  return grafanaPanel;
}
