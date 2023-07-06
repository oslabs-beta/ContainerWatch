/**
 * The calculations below for `memory_usage_percent` and `cpu_usage_percent` match
 * the MEM% and CPU% stats given by the `docker stats` command of the docker CLI.
 * The calculations are provided in these docs:
 * https://docs.docker.com/engine/api/v1.43/#tag/Container/operation/ContainerStats
 */

export default function calculateDockerStats(stats: any) {
  const { memory_stats, cpu_stats, precpu_stats, networks, pids_stats } = stats;

  // Calculate memory usage as a percent
  const used_memory = memory_stats.usage - (memory_stats.stats?.cache || 0);
  const available_memory = memory_stats.limit;
  const memory_usage_percent = (used_memory / available_memory) * 100.0;

  // Calculate cpu usage as a percent
  const cpu_delta = cpu_stats.cpu_usage.total_usage - precpu_stats.cpu_usage.total_usage;
  const system_cpu_delta = cpu_stats.system_cpu_usage - precpu_stats.system_cpu_usage;
  const number_cpus = cpu_stats.online_cpus;
  const cpu_usage_percent = (cpu_delta / system_cpu_delta) * number_cpus * 100.0;

  // Calculate network I/O
  const allNetworks = Object.values(networks || {}) as {
    rx_bytes?: number;
    tx_bytes?: number;
  }[];
  const network_in_bytes = allNetworks.reduce((sum, network) => sum + (network.rx_bytes || 0), 0);
  const network_out_bytes = allNetworks.reduce((sum, network) => sum + (network.tx_bytes || 0), 0);

  // Calculate PIDs
  const pids = pids_stats.current || 0;

  return { cpu_usage_percent, memory_usage_percent, network_in_bytes, network_out_bytes, pids };
}
