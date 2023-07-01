import axios from "axios";
import { Request, Response, NextFunction } from "express";

const metricsController = function() {};

metricsController.getCPUMetrics = async (req: Request, res: Response, next: NextFunction) => {
  try{
    const { containerID, time } = req.body;

    if(!containerID || !time) {
      // return error
    }

    const CPU_QUERY_STRING = `avg(memory_usage_percent{${containerID}})&time=${time}`
    const PROMQL_URL = `http://host.docker.internal:9090/api/v1/query?query=${CPU_QUERY_STRING}`

    const prometheusResponse = await axios.get(PROMQL_URL);


    res.locals.metrics = {};
    res.locals.metrics['CPU'] = prometheusResponse.data.result

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
    res.locals.metrics = {};
    res.locals.metrics['MEM'] = null // PROMQL FETCH HERE
  }
  catch(err){
    console.error(err);
  }
}

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