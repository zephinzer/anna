const supertest = require('supertest');
const config = require('../config');

describe('server', () => {
  let server = null;
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
    server = require('../server');
  });

  after(() => {
    config.basicAuthUsers = basicAuthUsers;
  });

  describe('GET /metrics', () => {
    it('returns 401 unauthorized if no credentials are provided', () =>
      supertest(server)
        .get('/metrics')
        .expect('Content-Type', /text\/plain/)
        .expect(401)
    );

    it('works as expected otherwise', () =>
      supertest(server)
        .get('/metrics')
        .set('Authorization',
          `${config.basicAuthUsers[0].username}:${config.basicAuthUsers[0].password}` // eslint-disable-line max-len
        )
        .expect('Content-Type', /text\/plain/)
        .expect(401)
    );
  });

  it('has GET /healthz registered', () =>
    supertest(server)
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
        supertest(server)
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
        supertest(server)
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
    supertest(server)
      .get('/session')
      .expect('Content-Type', /json/)
      .expect(418)
      .then((response) => response.body)
      .then((response) => {
        expect(response).to.eql('todo');
      })
  );

  it('has POST /session registered', () =>
    supertest(server)
      .post('/session')
      .expect('Content-Type', /json/)
      .expect(418)
      .then((response) => response.body)
      .then((response) => {
        expect(response).to.eql('todo');
      })
  );

  it('has DELETE /session registered', () =>
    supertest(server)
      .delete('/session')
      .expect('Content-Type', /json/)
      .expect(418)
      .then((response) => response.body)
      .then((response) => {
        expect(response).to.eql('todo');
      })
  );

  it('has GET /profiles registered', () =>
    supertest(server)
      .get('/profiles')
      .expect('Content-Type', /json/)
      .expect(418)
      .then((response) => response.body)
      .then((response) => {
        expect(response).to.eql('todo');
      })
  );

  it('has GET /profile/:id registered', () =>
    supertest(server)
      .get('/profile/1234')
      .expect('Content-Type', /json/)
      .expect(418)
      .then((response) => response.body)
      .then((response) => {
        expect(response).to.eql('todo');
      })
  );

  it('has PATCH /profile/:id registered', () =>
    supertest(server)
      .patch('/profile/1234')
      .expect('Content-Type', /json/)
      .expect(418)
      .then((response) => response.body)
      .then((response) => {
        expect(response).to.eql('todo');
      })
  );

  it('has DELETE /profile/:id registered', () =>
    supertest(server)
      .delete('/profile/1234')
      .expect('Content-Type', /json/)
      .expect(418)
      .then((response) => response.body)
      .then((response) => {
        expect(response).to.eql('todo');
      })
  );

  it('has POST /profile registered', () =>
    supertest(server)
      .post('/profile')
      .expect('Content-Type', /json/)
      .expect(418)
      .then((response) => response.body)
      .then((response) => {
        expect(response).to.eql('todo');
      })
  );

  it('has GET /user/:id registered', () =>
    supertest(server)
      .get('/user/1234')
      .expect('Content-Type', /json/)
      .expect(418)
      .then((response) => response.body)
      .then((response) => {
        expect(response).to.eql('todo');
      })
  );

  it('has GET /user/:id/profiles registered', () =>
    supertest(server)
      .get('/user/1234/profiles')
      .expect('Content-Type', /json/)
      .expect(418)
      .then((response) => response.body)
      .then((response) => {
        expect(response).to.eql('todo');
      })
  );

  it('has GET /user registered', () =>
    supertest(server)
      .get('/user')
      .expect('Content-Type', /json/)
      .expect(418)
      .then((response) => response.body)
      .then((response) => {
        expect(response).to.eql('todo');
      })
  );

  it('has POST /user registered', () =>
    supertest(server)
      .post('/user')
      .expect('Content-Type', /json/)
      .expect(418)
      .then((response) => response.body)
      .then((response) => {
        expect(response).to.eql('todo');
      })
  );

  it('has PATCH /user registered', () =>
    supertest(server)
      .patch('/user')
      .expect('Content-Type', /json/)
      .expect(418)
      .then((response) => response.body)
      .then((response) => {
        expect(response).to.eql('todo');
      })
  );

  it('has DELETE /user registered', () =>
    supertest(server)
      .delete('/user')
      .expect('Content-Type', /json/)
      .expect(418)
      .then((response) => response.body)
      .then((response) => {
        expect(response).to.eql('todo');
      })
  );

  it('has a universal 404 response', () =>
    supertest(server)
      .get('/routeless-path')
      .expect('Content-Type', /json/)
      .expect(404)
  );
});
