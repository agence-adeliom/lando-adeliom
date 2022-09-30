PHP Server Example
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
# Should be Apache
lando ssh -s apache -c "curl -X HEAD -i http://localhost:80" | grep "Server: "

# Should be nginx
lando ssh -s nginx -c "curl -X HEAD -i http://localhost:80" | grep "Server: "

# Should be Caddy
lando ssh -s caddy -c "curl -X HEAD -i http://localhost:80" | grep "Server: "
```

Destroy tests
-------------

Run the following commands to trash this app like nothing ever happened.

```bash
# Should be destroyed with success
lando destroy -y
lando poweroff
```
