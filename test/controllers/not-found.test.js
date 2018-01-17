const notFoundController = require('../../controllers/not-found');
const expressResponseMock = require('../mocks/express.handler.res');

describe('controller/not-found', () => {
  beforeEach(() => {
    expressResponseMock.__.clear();
  });

  afterEach(() => {
    expressResponseMock.__.clear();
  });

  it('works as expected', () => {
    notFoundController(null, expressResponseMock);
    expect(expressResponseMock._.status).to.be.calledWith(404);
    expect(expressResponseMock._.json).to.be.calledWith('???');
  });
});
