Adeliom recipe Example
===============

This example exists primarily to test the following documentation:

* [Adeliom Recipe](https://docs.devwithlando.io/tutorials/adeliom.html)

Start up tests
--------------

Run the following commands to get up and running with this example.

```bash
# Initialize an empty Adeliom recipe
rm -rf adeliom && mkdir -p adeliom && cd adeliom
lando init \
    --source cwd \
    --recipe adeliom \
    --webroot public \
    --name lando-adeliom \
    --option via="apache" \
    --option node="18" \
    --option php="8.1"

mkdir -p public && echo -e "<?php phpinfo();" >> public/index.php
lando start
```

Verification commands
---------------------

Run the following commands to validate things are rolling as they should.

```bash
# Should use 8.1 as the default php version
lando php -v | grep "PHP 8.1"

# Should be running mysql 5.7 by default
lando mysql -V | grep 5.7

# Should not enable xdebug by default
lando php -m | grep xdebug || echo $? | grep 1

# Should use the default database connection info
cd adeliom
lando mysql -uadeliom -padeliom adeliom -e quit

# Should have console available
cd adeliom
lando composer list
```

Destroy tests
-------------

Run the following commands to trash this app like nothing ever happened.

```bash
# Should be destroyed with success
cd adeliom
lando destroy -y
lando poweroff
```