import express from 'express';
import metricsController from './controllers/metricsController';

const app = express();

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Simple endpoint to test backend connectivity
app.get('/hello', (req, res) => {
  console.log('ouch', Date.now());
  res.send('hello world from the server');
});

// Post request handler for endpoint /api/promQL
app.post(
  '/api/promQL',
  metricsController.getCPUMetrics,
  metricsController.getMEMMetrics,
  (_req, res) => {
    return res.status(200).json(res.locals.metrics);
  }
);

export default app;