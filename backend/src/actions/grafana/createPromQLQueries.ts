import { QueryStringPanelID } from '../../types';

// Create a function that returns an an array of queryStrings.
// Allows space for additional queries.
export default function createPromQLQueries(id: string): any {
  const queryArray: QueryStringPanelID[] = [
    {
      panelID: 1,
      queryString: `cpu_usage_percent{id="${id}"}`,
    },
    {
      panelID: 2,
      queryString: `memory_usage_percent{id="${id}"}`,
    },
  ];

  return queryArray;
}
