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

## Support Endpoints

### GET `/metrics`
> Basic Auth protected
Exposes the Prometheus metrics.

### GET `/healthz`
> This endpoint can be [configured using an environment variable](#health_check_endpoint) for customisation purposes

Exposes a health-check for container orchestration systems to call.

Returns `HTTP 200` with a JSON response body of `"ok"` when all is good.

### GET `/readyz`
> This endpoint can be [configured using an environment variable](#readiness_check_endpoint) for customisation purposes

Exposes a readiness-check for container orchestration systems to call. We currently check for:

- database configuration error
- database client specification error
- database connection error

Returns `HTTP 200` with a JSON response body of `"ok"` when all is good.

Returns `HTTP 500` with a JSON response body of all errors when something is wrong.

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

## Notes On Contributing

### Linting
We use ESLint to maintain code conventions and quality. To run the linter:

```bash
npm run eslint;
```

See the [Travis CI script](./.travis.yml) for more info.

### Functional Testing
Two types of tests are present in our tests. The first is unit tests which are most of tests you will see. The second is systems tests which simulates execution of the server and running queries against it - this is found in the `server.test.js`.

We use `mocha`, `chai`, `sinon` and `supertest` to validate functional behaviour of the service.

To run the tests:

```bash
npm run mocha;
```

To run it in development which adds watching and allows for `.only` and `xit` keywords:

```bash
npm run mocha-watch;
```

See the [Travis CI script](./.travis.yml) for more info.

### Running Locally
During development, we try to keep the feedback loop short, so we avoid running Anna in a Docker container.

#### Database In Development
Run the database alone using:

```bash
npm run db-development
```

If you would like it to run in the background, use:

```bash
npm run db-development -- -d
```

The above command starts the database and builds the development image so that we can do a database migration and seed. If the database migration/seed files are changed, you will have to run the above command again to get the correct version of your database schema.

#### Running Application In Development
In development, we can use a live-reload tool such as `nodemon` which watches for file changes and reloads the application when any changes are detected. This allows us to write code, save it and have our server reflect the newly acquired behaviour. To activate this, use:

```bash
npm run dev
```

#### Configuring During Development
The file `./.env` contains configurations that assume a database is running on the local computer. This database can be either a local MySQL instance, or you can spin it up using `docker-compose` using `npm run db-development` as shown above.

### Building
To create a development build, run:

```bash
npm run build -- development
```

To create a production build, run:

```bash
npm run build -- production
```

Building has no real use, we only use it in the Travis pipeline to push to DockerHub.

### Contribution Flow

#### Raise Issue
[Start an issue](https://github.com/zephinzer/anna/issues) so that everyone knows what you're working on. It'll suck if someone was doing the same thing you did and only one person's code will be merged in.

#### Fork & Build
Fork this repository and make your changes in your `master` branch. After making your changes:

1. **Update the `README.md`** for the changes you have made
2. **Add yourself as a contributor** to the `package.json` file (yay)
3. **Write/rewrite the tests for components you've changed** - think of the tests as functional specifications so that if someone needs to see how something is used, they can refer to the tests.
4. **Add an appropriate version bump** - use `[major version bump]` for a major version bump and `[minor version bump]` for a minor one according to the [SEMVER](https://semver.org/) specification. Patch versions are automatically bumped if none of those tags are available.

#### Merge Request
Done making changes? Submit a Pull Request and let the Travis CI pipeline pass. On passing, your code will be reviewed using the Code Climate statistics as well as a human check to ensure leaness and maintainability.

- - -

# Cheers!

For reading till the end, here's a potato.

![potato](https://cdn.shopify.com/s/files/1/1017/2183/t/2/assets/live-preview-potato.png?4839514862613583315)