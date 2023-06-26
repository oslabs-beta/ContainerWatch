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

const eventsRequest = http.request(
  {
    socketPath: '/var/run/docker.sock',
    path: encodeURI('/events?type=container&filters={"event": ["start", "destroy"]}'),
  },
  (res) => {
    console.log('made the events request....');

    // A chunk of data has been received.
    res.on('data', (chunk) => {
      console.log('---------------------NEW EVENT-----------------------');
      const event = JSON.parse(chunk.toString());
      console.log(event);
      if (event.action === 'start') {
        console.log('STARTED CONTAINER:', event.Actor.ID);
      } else if (event.action === 'destroy') {
        console.log('DESTROYED CONTAINER:', event.Actor.ID);
      }
    });

    // The whole response has been received.
    res.on('end', () => {
      console.log('request ended');
    });
  }
);


/* 
THIS IS JUST TO TEST FOR MODULARIZING GRAPHS!!
*/

const dashboard = {
  dashboard: {
    id: null,
    title: 'prometheuscpu',
    tags: ['templated'],
    timezone: 'browser',
    schemaVersion: 16,
    version: 0,
    refresh: '15s',
    panels: [],
  },
  folderId: 0,
  message: 'DockerPulse is the BEST',
  overwrite: false,
};

const dashboard2 = {
  dashboard: {
    id: null,
    title: 'prometheusram',
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

const panelBuilder = (containerName, id) => {
  if(id === 3) id = 4;

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
    id: id,
    targets: targets,
    title: `FROM FRONTEND ${containerName}`,
    type: 'timeseries',
  };

  return dashboardPanel;
};

const containerNames = ['prometheus', 'cadvisor', 'grafana'];

for (let i = 0; i < containerNames.length; i++) {
  const panel = panelBuilder(containerNames[i], i+1);
  dashboard.dashboard.panels.push(panel);
  dashboard2.dashboard.panels.push(panel);
}

await fetch('http://host.docker.internal:2999/api/dashboards/db', {
  method: 'POST',
  Accept: 'application/json',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(dashboard),
});

await fetch('http://host.docker.internal:2999/api/dashboards/db', {
  method: 'POST',
  Accept: 'application/json',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(dashboard2),
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


eventsRequest.end();

app.listen(SOCKETFILE, () => console.log(`🚀 Server listening on ${SOCKETFILE}`));