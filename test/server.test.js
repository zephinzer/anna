const supertest = require('supertest');
const config = require('../config');
const server = require('../server');

describe('server', () => {
  let app = null;
  let basicAuthUsers = null;

  before(() => {
    basicAuthUsers = config.basicAuthUsers;
    config.basicAuthUsers = [
      {
        username: 'server_test_user1',
        password: 'server_test_pass1',
      },
      {
        username: 'server_test_user2',
        password: 'server_test_pass2',
      },
    ];
    app = server();
  });

  after(() => {
    config.basicAuthUsers = basicAuthUsers;
  });

  describe('GET /metrics', () => {
    it('returns 401 unauthorized if no credentials are provided', () =>
      supertest(app)
        .get('/metrics')
        .expect('Content-Type', /text\/plain/)
        .expect(401)
    );

    it('works as expected otherwise', () =>
      supertest(app)
        .get('/metrics')
        .auth(
          config.basicAuthUsers[0].username,
          config.basicAuthUsers[0].password
        )
        .expect('Content-Type', /text\/plain/)
        .expect(200)
    );

    context('METRICS_ENDPOINT set', () => {
      let metricsModifiedApp = null;
      let metricsEndpoint = null;

      before(() => {
        metricsEndpoint = config.metricsEndpoint;
        config.metricsEndpoint = '/__changed_metrics_endpoint';
        metricsModifiedApp = server();
      });

      after(() => {
        config.metricsEndpoint = metricsEndpoint;
      });

      it('works as expected', () =>
        supertest(metricsModifiedApp)
          .get('/__changed_metrics_endpoint')
          .auth(
            config.basicAuthUsers[0].username,
            config.basicAuthUsers[0].password
          )
          .expect('Content-Type', /text\/plain/)
          .expect(200)
      );

      it('shouldn\'t have registered the original endpoint', () =>
        supertest(metricsModifiedApp)
          .get('/metrics')
          .expect(404)
      );
    });
  });

  it('has GET /healthz registered', () =>
    supertest(app)
      .get('/healthz')
      .expect('Content-Type', /json/)
      .expect(200)
      .then((response) => response.body)
      .then((response) => {
        expect(response).to.eql('ok');
      })
  );

  describe('GET /readyz', () => {
    context('database has errors', () => {
      const db = require('../db');
      let dbError = null;

      before(() => {
        dbError = db.error;
        db.error = {
          random: 'error',
        };
      });

      after(() => {
        db.error = dbError;
      });

      it('returns 500 internal server error if database has errors', () =>
        supertest(app)
          .get('/readyz')
          .expect('Content-Type', /json/)
          .expect(500)
          .then((response) => response.body)
          .then((response) => {
            expect(response).to.eql(db.error);
          })
      );
    });

    context('everything is fine', () => {
      const db = require('../db');
      let dbError = null;

      before(() => {
        dbError = db.error;
        db.error = {};
      });

      after(() => {
        db.error = dbError;
      });

      it('works as expected', () =>
        supertest(app)
          .get('/readyz')
          .expect('Content-Type', /json/)
          .expect(200)
          .then((response) => response.body)
          .then((response) => {
            expect(response).to.eql('ok');
          })
      );
    });
  });


  it('has GET /session registered', () =>
    supertest(app)
      .get('/session')
      .expect('Content-Type', /json/)
      .expect(418)
      .then((response) => response.body)
      .then((response) => {
        expect(response).to.eql('todo');
      })
  );

  it('has POST /session registered', () =>
    supertest(app)
      .post('/session')
      .expect('Content-Type', /json/)
      .expect(418)
      .then((response) => response.body)
      .then((response) => {
        expect(response).to.eql('todo');
      })
  );

  it('has DELETE /session registered', () =>
    supertest(app)
      .delete('/session')
      .expect('Content-Type', /json/)
      .expect(418)
      .then((response) => response.body)
      .then((response) => {
        expect(response).to.eql('todo');
      })
  );

  it('has GET /profiles registered', () =>
    supertest(app)
      .get('/profiles')
      .expect('Content-Type', /json/)
      .expect(418)
      .then((response) => response.body)
      .then((response) => {
        expect(response).to.eql('todo');
      })
  );

  it('has GET /profile/:id registered', () =>
    supertest(app)
      .get('/profile/1234')
      .expect('Content-Type', /json/)
      .expect(418)
      .then((response) => response.body)
      .then((response) => {
        expect(response).to.eql('todo');
      })
  );

  it('has PATCH /profile/:id registered', () =>
    supertest(app)
      .patch('/profile/1234')
      .expect('Content-Type', /json/)
      .expect(418)
      .then((response) => response.body)
      .then((response) => {
        expect(response).to.eql('todo');
      })
  );

  it('has DELETE /profile/:id registered', () =>
    supertest(app)
      .delete('/profile/1234')
      .expect('Content-Type', /json/)
      .expect(418)
      .then((response) => response.body)
      .then((response) => {
        expect(response).to.eql('todo');
      })
  );

  it('has POST /profile registered', () =>
    supertest(app)
      .post('/profile')
      .expect('Content-Type', /json/)
      .expect(418)
      .then((response) => response.body)
      .then((response) => {
        expect(response).to.eql('todo');
      })
  );

  it('has GET /user/:id registered', () =>
    supertest(app)
      .get('/user/1234')
      .expect('Content-Type', /json/)
      .expect(418)
      .then((response) => response.body)
      .then((response) => {
        expect(response).to.eql('todo');
      })
  );

  it('has GET /user/:id/profiles registered', () =>
    supertest(app)
      .get('/user/1234/profiles')
      .expect('Content-Type', /json/)
      .expect(418)
      .then((response) => response.body)
      .then((response) => {
        expect(response).to.eql('todo');
      })
  );

  it('has GET /user registered', () =>
    supertest(app)
      .get('/user')
      .expect('Content-Type', /json/)
      .expect(418)
      .then((response) => response.body)
      .then((response) => {
        expect(response).to.eql('todo');
      })
  );

  it('has POST /user registered', () =>
    supertest(app)
      .post('/user')
      .expect('Content-Type', /json/)
      .expect(418)
      .then((response) => response.body)
      .then((response) => {
        expect(response).to.eql('todo');
      })
  );

  it('has PATCH /user registered', () =>
    supertest(app)
      .patch('/user')
      .expect('Content-Type', /json/)
      .expect(418)
      .then((response) => response.body)
      .then((response) => {
        expect(response).to.eql('todo');
      })
  );

  it('has DELETE /user registered', () =>
    supertest(app)
      .delete('/user')
      .expect('Content-Type', /json/)
      .expect(418)
      .then((response) => response.body)
      .then((response) => {
        expect(response).to.eql('todo');
      })
  );

  it('has a universal 404 response', () =>
    supertest(app)
      .get('/routeless-path')
      .expect('Content-Type', /json/)
      .expect(404)
  );
});
