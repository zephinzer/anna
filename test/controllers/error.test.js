const errorController = require('../../controllers/error');
const expressResponseMock = require('../mocks/express.handler.res');
const config = require('../../config');

describe('controllers/error', () => {
  const mockError = {
    message: 'mock_error',
    code: 1,
    stack: ['a', 'b', 'c'],
  };

  beforeEach(() => {
    expressResponseMock.__.clear();
  });

  afterEach(() => {
    expressResponseMock.__.clear();
  });

  context('in development', () => {
    let env = null;

    before(() => {
      env = config.env;
      config.env = 'development';
    });

    after(() => {
      config.env = env;
    });

    it('returns all error details', () => {
      errorController(mockError, null, expressResponseMock, null);
      expect(expressResponseMock._.status).to.be.calledWith(500);
      expect(expressResponseMock._.json).to.be.calledWith(mockError);
    });
  });

  context('in production', () => {
    let env = null;

    before(() => {
      env = config.env;
      config.env = 'production';
    });

    after(() => {
      config.env = env;
    });

    it('returns only the error message', () => {
      errorController(mockError, null, expressResponseMock, null);
      expect(expressResponseMock._.status).to.be.calledWith(500);
      expect(expressResponseMock._.json).to.be.calledWith(mockError.message);
    });
  });
});
