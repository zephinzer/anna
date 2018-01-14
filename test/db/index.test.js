const db = require('../../db');

describe('db', () => {
  it('exposes the correct keys', () => {
    expect(db).to.have.keys([
      'error',
      'initialised',
      'init',
      '_init',
      '_client',
      '_config',
    ]);
  });

  describe('()', () => {
    context('when initialised', () => {
      let dbConnection = null;

      before(() => {
        db.initialised = true;
        dbConnection = db.connection;
        db.connection = sinon.spy();
      });

      after(() => {
        db.connection = dbConnection;
      });

      it('works as expected', () =>
        db('table_name')
          .then((connection) => {
            connection();
            expect(db.connection).to.be.calledOnce;
            expect(db.connection).to.be.calledWith('table_name');
          })
      );
    });

    context('when errors exist', () => {
      let dbError = null;

      before(() => {
        db.initialised = true;
        dbError = db.error;
        db.error = {
          exists: 'a random error',
        };
      });

      after(() => {
        db.error = dbError;
      });

      it('works as expected', () =>
        db('table_name')
          .catch((error) => {
            expect(error).to.eql(db.error);
          })
      );
    });

    context('when uninitialised and no error exists', () => {
      const setIntervalSpy = sinon.spy();

      let originalSetInterval = null;
      let dbError = null;
      let dbInitialised = null;

      let intervalStore = [];

      before(() => {
        dbInitialised = db.initialised;
        db.initialised = false;
        dbError = db.error;
        db.error = {};
        originalSetInterval = global.setInterval;
        global.setInterval = (callback, interval) => {
          setIntervalSpy.apply(null, [callback, interval]);
          intervalStore.push(originalSetInterval(callback, interval));
        };
      });

      after(() => {
        db.initialised = dbInitialised;
        db.error = dbError;
        global.setInterval = originalSetInterval;
      });

      afterEach(() => {
        setIntervalSpy.resetHistory();
        intervalStore.forEach(clearInterval);
      });

      context('initialisation eventually failed', () => {
        it('works as expected', () => {
          setTimeout(() => {
            db.initialised = false;
            db.error = {
              random: 'error',
            };
          }, 300);
          return db('table_name')
            .catch((err) => {
              expect(setIntervalSpy).to.be.calledOnce;
              expect(err).to.eql(db.error);
            });
        });
      });

      context('initialisation eventually succeeded', () => {
        let dbConnection = null;
        let dbError = null;

        before(() => {
          dbConnection = db.connection;
          db.connection = sinon.spy();
          dbError = db.error;
          db.error = {};
        });

        after(() => {
          db.connection = dbConnection;
          db.error = dbError;
        });

        it('works as expected', () => {
          setTimeout(() => {
            db.initialised = true;
          }, 300);
          return db('table_name')
            .then((connection) => {
              expect(setIntervalSpy).to.be.calledOnce;
              connection();
              expect(db.connection).to.be.calledOnce;
            });
        });
      });
    });
  });

  describe('.init', () => {
    let dbAdapter;

    before(() => {
      dbAdapter = sinon.spy();
    });

    afterEach(() => {
      dbAdapter.resetHistory();
    });

    it('works as expected', () => {
      db._init(dbAdapter);
      expect(dbAdapter).to.be.calledOnce;
      expect(db.initialised).to.eql(true);
    });
  });

  describe('.init', () => {
    it('exposes the correct keys', () => {
      expect(db.init).to.have.keys([
        'config',
        'client',
        'connection',
      ]);
    });

    describe('()', () => {
      let initConfig = null;
      let initClient = null;
      let initConnection = null;

      before(() => {
        initConfig = db.init.config;
        db.init.config = sinon.spy();
        initClient = db.init.client;
        db.init.client = sinon.spy();
        initConnection = db.init.connection;
        db.init.connection = sinon.spy();
      });

      after(() => {
        db.init.config = initConfig;
        db.init.client = initClient;
        db.init.connection = initConnection;
      });

      it('works as expected', () => {
        db.init();
        expect(db.init.config).to.be.calledOnce;
        expect(db.init.client).to.be.calledOnce;
        expect(db.init.connection).to.be.calledOnce;
      });
    });

    describe('.init.config', () => {
      context('invalid configuration path', () => {
        before(() => {
          db._config = '../non-existent-knexfile';
        });

        it('works as expected', () => {
          db.init.config();
          expect(db.error.config).to.contain('MODULE_NOT_FOUND');
        });
      });

      context('valid configuration path', () => {
        before(() => {
          db._config = '../knexfile';
        });

        it('works as expected', () => {
          db.init.config();
          expect(db.error.config).to.eql(null);
        });
      });
    });

    describe('.init.client', () => {
      context('invalid client', () => {
        before(() => {
          db._client = 'nonsense-client';
        });

        it('works as expected', () => {
          db.init.client();
          expect(db.error.client).to.contain('MODULE_NOT_FOUND');
        });
      });

      context('valid client', () => {
        before(() => {
          db._client = 'mysql2';
        });

        it('works as expected', () => {
          db.init.client();
          expect(db.error.client).to.eql(null);
        });
      });
    });

    describe('.init.connection', () => {
      context('invalid pre-requisites', () => {
        context('invalid config', () => {
          before(() => {
            db.error.config = 'config error';
          });

          after(() => {
            delete db.error.config;
          });

          it('throws the correct error', () => {
            expect(() => {
              db.init.connection();
            }).to.throw('config error');
          });
        });

        context('invalid client', () => {
          before(() => {
            db.error.client = 'client error';
          });

          after(() => {
            delete db.error.client;
          });

          it('throws the correct error', () => {
            expect(() => {
              db.init.connection();
            }).to.throw('client error');
          });
        });
      });

      context('invalid client', () => {
        before(() => {
          db._client = 'nonsense-client';
        });

        after(() => {
          db._client = null;
        });

        it('sets the correct error', () => {
          db.init.connection();
          expect(db.error.connection).to.contain('UNSUPPORTED_CLIENT');
        });
      });

      context('valid connection', () => {
        let createConnectionSpy = sinon.spy();
        let querySpy = sinon.spy();
        let dbInitSpy = sinon.spy();
        let dbClientMock = {
          createConnection: (...args) => {
            createConnectionSpy.apply(null, [...args]);
            return {
              query: (queryString, callback) => {
                querySpy.apply(null, [queryString, callback]);
                callback(null, 'it worked');
              },
            };
          },
        };
        let originalClient = null;
        let originalDbInit = null;

        before(() => {
          db._client = 'mysql2';
          originalClient = db.client;
          db.client = dbClientMock;
          originalDbInit = db._init;
          db._init = dbInitSpy;
        });

        after(() => {
          db._client = null;
          db.client = originalClient;
          db._init = originalDbInit;
        });

        afterEach(() => {
          createConnectionSpy.resetHistory();
          querySpy.resetHistory();
          dbInitSpy.resetHistory();
        });

        context('connection configuration is a string', () => {
          before(() => {
            db.config.connection = 'connection_string';
          });

          it('works as expected', () => {
            db.init.connection();
            expect(createConnectionSpy).to.be.calledOnce;
            expect(createConnectionSpy).to.be.calledWith('connection_string');
            expect(querySpy).to.be.calledOnce;
            expect(querySpy.args[0][0]).to.eql('SELECT 1+1;');
            expect(dbInitSpy).to.be.calledOnce;
          });
        });

        context('connection configuration is an object', () => {
          before(() => {
            db.config.connection = {
              host: '_host',
              port: '_port',
              user: '_user',
              password: '_password',
              database: '_database',
            };
          });

          it('works as expected', () => {
            db.init.connection();
            expect(createConnectionSpy).to.be.calledOnce;
            expect(createConnectionSpy).to.be.calledWith({
              host: '_host',
              port: '_port',
              user: '_user',
              password: '_password',
              database: '_database',
            });
            expect(querySpy).to.be.calledOnce;
            expect(querySpy.args[0][0]).to.eql('SELECT 1+1;');
            expect(dbInitSpy).to.be.calledOnce;
          });
        });
      });

      context('invalid connection', () => {
        let createConnectionSpy = sinon.spy();
        let querySpy = sinon.spy();
        let dbInitSpy = sinon.spy();
        let dbClientMock = {
          createConnection: (...args) => {
            createConnectionSpy.apply(null, [...args]);
            return {
              query: (queryString, callback) => {
                querySpy.apply(null, [queryString, callback]);
                callback({
                  code: 'CONNECTION_ERROR_MOCK',
                  message: 'connection invalid',
                });
              },
            };
          },
        };
        let originalClient = null;
        let originalDbInit = null;

        before(() => {
          db._client = 'mysql2';
          db.config.connection = 'connection_string';
          originalClient = db.client;
          db.client = dbClientMock;
          originalDbInit = db._init;
          db._init = dbInitSpy;
        });

        after(() => {
          db._client = null;
          db.client = originalClient;
          db._init = originalDbInit;
        });

        afterEach(() => {
          createConnectionSpy.resetHistory();
          querySpy.resetHistory();
          dbInitSpy.resetHistory();
        });

        it('sets the correct error', () => {
          db.init.connection();
          expect(createConnectionSpy).to.be.calledOnce;
          expect(createConnectionSpy).to.be.calledWith('connection_string');
          expect(querySpy).to.be.calledOnce;
          expect(querySpy.args[0][0]).to.eql('SELECT 1+1;');
          expect(dbInitSpy).to.not.be.called;
          expect(db.error.connection).to.contain('CONNECTION_ERROR_MOCK');
        });
      });
    });
  });
});
