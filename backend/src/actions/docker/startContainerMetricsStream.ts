import axios from 'axios';
import { DOCKER_DAEMON_SOCKET_PATH } from '../../constants';
import {
  cpuGauge,
  memoryGauge,
  networkInGauge,
  networkOutGauge,
  pidsGauge,
} from '../../promClient';
import calculateDockerStats from './calculateDockerStats';
import { userAlerts } from '../../extensionServer';

// This is a streaming connection that will close when the container is deleted.
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
    const { cpu_usage_percent, memory_usage_percent, network_in_bytes, network_out_bytes, pids } =
      calculateDockerStats(stats);

    // Set the metrics gauges of the prometheus client
    cpuGauge.labels({ id }).set(cpu_usage_percent);
    memoryGauge.labels({ id }).set(memory_usage_percent);
    networkInGauge.labels({ id }).set(network_in_bytes);
    networkOutGauge.labels({ id }).set(network_out_bytes);
    pidsGauge.labels({ id }).set(pids);

    // Check if any of the user alert thresholds have been exceeded
    userAlerts.forEach((userAlert) => {
      const { targetMetric, threshold, containerId } = userAlert;

      // If not for this container, return early
      if (containerId !== id) return;

      switch (targetMetric) {
        case 'CPU %':
          if (cpu_usage_percent >= threshold) {
            userAlert.lastExceeded = Date.now();
          }
          break;
        case 'MEM %':
          if (memory_usage_percent >= threshold) {
            userAlert.lastExceeded = Date.now();
          }
          break;
        default:
          console.error(`Unknown target metric on user alert: "${targetMetric}"`);
      }
    });
  });

  stream.on('end', () => {
    console.log(`Stream ended for ${id} stats`);
  });
}
