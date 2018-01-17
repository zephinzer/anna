const corsMiddleware = require('../../middleware/cors');
const config = require('../../config');

describe('middleware/cors', () => {
  it('exports the correct stuff', () => {
    expect(corsMiddleware).to.be.a('function');
    expect(corsMiddleware()).to.be.a('function');
    expect(corsMiddleware).to.have.keys([
      'allowedHeaders',
      'allowedMethods',
      'originFilter',
    ]);
  });

  describe('.allowedHeaders', () => {
    it('allows the correct headers', () => {
      expect(corsMiddleware.allowedHeaders).to.include(
        'Content-Type',
        'X-AuthKey',
        'X-AuthToken'
      );
    });
  });

  describe('.allowedMethods', () => {
    it('allows the correct methods', () => {
      expect(corsMiddleware.allowedMethods).to.include(
        'GET',
        'POST',
        'PATCH',
        'DELETE',
        'HEAD',
        'OPTIONS'
      );
    });
  });

  describe('.originFilter', () => {
    let allowedOrigins = null;

    before(() => {
      allowedOrigins = config.allowedOrigins;
      config.allowedOrigins = [
        '_allowed_origin_1',
        '_allowed_origin_2',
        '_allowed_origin_3',
      ];
    });

    after(() => {
      config.allowedOrigins = allowedOrigins;
    });

    it('works as expected', (done) => {
      corsMiddleware.originFilter(
        config.allowedOrigins[0], (err, value) => {
        expect(err).to.eql(null);
        expect(value).to.eql(true);
        done();
      });
    });

    it('works as expected (with multiple ALLOWED_ORIGINs)', (done) => {
      corsMiddleware.originFilter(
        config.allowedOrigins[2], (err, value) => {
        expect(err).to.eql(null);
        expect(value).to.eql(true);
        done();
      });
    });

    it('works as expected when origin is null', (done) => {
      corsMiddleware.originFilter(
        null, (callbackValue) => {
        expect(callbackValue).to.eql(false);
        done();
      });
    });

    it('works as expected when origin is not found', (done) => {
      corsMiddleware.originFilter(
        '___unexpected_origin', (callbackValue) => {
        expect(callbackValue).eql(false);
        done();
      });
    });
  });
});
