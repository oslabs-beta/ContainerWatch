import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import emailValidator from 'email-validator';
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

// =============== Request handlers for Alerts functionality ===============
app.get('/api/alerts', (req, res) => {
  res.json(userAlerts);
});

app.post('/api/alerts', (req, res) => {
  const { name, containerId, targetMetric, threshold, email } = req.body as UserAlert;

  // Simple input validation
  if (threshold <= 0) {
    return res.status(400).send('Threshold must be a positive number');
  } else if (email && !emailValidator.validate(email)) {
    return res.status(400).send('Please provide a valid email or empty field');
  }

  const uuid = uuidv4();

  // Create the new UserAlert and return it to the client
  const newAlert: UserAlert = {
    uuid,
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

  res.status(201).json(newAlert);
});

app.put('/api/alerts/:uuid', (req, res) => {
  const { uuid } = req.params;
  const { name, containerId, targetMetric, threshold, email } = req.body as UserAlert;

  const alertIndex = userAlerts.findIndex((e) => e.uuid === uuid);

  if (alertIndex === -1) {
    return res.status(400).send('The alert was not found and could not be updated.');
  } else if (threshold <= 0) {
    return res.status(400).send('Threshold must be a positive number');
  } else if (email && !emailValidator.validate(email)) {
    return res.status(400).send('Please provide a valid email or empty field');
  }

  // Overwrite the existing UserAlert with the new
  const newAlert = {
    uuid,
    name,
    containerId,
    targetMetric,
    threshold,
    email,
    lastExceeded: NaN,
    lastNotification: NaN,
    created: Date.now(),
  };

  userAlerts[alertIndex] = newAlert;
  res.status(200).send(newAlert);
});

app.delete('/api/alerts/:uuid', (req, res) => {
  const { uuid } = req.params;

  const alertIndex = userAlerts.findIndex((e) => e.uuid === uuid);

  if (alertIndex === -1) {
    return res.status(400).send('The alert was not found and could not be deleted.');
  }

  const deletedAlert = userAlerts[alertIndex];

  // Delete the alert from the array
  userAlerts.splice(alertIndex, 1);

  return res.status(200).send(deletedAlert);
});

export default app;
