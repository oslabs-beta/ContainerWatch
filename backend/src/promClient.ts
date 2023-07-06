import prometheusClient from 'prom-client';

// Create Prometheus gauges to measure RAM and CPU
export const cpuGauge = new prometheusClient.Gauge({
  name: 'cpu_usage_percent',
  help: 'cpu_usage_percent',
  labelNames: ['id'],
});

export const memoryGauge = new prometheusClient.Gauge({
  name: 'memory_usage_percent',
  help: 'memory_usage_percent',
  labelNames: ['id'],
});

export const networkInGauge = new prometheusClient.Gauge({
  name: 'network_in_bytes',
  help: 'network_in_bytes',
  labelNames: ['id'],
});

export const networkOutGauge = new prometheusClient.Gauge({
  name: 'network_out_bytes',
  help: 'network_out_bytes',
  labelNames: ['id'],
});

export const pidsGauge = new prometheusClient.Gauge({
  name: 'pids',
  help: 'pids',
  labelNames: ['id'],
});

// Create Prometheus register and register the gauges
export const register = new prometheusClient.Registry();
register.registerMetric(cpuGauge);
register.registerMetric(memoryGauge);
register.registerMetric(networkInGauge);
register.registerMetric(networkOutGauge);
register.registerMetric(pidsGauge);
