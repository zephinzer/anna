const morganMiddleware = require('../../middleware/morgan');

describe('middleware/morgan', () => {
  it('works as expected', () => {
    expect(morganMiddleware).to.be.a('function');
  });

  describe('()', () => {
    it('works as expected', () => {
      expect(morganMiddleware()).to.be.a('function');
    });
  });

  describe('.options', () => {
    it('is correct', () => {
      expect(morganMiddleware.options).to.eql('common');
    });
  });
});
