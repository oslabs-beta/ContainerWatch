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
const ID = 'bc4ed69f39b9';

const statsRequest = http.request(
  {
    socketPath: '/var/run/docker.sock', // path to docker engine
    path: `/containers/${ID}/stats`, // stream=true -> keep the connection open
  },
  (res) => {
    console.log('made the stats request....');

    // A chunk of data has been received.
    res.on('data', (chunk) => {
      console.log('---------------------stats-----------------------');
      const stats = JSON.parse(chunk.toString());
      console.log(stats);
    });

    // The whole response has been received.
    res.on('end', () => {
      console.log('request ended');
    });
  }
);

statsRequest.end();

app.listen(SOCKETFILE, () =>
  console.log(`🚀 Server listening on ${SOCKETFILE}`)
);
