/**
 * @description export functions that create promql queries with a passed in container ID
 */

export default function createPromQLQueries(id: string): any {
  function createCPUQuery(id: string): string {
    return `rate(cpu_usage_percent{id="${id}"}[$__interval])`;
  }

  function createRAMQuery(id: string): string {
    return `memory_usage_percent{id="${id}"}`;
  }

  return {
    1: createCPUQuery(id),
    2: createRAMQuery(id),
  };
}
