import express from 'express';
import fs from 'fs';
import http from 'http';
import createGrafanaDashboardObject from './actions/createGrafanaDashboardObject';
import getGrafanaDatasource from './actions/getGrafanaDatasource';

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

// Interface that mimics container list response given by Docker
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

// Arrays that affiliate IDs and Container Names
const arrOfContainerIDs: string[] = [];
const arrOfContainerNames: string[][] = [];

// Function that bundles together functionality that will run after
// a set amount of time. The Grafana container currently takes a bit longer
// to finish loading compared to the DockerPulse container. This function
// makes DockerPulse wait before sending a fetch request to Grafana.
async function delayedRun() {
  const containerNames: any[] = [];
  const datasource = await getGrafanaDatasource();

  arrOfContainerNames.forEach((nameArray) => {
    let name = nameArray.pop();
    containerNames.push(name?.slice(1));
  });

  console.log(containerNames);
  for (let i = 0; i < arrOfContainerIDs.length; i++) {
    const dashy = await createGrafanaDashboardObject(
      arrOfContainerIDs[i],
      containerNames[i],
      datasource
    );

    await fetch('http://host.docker.internal:2999/api/dashboards/db', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dashy),
    });
  }
}

const onLoadRequest = http.request(
  {
    socketPath: '/var/run/docker.sock',
    path: encodeURI('/containers/json?all=1&filters={"status": ["running"]}'),
  },
  (res) => {
    console.log('made the on load request....');

    res.on('data', (chunk) => {
      console.log('------------------CONTAINERS RUNNING ON LOAD--------------------');
      console.log('--------------------Please wait 15 seconds----------------------');
      const parseData: DockerContainersList[] = JSON.parse(chunk.toString());

      parseData.forEach((el: DockerContainersList) => {
        arrOfContainerIDs.push(el.Id);
        arrOfContainerNames.push(el.Names);
      });
    });

    res.on('end', async () => {
      // extremely hacky solution, would love to see a better implementation
      // delay building initial dashboard by 15s to allow grafana more time
      // to finish spinning up
      setTimeout(delayedRun, 15000);
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

eventsRequest.end();
onLoadRequest.end();

app.listen(SOCKETFILE, () => console.log(`🚀 Server listening on ${SOCKETFILE}`));
