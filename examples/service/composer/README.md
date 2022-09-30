PHP Composer Example
===========

This example exists is primarily the same has the following documentation:

* [PHP Service](https://docs.lando.dev/config/php.html)
* [Installing Composer](https://docs.lando.dev/config/php.html#installing-composer)

And probably other stuff

Start up tests
--------------

Run the following commands to get up and running with this example.

```bash
# Should start up successfully
lando poweroff
lando start
```

Verification commands
---------------------

Run the following commands to validate things are rolling as they should.

```bash
# Composer should be installed
lando ssh -s composer -c "composer --version --no-ansi" | grep "Composer version"

# Should install compose global dependencies if specified by user and have them available in PATH
lando ssh -s dependencies -c "phpunit --version"
lando ssh -s dependencies -c "which phpunit" | grep "/var/www/.composer/vendor/bin/phpunit"

# Should PATH prefer composer dependency binaries installed in /app/vendor over global ones
lando ssh -s dependencies -c "composer require phpunit/phpunit"
lando ssh -s dependencies -c "phpunit --version"
lando ssh -s dependencies -c "which phpunit" | grep "/app/vendor/bin/phpunit"
lando ssh -s dependencies -c "composer remove phpunit/phpunit"
lando ssh -s dependencies -c "which phpunit" | grep "/var/www/.composer/vendor/bin/phpunit"
```

Destroy tests
-------------

Run the following commands to trash this app like nothing ever happened.

```bash
# Should be destroyed with success
lando destroy -y
lando poweroff
```
