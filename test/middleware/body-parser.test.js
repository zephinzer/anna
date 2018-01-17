const bodyParserMiddleware = require('../../middleware/body-parser');

describe('middleware/body-parser', () => {
  it('exports the correct keys', () => {
    expect(bodyParserMiddleware).to.be.a('object');
    expect(bodyParserMiddleware).to.have.keys([
      'json',
      'urlencoded',
    ]);
  });

  describe('.json', () => {
    it('works as expected', () => {
      expect(bodyParserMiddleware.json).to.be.a('function');
      expect(bodyParserMiddleware.json()).to.be.a('function');
    });
  });

  describe('.urlencoded', () => {
    it('works as expected', () => {
      expect(bodyParserMiddleware.urlencoded).to.be.a('function');
      expect(bodyParserMiddleware.urlencoded()).to.be.a('function');
    });
  });
});
