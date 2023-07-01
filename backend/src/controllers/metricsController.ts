import axios from "axios";
import { Request, Response, NextFunction } from "express";

const metricsController = function() {};

metricsController.getCPUMetrics = async (req: Request, res: Response, next: NextFunction) => {
  try{
    const { containerID, time } = req.body;

    if(!containerID || !time) {
      // return error
    }

    const CPU_QUERY_STRING = `rate(cpu_usage_percent{id="${containerID}"}[10s])&time=${time}`
    const PROMQL_URL = `http://host.docker.internal:9090/api/v1/query?query=${CPU_QUERY_STRING}`



    const prometheusResponse = await axios.get(PROMQL_URL);
    console.log('prometheusResponse', prometheusResponse);
    const queryValue = parseInt(prometheusResponse.data.result[0].value[1]);
    console.log('queryValue', queryValue);
    
    res.locals.metrics = {};
    res.locals.metrics['CPU'] = queryValue;

    return next();
  } catch (err) {
    console.error(err);
  }
}

metricsController.getMEMMetrics = async (res: Response, req: Request, next: NextFunction) => {
   
  try{
    const { containerID, time } = req.body;
    if(!containerID || !time){
      //return error
    }

    const RAM_QUERY_STRING = `avg(memory_usage_percent{id='${containerID}'})&time=${time}`
    const PROMQL_URL = `http://host.docker.internal:9090/api/v1/query?query=${RAM_QUERY_STRING}`

    const prometheusResponse = await axios.get(PROMQL_URL);
    console.log('RAM prometheus response', prometheusResponse)
    const queryValue: any = parseInt(prometheusResponse.data.result[0].value[1]);
    console.log('RAM query value', queryValue);
    const queryValueRounded = (Math.round(queryValue * 100) / 100).toFixed(2);
    console.log('RAM query value rounded', queryValueRounded);


    res.locals.metrics = {};
    res.locals.metrics['MEM'] = queryValueRounded;
  }
  catch(err){
    console.error(err);
  }
}

// Conversion for front end
// const promTime = (Date.parse(time) / 1000).toFixed(3);

// {
//   CPU: number
//   MEM: number
//   NETIO: number
// }

export default metricsController;


    /*
    {
      status: string,
      data: {
        resultType: string,
        result: [
          {
            metric: {},
            value: [
              UNIX_TIMESTAMP,
              VALUE
            ]
          }
        ]
      }
    }
    */