import express from 'express';
import metricsController from './controllers/metricsController';
import { UserAlert } from './types';

const app = express();

export const userAlerts: UserAlert[] = [];

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Simple endpoint to test backend connectivity
app.get('/hello', (req, res) => {
  console.log('ouch', Date.now());
  res.send('hello world from the server');
});

// GET request handler for endpoint /api/promQL.
// Expects query parameters for containerID and time.
app.get(
  '/api/promQL',
  metricsController.getCPUMetrics,
  metricsController.getMEMMetrics,
  (_req, res) => {
    return res.status(200).json(res.locals.metrics);
  }
);

app.get('/api/alerts', (req, res) => {
  console.log('GET user alerts');
  console.log(userAlerts);
  res.json(userAlerts);
});

app.post('/api/alerts', (req, res) => {
  const { name, containerId, targetMetric, threshold, email } = req.body;
  // Need some input validation

  if (name === 'bad') {
    console.log("User made an alert named 'bad'");
    return res.status(400).send('Bad input');
  }

  const newAlert: UserAlert = {
    uuid: 'asdf', // need uuid here
    name,
    containerId,
    targetMetric,
    threshold,
    email,
    lastExceeded: NaN,
    lastNotification: NaN,
    created: Date.now(),
  };

  userAlerts.push(newAlert);
  console.log(userAlerts);

  console.log('🚨 User made new alert!');
  console.log(newAlert);

  res.status(201).json(newAlert);
});

app.patch('/api/alerts', (req, res) => {
  res.sendStatus(200);
});

app.delete('/api/alerts', (req, res) => {
  res.sendStatus(200);
});

export default app;
