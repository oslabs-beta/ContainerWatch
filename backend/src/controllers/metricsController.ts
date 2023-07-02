import axios from 'axios';
import { Request, Response, NextFunction } from 'express';

// Controller object for Metrics. Contains middleware that gets metrics at a passed in
// timestamp and creates an object with key-value pairs (Metric Type and Metric Value)
const metricsController = {
  getCPUMetrics: async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Destructure req.body.promQLBody to get variables from the frontend.
      const { containerID, time } = req.query;

      // Construct the query string for CPU % and the GET request URL for Prometheus API.
      const CPUQueryParam = `rate(cpu_usage_percent{id="${containerID}"}[10s])`

      // Make GET request to Prometheus API and store result in an accessible const.
      const prometheusResponse = await axios.get('http://host.docker.internal:9090/api/v1/query',{
        params: {
          query: CPUQueryParam,
          time: time
        }
      });
      const queryResult = prometheusResponse.data.data.result;

      // Set value equal to either 0 (No result from Prometheus) or the result from Prometheus.
      const queryValue = queryResult.length ? queryResult[0].value[1] : 'NaN';

      // If more metrics are added in the future, ensure that this middleware is called first!
      // Create an empty object to be passed down through res.locals.
      res.locals.metrics = {};

      // Set the key of CPU equal to the rounded, formatted query value.
      res.locals.metrics['CPU'] = queryValue;
      return next();
    } catch (err) {
      console.error(err);
    }
  },

  getMEMMetrics: async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Destructure req.body.promQLBody to get variables from the frontend.
      const { containerID, time } = req.query;

      // Construct the query string for MEM % and the GET request URL for Prometheus API.
      const MEMQueryParam = `avg(memory_usage_percent{id='${containerID}'})`

      // Make GET request to Prometheus API and store result in an accessible const.
      const prometheusResponse = await axios.get('http://host.docker.internal:9090/api/v1/query',{
        params: {
          query: MEMQueryParam,
          time: time
        }
      });
      const queryResult = prometheusResponse.data.data.result;

      // Set value equal to either 0 (No result from Prometheus) or the result from Prometheus.
      const queryValue = queryResult.length ? queryResult[0].value[1] : 'NaN';

      // Set the key of MEM equal to the rounded, formatted query value.
      res.locals.metrics['MEM'] = queryValue;
      return next();
    } catch (err) {
      console.error(err);
    }
  },
};

export default metricsController;
