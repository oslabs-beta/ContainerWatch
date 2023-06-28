import express from 'express';
import { register } from './promClient';

const metricsServer = express();

// Prometheus is configured to scrape docker.host.internal:3333/metrics
metricsServer.get('/metrics', (req, res) => {
  res.setHeader('Content-Type', register.contentType);
  register.metrics().then((data) => res.status(200).send(data));
});

export default metricsServer;
