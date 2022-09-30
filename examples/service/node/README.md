PHP + Node Example
===========

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
# Should not be found
lando ssh -s none -c "npm"

# Should be 14
lando ssh -s node-14 -c "npm version" | grep "node:"

# Should be 16
lando ssh -s node-16 -c "npm version" | grep "node:"

# Should be 18
lando ssh -s node-18 -c "npm version" | grep "node:"
```

Destroy tests
-------------

Run the following commands to trash this app like nothing ever happened.

```bash
# Should be destroyed with success
lando destroy -y
lando poweroff
```
