import { QueryStringPanelID } from '../../types';

// Create a function that returns an an array of queryStrings.
// Allows space for additional queries.
export default function createPromQLQueries(id: string): any {
  const queryArray: QueryStringPanelID[] = [
    {
      panelID: 1,
      queryString: `rate(cpu_usage_percent{id="${id}"}[$__interval])`,
    },
    {
      panelID: 2,
      queryString: `memory_usage_percent{id="${id}"}`,
    },
  ];

  return queryArray;
}
