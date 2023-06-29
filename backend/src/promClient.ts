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

// Create Prometheus register and register the gauges
export const register = new prometheusClient.Registry();
register.registerMetric(cpuGauge);
register.registerMetric(memoryGauge);
