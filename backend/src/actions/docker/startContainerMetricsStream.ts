import axios from 'axios';
import { DOCKER_DAEMON_SOCKET_PATH } from '../../constants';
import { cpuGauge, memoryGauge } from '../../promClient';
import calculateDockerStats from './calculateDockerStats';

export default async function startContainerMetricsStream(id: string) {
  const response = await axios.get(`/containers/${id}/stats`, {
    socketPath: DOCKER_DAEMON_SOCKET_PATH,
    params: { all: true },
    responseType: 'stream',
  });

  const stream = response.data;

  stream.on('data', (data: Buffer) => {
    const stats = JSON.parse(data.toString());
    // Calculate the CPU % and MEM %
    // If the container is stopped, these values will be NaN
    const { cpu_usage_percent, memory_usage_percent } = calculateDockerStats(stats);
    // Set the metrics gauges of the prometheus client
    cpuGauge.labels({ id }).set(cpu_usage_percent);
    memoryGauge.labels({ id }).set(memory_usage_percent);
  });

  stream.on('end', () => {
    console.log(`Stream ended for ${id} stats`);
  });
}
