import express from 'express';
import fs from 'fs';
import http from 'http';

const SOCKETFILE = '/run/guest-services/backend.sock'; // Unix socket
const app = express();

// After a server is done with the unix domain socket, it is not automatically destroyed.
// You must instead unlink the socket in order to reuse that address/path.
// To do this, we delete the file with fs.unlinkSync()
try {
  fs.unlinkSync(SOCKETFILE);
  console.log('Deleted the UNIX socket file.');
} catch (err) {
  console.log('Did not need to delete the UNIX socket file.');
}

// This is a simple endpoint to test the backend
app.get('/hello', (req, res) => {
  console.log('ouch', Date.now());
  res.send('hello world from the server');
});

// This section is to show how the Docker Engine API is used
// Ref: https://docs.docker.com/engine/api/v1.43/#tag/Container/operation/ContainerStats
// const ID = 'bc4ed69f39b9';

// const statsRequest = http.request(
//   {
//     socketPath: '/var/run/docker.sock',
//     path: `/containers/${ID}/stats`, // stream=true -> keep the connection open
//   },
//   (res) => {
//     console.log('made the stats request....');

//     // A chunk of data has been received.
//     res.on('data', (chunk) => {
//       console.log('---------------------stats-----------------------');
//       const stats = JSON.parse(chunk.toString());
//       console.log(stats);
//     });

//     // The whole response has been received.
//     res.on('end', () => {
//       console.log('request ended');
//     });
//   }
// );

// statsRequest.end();

/* 
THIS IS JUST TO TEST FOR MODULARIZING GRAPHS!!
*/

const dashboard = {
  dashboard: {
    id: null,
    uid: 'dockerpulse',
    title: 'dockerpulse dashboard',
    tags: ['templated'],
    timezone: 'browser',
    schemaVersion: 16,
    version: 0,
    refresh: '15s',
    panels: [],
  },
  folderId: 0,
  message: 'DockerPulse is the BEST',
  overwrite: true,
};

//CREATE PANELS PROGRAMMATICALLY

const databaseResponse = await fetch('http://host.docker.internal:2999/api/datasources');
const databaseData = await databaseResponse.json();
console.log(databaseData);

const promDatasource = {
  type: databaseData[0].type,
  uid: databaseData[0].uid,
};

console.log(promDatasource);

const panelBuilder = (containerName, uid) => {
  const targets = [
    {
      datasource: promDatasource,
      editorMode: 'builder',
      expr: `sum(rate(container_cpu_usage_seconds_total{name=\"${containerName}\"}[$__interval])) * 100`,
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
    targets: targets,
    title: `FROM FRONTEND ${containerName}`,
    type: 'timeseries',
    uid: uid,
  };

  return dashboardPanel;
};

const containerNames = ['prometheus', 'cadvisor', 'grafana'];
const containerUIDs = ['123', '456', '789'];

for (let i = 0; i < containerNames.length; i++) {
  const panel = panelBuilder(containerNames[i], containerUIDs[i]);
  dashboard.dashboard.panels.push(panel);
}

console.log(JSON.stringify(dashboard));
await fetch('http://host.docker.internal:2999/api/dashboards/db', {
  method: 'POST',
  Accept: 'application/json',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(dashboard),
});

/*
"panels": [
  {
    
    "id": 1,
    
    
    
  },
  {
    "datasource": {
      "type": "prometheus",
      "uid": "PBFA97CFB590B2093"
    },
    "fieldConfig": {
      "defaults": {
        "color": {
          "mode": "palette-classic"
        },
        "custom": {
          "axisCenteredZero": false,
          "axisColorMode": "text",
          "axisLabel": "",
          "axisPlacement": "auto",
          "barAlignment": 0,
          "drawStyle": "line",
          "fillOpacity": 0,
          "gradientMode": "none",
          "hideFrom": {
            "legend": false,
            "tooltip": false,
            "viz": false
          },
          "lineInterpolation": "linear",
          "lineWidth": 1,
          "pointSize": 5,
          "scaleDistribution": {
            "type": "linear"
          },
          "showPoints": "auto",
          "spanNulls": false,
          "stacking": {
            "group": "A",
            "mode": "none"
          },
          "thresholdsStyle": {
            "mode": "off"
          }
        },
        "mappings": [],
        "thresholds": {
          "mode": "absolute",
          "steps": [
            {
              "color": "green",
              "value": null
            },
            {
              "color": "red",
              "value": 80
            }
          ]
        }
      },
      "overrides": []
    },
    "gridPos": {
      "h": 8,
      "w": 12,
      "x": 0,
      "y": 0
    },
    "id": 2,
    "options": {
      "legend": {
        "calcs": [],
        "displayMode": "list",
        "placement": "bottom",
        "showLegend": true
      },
      "tooltip": {
        "mode": "single",
        "sort": "none"
      }
    },
    "targets": [
      {
        "datasource": {
          "type": "prometheus",
          "uid": "PBFA97CFB590B2093"
        },
        "editorMode": "builder",
        "expr": "sum(rate(container_cpu_usage_seconds_total{name=\"prometheus\"}[$__interval])) * 100",
        "instant": false,
        "range": true,
        "refId": "A"
      }
    ],
    "title": "prom2",
    "type": "timeseries"
  }
]
*/

app.listen(SOCKETFILE, () => console.log(`🚀 Server listening on ${SOCKETFILE}`));