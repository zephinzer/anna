const todoController = require('../../controllers/todo');
const expressHandlerResponseMock = require('../mocks/express.handler.res');

describe('controllers/todo', () => {
  afterEach(() => {
    expressHandlerResponseMock.__.clear();
  });

  it('works as expected', () => {
    todoController(null, expressHandlerResponseMock);
    expect(expressHandlerResponseMock._.status).to.be.calledOnce;
    expect(expressHandlerResponseMock._.status).to.be.calledWith(418);
    expect(expressHandlerResponseMock._.json).to.be.calledOnce;
    expect(expressHandlerResponseMock._.json).to.be.calledWith('todo');
  });
});
