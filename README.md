# **Anna** Microservice

[![Build Status](https://travis-ci.org/zephinzer/anna.svg?branch=master)](https://travis-ci.org/zephinzer/anna) [![Maintainability](https://api.codeclimate.com/v1/badges/888a37dfeefee615573d/maintainability)](https://codeclimate.com/github/zephinzer/anna/maintainability) [![Test Coverage](https://api.codeclimate.com/v1/badges/888a37dfeefee615573d/test_coverage)](https://codeclimate.com/github/zephinzer/anna/test_coverage)

Opinionated plug-and-play accounts && authentication (ANNA) microservice for use in systems that require a user account system.

- [Overview & Goals](#overview--goals)
- [RESTful Endpoints](#restful-endpoints)
- [Data Schema](#data-schema)
- [Deployment Configuration](#deployment-configuration)
- [Contributing](#contributing)

## Overview & Goals
Anna was designed as a user management microservice meant for deployment in a microservice/service-oriented architecture. The over-arching goal is to be able to deploy Anna as a service and have other services refer to it as a central source of truth for user information.

### Functional Goals

❌ create an account  
❌ retrieve account information  
❌ upate account information  
❌ create one or more user profiles per account  
❌ update user profile  
❌ delete user profiles  
❌ delete an account and all profile related data  
❌ handle logins using token-based authentication  
❌ handle logouts using token-based authentication  
❌ report session status of a user for microservices  

### Non-Functional Goals

✅ Containerised deployment  
✅ Expose Prometheus metrics  
✅ Basic Auth protection for Prometheus metrics endpoint  
✅ Expose a health check endpoint for container orchestration systems  
✅ Expose a readiness check endpoint for container orchestration systems  
✅ Cross-Origin-Resource-Sharing (CORS) enabled  
✅ response compression  
✅ RESTful API  
❌ authentication via JSON web tokens  
❌ roles based access control  
❌ level-based logging  
❌ FluentD logs exporter  
❌ HTTP/2 communication between services  
❌ secure communication channel between services  
❌ GraphQL API  

### Assumptions

- Each account is associated with only one email address

### Entities & Relationships

#### User
A user represents an atomic account and stores contact information and credentials.

#### Profiles
A profile represents the public information related to a user. A profile belongs to a single user, but each user can have multiple profiles.

#### Session
A session represents the span of time a user spends between logging in and logging out. Each session belongs to a single user, but each user can have multiple sessions.

#### Audit
An audit represents changes to any of the afore-mentioned entities and provides a way for verifying user claims. Audits are weakly linked (non-database integrity checked) to updates in user, profile and session information.

## RESTful Endpoints

### GET `/user`
Retrieves the profile for the current user as identified in the `X-AuthToken` header.

### POST `/user`
Creates a new user.

### PATCH `/user`
Updates the user information for the user as identified in the `X-AuthToken` header.

### DELETE `/user`
Deletes the user as identified in the `X-AuthToken` header.

### GET `/user/:id`
Retrieves user information for the user with ID :id.

### GET `/user/:id/profiles`
Retrieves the profiles for the user identified with ID :id.

### GET `/profiles`
Retrieves profiles for the user identified in the `X-AuthToken` header.

### GET `/profile/:id`
Retrieves the profile with ID :id belonging to the user identified in the `X-AuthToken` header.

### POST `/profile`
Creates a new profile for the user identified in the `X-AuthToken` header.

### PATCH `/profile/:id`
Updates the profile identified with ID :id for the user identified in the `X-AuthToken` header.

### DELETE `/profile/:id`
Deletes the profile identified with ID :id for the user identified in the `X-AuthToken` header.

### GET `/session`
Verifies if the user is logged in and returns session details if so.

### POST `/session`
Logs a user in and returns an authentication token.

### DELETE `/session`
Explicitly logs a user out.

## Data Schema

### User Fields

#### `id` : *number*

#### `uuid` : *string*

#### `handle` : *string*

#### `primary_email` : *string*

#### `secondary_email` : *string*

#### `phone_number` : *string*

#### `password` : *string*

#### `last_modified` : *datetime*

#### `date_created` : *datetime*

### User-Profile Fields

#### `user_id` : *number*

#### `profile_id` : *number*

### Profile Fields

#### `id` : *number*

#### `name_full` : *string*

#### `name_first` : *string*

#### `name_middle` : *string*

#### `name_last` : *string*

#### `name_display` : *string*

#### `picture_display` : *string*

#### `bio` : *text*

#### `gender` : *enum*

Enumerates to one of:

- male
- female
- trans_male
- trans_female
- others
- none

#### `birth_date` : *date*

#### `email` : *string*

#### `contact_email` : *string*

#### `contact_number` : *string*

#### `contact_url` : *string*

#### `contact_address` : *text*

#### `others` : *text*

#### `provider_id` : *string*

#### `provider_access_token` : *string*

#### `provider_access_secret` : *string*

#### `last_modified` : *datetime*

#### `date_created` : *datetime*

### Session Fields

#### `id` : *string*

#### `user_id` : *string*

#### `user_agent` : *string*

#### `ipv4_address` : *string*

#### `ipv6_address` : *string*

#### `date_ended` : *datetime*

#### `date_created` : *datetime*

## Deployment Configuration

### `ALLOWED_ORIGINS`
When this is defined, Cross-Origin-Resource-Sharing (CORS) is activated. If the value is an empty string, all origins will be allowed, otherwise, CORS is activated for the specified domains delimited by a comma.

When left undefined, Cross-Origin-Resource-Sharing is disabled.

> Defaults to `undefined`.

### `BASIC_AUTH_USERS`
When this is defined, basic auth will be applied to the following endpoints:

- `/metrics`

The value for this environment variable should be an array of `username:password`s separated by commas. An example:

```
BASIC_AUTH_USERS=user1:password1,user2:password2
```

The above will create two users, `user1` and `user2`, with their respective passwords.

> Defaults to `undefined`.

### `DB_CLIENT`
Defines the client we should be connecting to the database with. This can be one of `mysql`, `mysql2`, `sqlite3`, `postgresql`.

> Defaults to `"mysql2"`.

### `DB_CONNECTION_POOL_MAX`
Defines the maximum number of connections we should maintain with the database.

> Defaults to `10`.

### `DB_CONNECTION_POOL_MIN`
Defines the minimum number of connections we should maintain with the database.

> Defaults to `2`.

### `DB_CONNECTION_URL`
Defines a connection URL.

> Defaults to an object defining the database host (`DB_HOST`), database port (`DB_PORT`), database schema (`DB_SCHEMA`), database user (`DB_USER`) and the password for the user (`DB_PASSWORD`).

### `DB_HOST`
Defines the database host we should be connecting to. This is ignored if `DB_CONNECTION_URL` is specified.

> Defaults to `"localhost"`.

### `DB_MIGRATIONS_TABLE_NAME`
Defines the name for the database migration table we will be using.

> Defaults to `"db_migrations_list"`.

### `DB_PASSWORD`
Defines the password for the database user defined in the `DB_USER` environment variable. This is ignored if `DB_CONNECTION_URL` is specified.

> Defaults to `"anna"`.

### `DB_PORT`
Defines the database port we should be connecting to. This is ignored if `DB_CONNECTION_URL` is specified.

> Defaults to `3306`.

### `DB_SCHEMA`
Defines the database schema we should be using. This is ignored if `DB_CONNECTION_URL` is specified.

> Defaults to `"anna"`.

### `DB_USER`
Defines the database user we should be using. This is ignored if `DB_CONNECTION_URL` is specified.

> Defaults to `"anna"`.

### `HEALTH_CHECK_ENDPOINT`
Defines the endpoint for health checks to be done on.

> Defaults to `/healthz`.

### `NODE_ENV`
Defines the environment we are running in.

Valid values are `"development"` or `"production"`. If it is neither, the server assumes `"development"`

> Defaults to `"development"`.

### `PORT`
Defines the port which the server should listen on.

> Defaults to 4000.

### `READINESS_CHECK_ENDPOINT`
Defines the endpoint for readiness checks to be done on.

> Defaults to `/readyz`.

### `REALM`
Specifies the realm for basic authentication.

> Defaults to `"ANNA"`.

## Contributing

### Building
To build Anna for release/deployment, run:

```bash
npm run build;
```

### Linting
We use ESLint to maintain code conventions and quality. To run the linter:

```bash
npm run eslint;
```

### Testing
We use Mocha framework, Chai assertion library and Sinon mocking library in tests. To run the tests:

```bash
npm run mocha;
```

To run it in development which adds file watching:

```bash
npm run mocha-watch;
```

### Running in Development
During development, we try to keep the feedback loop short, so we avoid running Anna in a Docker container.

Run the database alone using:

```bash
npm run db-development
```

If you would like it to run in the background, use:

```bash
npm run db-development -- -d
```

The above command starts the database and builds the development image so that we can do a database migration and seed. If the database migration/seed files are changed, you will have to run the above command again to get the correct version of your database schema.

You can now run Anna locally for development using Nodemon for live-reload of the application:

```bash
npm run dev
```

#### How it works
We use the `dotenv` NPM package when the environment is set to `development`. This allows us to change environemnt variables on the fly without bothering about the build process. When running in `production`, the `./.env` is ignored and the environment variables provisioned for by the container orchestrator will be used instead.

The database is accessible via `localhost:3306` because of the `docker-compose.yml` file which forwards the port `3306` from within the Docker network to your host computer. Hence you will find inside the `./.env` file that we are using `localhost`. If you have your own MySQL server running, then that works too as long as there is no database named `anna_development`.

We also use `nodemon` to allow for quick reloads of the application. On any `*.js` file change, the application will reload.

### Flow

#### Merge Request
Feel free to raise an issue (so there's visibility on what is being worked on), fork this repo, make the changes and submit merge requests tagging your issue. On passing of the Travis pipeline, I will merge your changes in.

#### Contribution Checklist
Before submitting a merge request, please confirm that the following are done:

- tests are passing on your local machine
- readme is updated describing your changes
- appropriate version bump
  - patch version for bug fixes
  - minor version for backward-compatible changes
  - major version for backward-incompatible changes

- - -

Cheers!