import express from 'express';
import fs from 'fs';
import http from 'http';
// import dashboardCreator from './actions/buildDashboard';

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

const onLoadRequest = http.request(
  {
    socketPath: '/var/run/docker.sock',
    path: encodeURI('/containers/json?all=1&filters={"status": ["running"]}'),
  },
  (res) => {
    console.log('made the on load request....');

    res.on('data', (chunk) => {
      console.log('---------------------gimme da data pls-----------------------');
      const parseData = JSON.parse(chunk.toString());
      console.log(parseData);
    });

    res.on('end', () => {
      console.log('onLoad req ended');
    })
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

// const arr = ['prometheus', 'cadvisor', 'grafana'];

// for (let i = 0; i < arr.length; i++) {
//   const dash = await dashboardCreator(arr[i]);
//   console.log('new dashboard!!', dash);
//   await fetch('http://host.docker.internal:2999/api/dashboards/db', {
//     method: 'POST',
//     Accept: 'application/json',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify(dash),
//   });
// }

eventsRequest.end();
onLoadRequest.end();

app.listen(SOCKETFILE, () => console.log(`🚀 Server listening on ${SOCKETFILE}`));
