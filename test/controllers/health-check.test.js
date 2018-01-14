const healthCheckController = require('../../controllers/health-check');
const expressHandlerResponseMock = require('../mocks/express.handler.res');

describe('controllers/health-check', () => {
  afterEach(() => {
    expressHandlerResponseMock.__.clear();
  });

  it('works as expected', () => {
    healthCheckController(null, expressHandlerResponseMock);
    expect(expressHandlerResponseMock._.status).to.be.calledOnce;
    expect(expressHandlerResponseMock._.status).to.be.calledWith(200);
    expect(expressHandlerResponseMock._.json).to.be.calledOnce;
    expect(expressHandlerResponseMock._.json).to.be.calledWith('ok');
  });
});
