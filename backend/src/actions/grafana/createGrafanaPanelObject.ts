import {
  GrafanaDatasource,
  GrafanaPanelTargetsObject,
  GrafanaPanelFieldConfigKey,
  GrafanaPanel,
  GrafanaPanelOptionsKey,
  panelOverrideProperties,
  QueryStringPanelID,
} from '../../types';

export default function createGrafanaPanelObject(
  promQLQueries: QueryStringPanelID[],
  promDatasource: GrafanaDatasource
): GrafanaPanel {
  // Create overrides property for fieldConfigsObject
  const panelOverrides: panelOverrideProperties[] = [
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
  ];

  // Create fieldConfig key for Grafana panel.
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
        showPoints: 'never',
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
    overrides: panelOverrides,
  };

  // Create options key for Grafana panel
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

  // Create grafana panel using previously built objects.
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
    id: 1,
    targets: [],
    title: '', // No title on panel to conserve vertical space
    type: 'timeseries',
    interval: '10s',
  };

  // Switch case to handle name of panel.
  // If you add more metrics, add more cases here!
  promQLQueries.forEach((el) => {
    // Declare variable metrics Id that gets assigned to panelId
    let metricsId = el.panelID;

    // Declare variable metrics name that gets assigned based on PanelID
    let metricsName = '';

    // Declare a variable to store panelOverrideProperty for color
    let metricsOverrides: panelOverrideProperties = {};

    // Create targets key for Grafana panel.
    const targetsObject: GrafanaPanelTargetsObject = {
      datasource: promDatasource,
      editorMode: 'builder',
      expr: el.queryString,
      instant: false,
      range: true,
      refId: el.panelID.toString(),
    };

    switch (metricsId) {
      case 1: {
        metricsName = 'CPU %';
        metricsOverrides = {
          matcher: {
            id: 'byName',
            options: 'cpu_usage_percent',
          },
          properties: [
            {
              id: 'displayName',
              value: metricsName,
            },
            {
              id: 'color',
              value: {
                mode: 'fixed',
                fixedColor: 'dark-orange',
              },
            },
            {
              id: 'custom.axisPlacement',
              value: 'left',
            },
            {
              id: 'custom.axisLabel',
              value: metricsName,
            },
          ],
        };
        break;
      }
      case 2: {
        metricsName = 'MEM %';
        metricsOverrides = {
          matcher: {
            id: 'byName',
            options: 'memory_usage_percent',
          },
          properties: [
            {
              id: 'displayName',
              value: metricsName,
            },
            {
              id: 'color',
              value: {
                mode: 'fixed',
                fixedColor: 'dark-blue',
              },
            },
            {
              id: 'custom.axisPlacement',
              value: 'right',
            },
            {
              id: 'custom.axisLabel',
              value: metricsName,
            },
          ],
        };
        break;
      }
      default: {
        // PanelId is being assigned in the file: createPromQLQueries.ts
        console.log('Please ensure you are properly assigning affiliating metrics to an Id');
        break;
      }
    }

    grafanaPanel.targets.push(targetsObject);
    panelOverrides.push(metricsOverrides);
  });

  // return the compiled grafana panel object
  return grafanaPanel;
}
