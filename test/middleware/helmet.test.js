const helmetMiddleware = require('../../middleware/helmet');

describe('middleware/helmet', () => {
  it('works as expected', () => {
    expect(helmetMiddleware).to.be.a('function');
  });

  describe('()', () => {
    expect(helmetMiddleware()).to.be.a('function');
  });
});
