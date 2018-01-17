const Prometheus = require('prom-client');
const prometheusMiddleware = require('../../middleware/prometheus');

describe('middleware/prometheus', () => {
  it('works as expected', () => {
    expect(prometheusMiddleware).to.be.a('function');
  });

  describe('.registerCpuUsage', () => {
    it('works as expected', () => {
      expect(prometheusMiddleware.registerCpuUsage).to.be.a('function');
    });
  });

  describe('()', () => {
    let registerCpuCount = null;
    let registerCpuUsage = null;
    let registerLoadAverage = null;

    before(() => {
      registerCpuCount = prometheusMiddleware.registerCpuCount;
      registerCpuUsage = prometheusMiddleware.registerCpuUsage;
      registerLoadAverage = prometheusMiddleware.registerLoadAverage;
      prometheusMiddleware.registerCpuCount = sinon.spy();
      prometheusMiddleware.registerCpuUsage = sinon.spy();
      prometheusMiddleware.registerLoadAverage = sinon.spy();
    });

    after(() => {
      prometheusMiddleware.registerCpuCount = registerCpuCount;
      prometheusMiddleware.registerCpuUsage = registerCpuUsage;
      prometheusMiddleware.registerLoadAverage = registerLoadAverage;
    });

    it('works as expected', () => {
      expect(prometheusMiddleware()).to.be.a('function');
      expect(prometheusMiddleware.registerCpuCount).to.be.calledOnce;
      expect(prometheusMiddleware.registerCpuUsage).to.be.calledOnce;
      expect(prometheusMiddleware.registerLoadAverage).to.be.calledOnce;
    });

    describe('register behaviour', () => {
      let register = null;

      before(() => {
        Prometheus.register.clear();
        register = Prometheus.register;
        Prometheus.register = {
          clear: sinon.spy(),
        };
      });

      after(() => {
        Prometheus.register = register;
      });

      it('is cleared on initialisation', () => {
        prometheusMiddleware();
        expect(Prometheus.register.clear).to.be.calledOnce;
      });
    });
  });

  describe('.registerCpuCount', () => {
    let gauge = null;
    let setTimeout = null;

    const gaugeSpy = sinon.spy();
    const setSpy = sinon.spy();

    before(() => {
      gauge = Prometheus.Gauge;
      setTimeout = global.setTimeout;
      Prometheus.Gauge = function(...args) {
        gaugeSpy.apply(null, [...args]);
        return {
          set: setSpy,
        };
      };
      global.setTimeout = sinon.spy();
    });

    after(() => {
      Prometheus.Gauge = gauge;
      global.setTimeout = setTimeout;
    });

    afterEach(() => {
      gaugeSpy.resetHistory();
      setSpy.resetHistory();
      global.setTimeout.resetHistory();
    });

    it('creates a `node_cpu_count` metric', () => {
      const HALF_AN_HOUR = 1000 * 60 * 30;
      prometheusMiddleware.registerCpuCount();
      expect(gaugeSpy).to.be.calledOnce;
      expect(gaugeSpy.args[0][0].name).to.eql('node_cpu_count');
      expect(setSpy).to.be.calledOnce;
      expect(global.setTimeout).to.be.calledOnce;
      expect(global.setTimeout.args[0][0]).to.be.a('function');
      expect(global.setTimeout.args[0][1]).to.eql(HALF_AN_HOUR);
    });
  });

  describe('.registerCpuUsage', () => {
    let gauge = null;
    let setTimeout = null;

    const gaugeSpy = sinon.spy();
    const setSpy = sinon.spy();

    before(() => {
      gauge = Prometheus.Gauge;
      setTimeout = global.setTimeout;
      Prometheus.Gauge = function(...args) {
        gaugeSpy.apply(null, [...args]);
        return {
          set: setSpy,
        };
      };
      global.setTimeout = sinon.spy();
    });

    after(() => {
      Prometheus.Gauge = gauge;
      global.setTimeout.resetHistory();
      global.setTimeout = setTimeout;
    });

    afterEach(() => {
      gaugeSpy.resetHistory();
      setSpy.resetHistory();
      global.setTimeout.resetHistory();
    });

    it('creates a `node_cpu_usage` metric', () => {
      const TWO_SECONDS = 1000 * 2;
      prometheusMiddleware.registerCpuUsage();
      expect(gaugeSpy).to.be.calledOnce;
      expect(gaugeSpy.args[0][0].name).to.eql('node_cpu_usage');
      // the weird logic below is because of the `os-utils` package behaviour,
      // they use a setTimeout internally to trigger a callback, hence we do
      // the same but call the callback immediately
      expect(global.setTimeout).to.be.calledOnce;
      global.setTimeout.args[0][0]();
      expect(setSpy).to.be.calledOnce;
      expect(global.setTimeout).to.be.calledTwice;
      expect(global.setTimeout.args[1][1]).to.eql(TWO_SECONDS);
    });
  });

  describe('.registerLoadAverage', () => {
    let gauge = null;
    let setTimeout = null;

    const gaugeSpy = sinon.spy();
    const setSpy = sinon.spy();

    before(() => {
      gauge = Prometheus.Gauge;
      setTimeout = global.setTimeout;
      Prometheus.Gauge = function(...args) {
        gaugeSpy.apply(null, [...args]);
        return {
          set: setSpy,
        };
      };
      global.setTimeout = sinon.spy();
    });

    after(() => {
      Prometheus.Gauge = gauge;
      global.setTimeout = setTimeout;
    });

    afterEach(() => {
      gaugeSpy.resetHistory();
      setSpy.resetHistory();
      global.setTimeout.resetHistory();
    });

    it('creates a `node_loadavg_(1,5,15)` metric', () => {
      const ONE_MINUTE = 1000 * 60;
      prometheusMiddleware.registerLoadAverage();
      expect(gaugeSpy).to.be.calledThrice;
      expect(gaugeSpy.args[0][0].name).to.eql('node_loadavg_1');
      expect(gaugeSpy.args[1][0].name).to.eql('node_loadavg_5');
      expect(gaugeSpy.args[2][0].name).to.eql('node_loadavg_15');
      expect(setSpy).to.be.calledThrice;
      expect(global.setTimeout.args[0][1]).to.eql(ONE_MINUTE);
    });
  });
});
