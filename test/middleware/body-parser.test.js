const bodyParserMiddleware = require('../../middleware/body-parser');

describe('middleware/body-parser', () => {
  it('exports the correct keys', () => {
    expect(bodyParserMiddleware).to.have.keys([
      'json',
      'urlencoded',
    ]);
  });
});
