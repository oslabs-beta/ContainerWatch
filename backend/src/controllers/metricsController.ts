const metricsController = {};

metricsController.getCPUMetrics = async (req, res, next) => {
  try{
    const { containerID, time } = req.body;

    if(!containerID || !time) {
      //return error
    }

    res.locals.metrics = {};
    res.locals.metrics['CPU'] = null // PROMQL FETCH HERE

  } catch (err) {

  }
}



metricsController.getMEMMetrics = async (res, req, next) => {
  
  try{
    const { containerID, time } = req.body;
    if(!containerID || !time){
      
    }
    
  }
  catch(err){

  }
}


metricsController.getNETIOMetrics = async (res, req, next) => {
  
  try{
    const { containerID, time } = req.body;
    if(!containerID || !time){
      
    }
    
    res.locals.metrics['NETIO'] = null // PROMQL FETCH HERE
  }
  catch(err){

  }
}

// {
//   CPU: number
//   MEM: number
//   NETIO: number
// }

export default metricsController;