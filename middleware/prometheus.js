const expressPromBundle = require('express-prom-bundle');
const Prometheus = require('prom-client');
const osUtils = require('os-utils');

const ONE_SECOND = 1000;
const ONE_MINUTE = ONE_SECOND * 60;

module.exports = prometheusMiddleware;

/**
 * Returns a middleware accessible at /metrics, exposing Prometheus metrics.
 *
 * @return {ExpressPromBundle}
 */
function prometheusMiddleware() {
  Prometheus.register.clear();
  prometheusMiddleware.registerCpuUsage();
  prometheusMiddleware.registerCpuCount();
  prometheusMiddleware.registerLoadAverage();
  return expressPromBundle({
    includeMethod: true,
    includeStatusCode: true,
    includePath: true,
  }).metricsMiddleware;
};

prometheusMiddleware.registerCpuCount = () => {
  const cpuCount = new Prometheus.Gauge({
    name: 'node_cpu_count',
    help: 'Number of CPUs',
  });
  (function cpuCountReporting() {
    cpuCount.set(osUtils.cpuCount());
    setTimeout(cpuCountReporting, ONE_MINUTE * 30);
  })();
};

prometheusMiddleware.registerCpuUsage = () => {
  const cpuUsage = new Prometheus.Gauge({
    name: 'node_cpu_usage',
    help: 'CPU usage (%)',
  });
  (function cpuUsageReporting() {
    osUtils.cpuUsage((value) => {
      cpuUsage.set(value);
      setTimeout(cpuUsageReporting, ONE_SECOND * 2);
    });
  })();
};

prometheusMiddleware.registerLoadAverage = () => {
  const loadAvg = {
    one: new Prometheus.Gauge({
      name: 'node_loadavg_1',
      help: 'Load average (1 minute)',
    }),
    five: new Prometheus.Gauge({
      name: 'node_loadavg_5',
      help: 'Load average (5 minutes)',
    }),
    fifteen: new Prometheus.Gauge({
      name: 'node_loadavg_15',
      help: 'Load average (15 minutes)',
    }),
  };
  (function loadAvgReporting() {
    loadAvg.one.set(osUtils.loadavg(1));
    loadAvg.five.set(osUtils.loadavg(5));
    loadAvg.fifteen.set(osUtils.loadavg(15));
    setTimeout(loadAvgReporting, ONE_MINUTE);
  })();
};

