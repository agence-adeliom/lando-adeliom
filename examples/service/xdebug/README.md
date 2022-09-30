PHP Xdebug Example
===========

This example exists primarily to test the following documentation:

* [PHP Service](https://docs.lando.dev/config/php.html)
* [Using XDebug](https://docs.lando.dev/config/php.html#using-xdebug)

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
# Should use develop, debug if defined
lando ssh -s xdebug -c "env" | grep 'XDEBUG_MODE' | grep 'debug,develop'

# Should enable xdebug 3
lando ssh -s xdebug-on -c "php --re xdebug | head -1" | grep "xdebug version 3."

# Should not enable xdebug by when set to false
lando ssh -s xdebug-off -c "php -m | grep xdebug" || echo $? | grep 1
```

Destroy tests
-------------

Run the following commands to trash this app like nothing ever happened.

```bash
# Should be destroyed with success
lando destroy -y
lando poweroff
```
