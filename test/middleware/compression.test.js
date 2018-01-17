const compressionMiddleware = require('../../middleware/compression');

describe('middleware/compression', () => {
  it('works as expected', () => {
    expect(compressionMiddleware).to.be.a('function');
  });

  describe('()', () => {
    expect(compressionMiddleware()).to.be.a('function');
  });
});
