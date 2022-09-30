# Recipes

This stack is a common infrastructure designed to run PHP applications.

## Features of this plugin:
 * Configurable `php` version from `7.4` all the way to `8.1` with `composer`
 * Configurable `node` (optional) (`14`, `16`, `18`, or `false`)
 * Configurable `webroot`
 * Configurable web server (`apache`, `nginx`, or `caddy`)
 * Configurable database backend (`mysql`, `mariadb`, or `postgres`)
 * Installable `xdebug`
 * Usable `wkhtmltopdf`
 * You can forward your composer `auth.json` by setting `forward_composer_auth` to `true` 

# Configuration

While Lando recipes set sane defaults so they work out of the box, they are also configurable.

Here are the configuration options, set to the default values, for this recipe's Landofile. If you are unsure about where this goes or what this means we highly recommend scanning the recipes documentation to get a good handle on how the magicks work.

```yaml
recipe: adeliom
config:
  php: '8.1'
  node: '18'
  via: 'apache'
  webroot: .
  database: mysql
  wkhtmltopdf: false
  forward_composer_auth: false
  xdebug: false
  config:
    php: SEE BELOW
    database: SEE BELOW
```

## Choosing a php version

You can set `php` to any version that is available in our [php service](php.md). However, you should make sure that whatever framework or custom code you write is designed to work with your choice.

The recipe config to set the recipe to use php version `7.4` is shown below:

```yaml
recipe: adeliom
config:
  php: '7.4'
```


## Choosing a database backend

By default, this recipe will use the default version of our [mysql](https://docs.lando.dev/mysql) service as the database backend but you can also switch this to use [`mariadb`](https://docs.lando.dev/mariadb) or [postgres](https://docs.lando.dev/postgres) instead. Note that you can also specify a version *as long as it is a version available for use with lando* for either `mysql`, `mariadb` or `postgres`.

If you are unsure about how to configure the `database`, we *highly recommend* you check out the [mysql](https://docs.lando.dev/mysql), [mariadb](https://docs.lando.dev/mariadb) and [postgres](https://docs.lando.dev/postgres) services before you change the default.

#### Using MySQL (default)

```yaml
recipe: adeliom
config:
  database: mysql
```

#### Using MariaDB

```yaml
recipe: adeliom
config:
  database: mariadb
```

#### Using Postgres

```yaml
recipe: adeliom
config:
  database: postgres
```

#### Using a custom version

```yaml
recipe: adeliom
config:
  database: postgres:9.6
```

## Connecting to your database

Lando will automatically set up a database with a user and password and also set an environment variable called [`LANDO INFO`](https://docs.lando.dev/guides/lando-info.html) that contains useful information about how your application can access other Lando services.

The default database connection information for a LAMP site is shown below:

Note that the `host` is not `localhost` but `database`.

```yaml
database: adeliom
username: adeliom
password: adeliom
host: database
# for mysql
port: 3306
# for postgres
# port: 5432
```

You can get also get the above information, and more, by using the [`lando info`](https://docs.lando.dev/cli/info.html) command.

## Using custom config files

You may need to override our default config with your own.

If you do this, you must use files that exist inside your application and express them relative to your project root as shown below:


**A hypothetical project**

Note that you can put your configuration files anywhere inside your application directory. We use a `config` directory in the below example but you can call it whatever you want such as `.lando`.

```bash
./
|-- config
   |-- my-custom.cnf
   |-- php.ini
|-- index.php
|-- .lando.yml
```

**Landofile using custom lamp config**

```yaml
recipe: lamp
config:
  config:
    database: config/my-custom.cnf
    php: config/php.ini
```

# Tooling

By default, each Lando recipe will also ship with helpful dev utilities.

This means you can use things like `drush`, `composer` and `php` via Lando and avoid mucking up your actual computer trying to manage `php` versions and tooling.

```bash
lando composer          Runs composer commands
lando db-export [file]  Exports database from a service into a file
lando db-import <file>  Imports a dump file into database service
lando mysql|psql        Drops into a MySQL (or psql) shell on a database service
lando php               Runs php commands
```

**Usage examples**

```bash
# Download a dependency with drush
lando composer require phpunit/phpunit --dev

# Run composer tests
lando db-import dump.sql.gz

# Drop into a mysql shell
lando mysql

# Check the app's installed php extensions
lando php -m
```

You can also run `lando` from inside your app directory for a complete list of commands. This is always advisable as your list of commands may not be 100% the same as above. For example, if you set `database: postgres`, you will get `lando psql` instead of `lando mysql`.

## Using xdebug

This is just a passthrough option to the [xdebug setting](php.md#using-xdebug) that exists on all our [php services](php.md). The `tl;dr` is `xdebug: true` enables and configures the php xdebug extension and `xdebug: false` disables it.

```yaml
recipe: adeliom
config:
  xdebug: true|false
```

However, for more information we recommend you consult the [php service documentation](php.md).

## Importing Your Database

Once you've started up your LAMP site, you will need to pull in your database and files before you can really start to dev all the dev. Pulling your files is as easy as downloading an archive and extracting it to the correct location. Importing a database can be done using our helpful `lando db-import` command.

```bash
# Grab your database dump
curl -fsSL -o database.sql.gz "https://url.to.my.db/database.sql.gz"

# Import the database
# NOTE: db-import can handle uncompressed, gzipped or zipped files
# Due to restrictions in how Docker handles file sharing your database
# dump MUST exist somewhere inside of your app directory.
lando db-import database.sql.gz
```