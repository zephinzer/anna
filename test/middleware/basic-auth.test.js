const basicAuthMiddleware = require('../../middleware/basic-auth');
const config = require('../../config');

describe('middleware/basic-auth', () => {
  let basicAuthUsers = null;

  before(() => {
    basicAuthUsers = config.basicAuthUsers;
    config.basicAuthUsers = [
      {
        username: 'test_user_1',
        password: 'test_user_1',
      },
      {
        username: 'test_user_2',
        password: 'test_user_2',
      },
    ];
  });

  after(() => {
    config.basicAuthUsers = basicAuthUsers;
  });

  describe('()', () => {
    let httpAuthMock = null;

    before(() => {
      httpAuthMock = {
        connect: sinon.spy(),
        basic: sinon.spy(),
      };
    });

    it('works as expected', () => {
      basicAuthMiddleware(httpAuthMock);
      expect(httpAuthMock.connect).to.be.calledOnce;
      expect(httpAuthMock.basic).to.be.calledOnce;
      expect(httpAuthMock.basic).to.be.calledWith(
        basicAuthMiddleware.options,
        basicAuthMiddleware.checker
      );
    });
  });

  describe('.options', () => {
    it('gets the correct configuration', () => {
      expect(basicAuthMiddleware.options).to.include.keys(['realm']);
      expect(basicAuthMiddleware.options.realm).to.eql(config.realm);
    });
  });

  describe('.checker', () => {
    it('works as expected', (done) => {
      basicAuthMiddleware.checker(
        config.basicAuthUsers[0].username,
        config.basicAuthUsers[0].password,
        (evaluation) => {
          expect(evaluation).to.eql(true);
          basicAuthMiddleware.checker(
            config.basicAuthUsers[1].username,
            config.basicAuthUsers[1].password,
            (evaluation) => {
              expect(evaluation).to.eql(true);
              done();
            }
          );
        }
      );
    });
  });
});
