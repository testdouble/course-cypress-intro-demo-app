# Demo App for End-to-end Testing with Cypress Video Course

This app is a fictitious agile project management solution called yams
(yet-another-management-solution). It is used for the follow along End-to-end
Testing with Cypress video course.

This app has separate front-end and back-end portions contained in the `yams`
and `yams_api` folders, respectively.

## Running the Back-end

You can run the [Ruby on Rails](https://rubyonrails.org/) back-end API in one of
two ways, either directly on your machine or through
[Docker](https://www.docker.com/). Regardless of your choice, the back-end will
run at `http://localhost:3001`.

### Using Docker (preferred)

Make sure you have the [latest Docker](https://www.docker.com/get-started)
installed on your machine. Then, follow these steps from your terminal.

```
$ cd yams_api
$ docker compose build
$ docker compose run --rm web bin/rails db:prepare
$ docker compose up
```

### Running Dependencies Directly

Make sure you have [Ruby 2.7.3](https://www.ruby-lang.org/en/downloads/) and
[PostgreSQL 13](https://www.postgresql.org/download/) installed. Then, follow
these steps from your terminal.

```
$ cd yams_api
$ bundle install
$ bin/rails db:prepare
$ bin/rails s
```

## Running the Front-end

You can run the React front-end with [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/).

We recommend using Node.js `16.3.0` to avoid any issues with building native
dependencies, but you will likely be fine with the latest LTS version too.

Follow these steps to install dependencies with npm and start the front-end
development server.

```
$ cd yams
$ npm install
$ npm start
```

Your default browser should open a new window at `http://localhost:3000`, and
you should see the yams app UI.

## Running Cypress Tests

TBA

## Code of Conduct

This project follows Test Double's [code of
conduct](https://testdouble.com/code-of-conduct) for all community interactions,
including (but not limited to) one-on-one communications, public posts/comments,
code reviews, pull requests, and GitHub issues. If violations occur, Test Double
will take any action they deem appropriate for the infraction, up to and
including blocking a user from the organization's repositories.