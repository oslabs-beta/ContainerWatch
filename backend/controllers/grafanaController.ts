/**
 * @description middlewares related to grafana API request/response cycle
 */

/*

MIDDLEWARES TODO:
  -handle GET request to datasource, need UID and name
  -handle POST request to dashboards api
    -create panels
    -create dashboard

*/

/*
EXPORT NOTES:

  -consistent with frontend:
    -export default const grafanaController: type? {
      middleware: 
      middleware:
      middleware:
    }
    -does this syntax work? or do we have to export each middleware individually
  -what i know works:
    -const grafanaController = {}
    -grafanaController.middlewareName..
    -export default grafanaController
*/