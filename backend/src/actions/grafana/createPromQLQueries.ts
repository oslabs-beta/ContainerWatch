/**
 * @description export functions that create promql queries with a passed in container ID
 */

// Interface to affiliate panelIds with queryStrings
interface queryStrings {
  panelID: string;
  queryString: string;
}

// Create a function that returns an an array of queryStrings.
// Allows space for additional queries.
export default function createPromQLQueries(id: string): any {
  const queryArray: queryStrings[] = [
    {
      panelID: '1',
      queryString: `rate(cpu_usage_percent{id="${id}"}[$__interval])`,
    },
    {
      panelID: '2',
      queryString: `memory_usage_percent{id="${id}"}`,
    },
  ];

  return queryArray;
}
