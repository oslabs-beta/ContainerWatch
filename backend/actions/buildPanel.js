// export default function panelCreator(containerName: string, id: number, promDatasource: any) {

export default function panelCreator(containerName, id, promDatasource) {
  const targets = [
    {
      datasource: promDatasource,
      editorMode: 'builder',
      expr: `sum(rate(container_cpu_usage_seconds_total{name="${containerName}"}[$__interval])) * 100`,
      instant: false,
      range: true,
      refId: 'A',
    },
  ];

  const dashboardPanel = {
    datasource: promDatasource,
    fieldConfig: {
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
    },
    gridPos: {
      h: 8,
      w: 12,
      x: 0,
      y: 0,
    },
    options: {
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
    },
    id: id,
    targets: targets,
    title: `FROM FRONTEND ${containerName}`,
    type: 'timeseries',
  };

  return dashboardPanel;
}
