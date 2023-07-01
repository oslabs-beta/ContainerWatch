import express from 'express';
import metricsController from './controllers/metricsController';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/hello', (req, res) => {
  console.log('ouch', Date.now());
  res.send('hello world from the server');
});

app.post('/api/promQL',
  (req,res,next) => {
    console.log('in the backend!');
    return next();
  },
  metricsController.getCPUMetrics,
  metricsController.getMEMMetrics,
  (req, res) => {
    return res.status(200).json(res.locals.metrics);
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