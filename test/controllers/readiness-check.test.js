const readinessCheckController = require('../../controllers/readiness-check');
const expressHandlerResponseMock = require('../mocks/express.handler.res');

describe('controllers/readiness-check', () => {
  afterEach(() => {
    expressHandlerResponseMock.__.clear();
  });

  context('ready', () => {
    it('works as expected', () => {
      readinessCheckController(null, expressHandlerResponseMock);
      expect(expressHandlerResponseMock._.status).to.be.calledOnce;
      expect(expressHandlerResponseMock._.status).to.be.calledWith(200);
      expect(expressHandlerResponseMock._.json).to.be.calledOnce;
      expect(expressHandlerResponseMock._.json).to.be.calledWith('ok');
    });
  });

  context('database error', () => {
    const db = require('../../db');
    let dbError = null;

    before(() => {
      dbError = db.error;
      db.error = {
        testMockError: true,
      };
    });

    after(() => {
      db.error = dbError;
    });

    it('flags database errors', () => {
      readinessCheckController(null, expressHandlerResponseMock);
      expect(expressHandlerResponseMock._.status).to.be.calledOnce;
      expect(expressHandlerResponseMock._.status).to.be.calledWith(500);
      expect(expressHandlerResponseMock._.json).to.be.calledOnce;
      expect(expressHandlerResponseMock._.json).to.be.calledWith(db.error);
    });
  });
});
