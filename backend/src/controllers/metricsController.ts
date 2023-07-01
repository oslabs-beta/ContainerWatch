import axios from 'axios';
import { Request, Response, NextFunction } from 'express';

// interface QueryResultObject {
//   metric: Object;
//   value: [number, 'NaN' | string]

// }

const metricsController = {
  getCPUMetrics: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { containerID, time } = req.body.promQLBody;
      console.log('------------------in get cpu metrics------------------');

      // if (!containerID || !time) {
      //   // return error
      // }
      res.locals.metrics = {};

      const CPU_QUERY_STRING = `rate(cpu_usage_percent{id="${containerID}"}[10s])&time=${time}`;
      const PROMQL_URL = `http://host.docker.internal:9090/api/v1/query?query=${CPU_QUERY_STRING}`;

      const prometheusResponse = await axios.get(PROMQL_URL);

      const queryValue =
        prometheusResponse.data.data.result.length === 0
          ? 0
          : parseInt(prometheusResponse.data.data.result[0].value[1]);
      console.log('queryValue', queryValue);

      const queryValueRounded = (Math.round(queryValue * 100) / 100).toFixed(2);
      console.log('CPU query value rounded', queryValueRounded);

      res.locals.metrics = {};
      res.locals.metrics['CPU'] = queryValueRounded;

      return next();
    } catch (err) {
      console.error(err);
    }
  },

  getMEMMetrics: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { containerID, time } = req.body.promQLBody;
      console.log('------------------in get cpu metrics------------------');

      // if (!containerID || !time) {
      //   //return error
      // }
      console.log(containerID, time);
      const RAM_QUERY_STRING = `avg(memory_usage_percent{id='${containerID}'})&time=${time}`;
      const PROMQL_URL = `http://host.docker.internal:9090/api/v1/query?query=${RAM_QUERY_STRING}`;

      const prometheusResponse = await axios.get(PROMQL_URL);

      const queryValue =
        prometheusResponse.data.data.result.length === 0
          ? 0
          : parseInt(prometheusResponse.data.data.result[0].value[1]);
      console.log('queryValue', queryValue);

      const queryValueRounded = (Math.round(queryValue * 100) / 100).toFixed(2);
      console.log('MEM query value rounded', queryValueRounded);

      res.locals.metrics['MEM'] = queryValueRounded;

      return next();
    } catch (err) {
      console.error(err);
    }
  },
};
// Conversion for front end
// const promTime = (Date.parse(time) / 1000).toFixed(3);

export default metricsController;
