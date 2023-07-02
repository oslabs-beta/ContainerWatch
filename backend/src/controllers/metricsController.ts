import axios from 'axios';
import { Request, Response, NextFunction } from 'express';

// Controller object for Metrics. Contains middleware that gets metrics at a passed in
// timestamp and creates an object with key-value pairs (Metric Type and Metric Value)
const metricsController = {
  getCPUMetrics: async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Destructure req.body.promQLBody to get variables from the frontend.
      const { containerID, time } = req.body.promQLBody;

      // Construct the query string for CPU % and the GET request URL for Prometheus API.
      const CPU_QUERY_STRING = `rate(cpu_usage_percent{id="${containerID}"}[10s])&time=${time}`;
      const PROMQL_URL = `http://host.docker.internal:9090/api/v1/query?query=${CPU_QUERY_STRING}`;

      // Make GET request to Prometheus API and store result in an accessible const.
      const prometheusResponse = await axios.get(PROMQL_URL);
      const queryResult = prometheusResponse.data.data.result;

      // Set value equal to either 0 (No result from Prometheus) or the result from Prometheus.
      const queryValue = queryResult.length ? queryResult[0].value[1] : 0;

      // Round value to two decimal places.
      const queryValueRounded = (Math.round(queryValue * 100) / 100).toFixed(2);

      // If more metrics are added in the future, ensure that this middleware is called first!
      // Create an empty object to be passed down through res.locals.
      res.locals.metrics = {};

      // Set the key of CPU equal to the rounded, formatted query value.
      res.locals.metrics['CPU'] = queryValueRounded;
      return next();
    } catch (err) {
      console.error(err);
    }
  },

  getMEMMetrics: async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Destructure req.body.promQLBody to get variables from the frontend.
      const { containerID, time } = req.body.promQLBody;

      // Construct the query string for MEM % and the GET request URL for Prometheus API.
      const RAM_QUERY_STRING = `avg(memory_usage_percent{id='${containerID}'})&time=${time}`;
      const PROMQL_URL = `http://host.docker.internal:9090/api/v1/query?query=${RAM_QUERY_STRING}`;

      // Make GET request to Prometheus API and store result in an accessible const.
      const prometheusResponse = await axios.get(PROMQL_URL);
      const queryResult = prometheusResponse.data.data.result;

      // Set value equal to either 0 (No result from Prometheus) or the result from Prometheus.
      const queryValue = queryResult.length ? queryResult[0].value[1] : 0;

      // Round value to two decimal places.
      const queryValueRounded = (Math.round(queryValue * 100) / 100).toFixed(2);

      // Set the key of MEM equal to the rounded, formatted query value.
      res.locals.metrics['MEM'] = queryValueRounded;
      return next();
    } catch (err) {
      console.error(err);
    }
  },
};

export default metricsController;
