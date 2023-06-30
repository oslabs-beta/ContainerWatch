import express from 'express';

const app = express();

app.get('/hello', (req, res) => {
  console.log('ouch', Date.now());
  res.send('hello world from the server');
});

app.post('/api/promQL',
  getCPUMetrics.metricsController,
  getMEMMetrics.metricsController,
  (req, res) => {
    return res.status(200).json(res.locals.idk);
  }
)

export default app;

/*

BODY: {
  containerID: 'string'
  time: Date.now() format <-- unix time
}

try {
  const response = (await ddClient.extension.vm?.service?.post(
    '/api/promQL',
    { BODY }
  ))
} catch (err) {
  console.log(err)
}

*/