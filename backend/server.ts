import express from 'express';
import fs from 'fs';
import http from 'http';
import { dashboardCreator } from './actions/createGrafanaDashboardObject.ts';
import { test1 } from './actions/test.ts';

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

export interface DockerContainersList {
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
}

const arrOfContainerIDs: string[] = [];
const arrOfContainerNames: string[][] = [];

const onLoadRequest = http.request(
  {
    socketPath: '/var/run/docker.sock',
    path: encodeURI('/containers/json?all=1&filters={"status": ["running"]}'),
  },
  (res) => {
    console.log('made the on load request....');

    res.on('data', (chunk) => {
      console.log('---------------------gimme da data pls-----------------------');
      const parseData: DockerContainersList[] = JSON.parse(chunk.toString());
      console.log(parseData);

      parseData.forEach((el: DockerContainersList) => {
        arrOfContainerIDs.push(el.Id);
        arrOfContainerNames.push(el.Names);
      });
    });

    res.on('end', () => {
      // console.log('List of all running container ids:', arrOfContainerIDs);
      // console.log('List of all running container names:', arrOfContainerNames);
      console.log('beginning of end on load request');

      const arr = ['prometheus', 'cadvisor', 'grafana'];
      const dashy = dashboardCreator(arr[0]).then();
      console.log(dashy);
      test1();

      // async function dash(){
      //   for (let i = 0; i < arr.length; i++) {
      //     const dashb = await dashboardCreator(arr[i]);
      //     console.log('new dashboard!!', dashb);
      //     await fetch('http://host.docker.internal:2999/api/dashboards/db', {
      //       method: 'POST',
      //       // Accept: 'application/json',
      //       headers: {
      //         'Content-Type': 'application/json',
      //       },
      //       body: JSON.stringify(dashb),
      //     });
      //   }
      // }

      // dash();

      console.log('onLoad req ended');
    });
  }
);

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

queryForCPU = sum(rate(query=${containerID}))
queryForRAM = sum(rate(query=${containerID}))
queryForNETIO = sum(rate(query=${containerID}))
queryFor = sum(rate(query=${containerID}))



*/

/* 
THIS IS JUST TO TEST FOR MODULARIZING GRAPHS!!
*/

//CREATE PANELS PROGRAMMATICALLY

eventsRequest.end();
onLoadRequest.end();

app.listen(SOCKETFILE, () => console.log(`🚀 Server listening on ${SOCKETFILE}`));
