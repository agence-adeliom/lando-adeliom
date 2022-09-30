PHP + wkhtmltopdf + wkhtmltoimage Example
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
lando ssh -s wkhtmltopdf -c "wkhtmltopdf http://google.com google.pdf"
lando ssh -s wkhtmltopdf -c "wkhtmltoimage http://google.com google.jpg"
```

Destroy tests
-------------

Run the following commands to trash this app like nothing ever happened.

```bash
# Should be destroyed with success
lando destroy -y
lando poweroff
```
