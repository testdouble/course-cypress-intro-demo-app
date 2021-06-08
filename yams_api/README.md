# Running the Back-end

You can run the [Ruby on Rails](https://rubyonrails.org/) back-end API in one of
two ways, either directly on your machine or through
[Docker](https://www.docker.com/). Regardless of your choice, the back-end will
run at `http://localhost:3001`.

## Using Docker (preferred)

Make sure you have the [latest Docker](https://www.docker.com/get-started)
installed on your machine. Then, follow these steps from your terminal.

```
$ cd yams_api
$ docker compose build
$ docker compose run --rm web bin/rails db:prepare
$ docker compose up
```

## Running Dependencies Directly

Make sure you have [Ruby 2.7.3](https://www.ruby-lang.org/en/downloads/) and
[PostgreSQL 13](https://www.postgresql.org/download/) installed. Then, follow
these steps from your terminal.

```
$ cd yams_api
$ bundle install
$ bin/rails db:prepare
$ bin/rails s
```
