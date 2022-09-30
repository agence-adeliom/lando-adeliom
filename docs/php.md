# PHP

[PHP](http://php.net/) is a popular scripting language that is especially suited for web development. It is often served by either apache, nginx, or caddy.

You can easily add it to your Lando app by adding an entry to the [services](https://docs.lando.dev/config/services.html) top-level config in your [Landofile](https://docs.lando.dev/config).

```yaml
services:
  myservice:
    type: adeliom-php:8.0
    via: nginx
    webroot: www
```

## Supported versions

*   **[8.1](https://hub.docker.com/r/adeliom/php)** **(default)**
*   [8.0](https://hub.docker.com/r/adeliom/php)
*   [7.4](https://hub.docker.com/r/adeliom/php)

# Configuration

Here are the configuration options, set to the default values, for this service. If you are unsure about where this goes or what this means, we *highly recommend* scanning the [services documentation](https://docs.lando.dev/config/services.html) to get a good handle on how the magicks work.

Also note that options, in addition to the [build steps](https://docs.lando.dev/config/services.html#build-steps) and [overrides](https://docs.lando.dev/config/services.html#overrides) that are available to every service, are shown below:

```yaml
services:
  myservice:
    type: adeliom-php:7.4
    via: apache
    webroot: .
    xdebug: false
    composer: []
    # Below only valid for via: cli
    command: tail -f /dev/null
    config:
      php: SEE BELOW
```

## Choosing a server (or not)

By default, `php` services will be served by default with [apache] service but you can switch this to either `nginx`, `caddy`, or `cli`.

Unlike with `apache`, `nginx` or `caddy` the `cli` will just spin up a `php` container without a web server. The latter is useful if you just want to work on a CLI utility or lock down what version `composer` runs with.

#### With Apache (default)

```yaml
services:
  myservice:
    type: adeliom-php
    via: apache
```

#### With nginx

```yaml
services:
  myservice:
    type: adeliom-php
    via: nginx
```

#### With caddy

```yaml
services:
  myservice:
    type: adeliom-php
    via: caddy
```

#### As CLI

```yaml
services:
  myservice:
    type: adeliom-php
    via: cli
```

In CLI mode you can optionally tell the php cli service to boot up with an arbitrary command, this is good for php worker services like queues.

```yaml
services:
  myservice:
    type: adeliom-php
    via: cli
    command: php /app/src/artisan horizon
```

## Choosing a webroot

By default Lando will serve the app from the root of your repo. If you'd like to serve your application from a different directory then use `webroot`.

```yaml
services:
  myservice:
    type: adeliom-php
    via: nginx
    webroot: docroot
```

## Using NodeJS

You can enable the `node` by setting the version and doing a `lando rebuild`.

```yaml
services:
  myservice:
    type: adeliom-php:7.4
    node: "18"
```

### Supported versions

*   **[18](https://hub.docker.com/r/adeliom/php)** **(default)**
*   [16](https://hub.docker.com/r/adeliom/php)
*   [14](https://hub.docker.com/r/adeliom/php)

## Using wkhtmltopdf and wkhtmltoimage

You can enable `wkhtmltopdf` and `wkhtmltoimage` by setting `wkhtmltopdf: true` and doing a `lando rebuild`.

In `xdebug` version you can optionally specify the mode.

```yaml
services:
  myservice:
    type: adeliom-php:7.4
    wkhtmltopdf: true
```

## Using xdebug

You can enable the `xdebug` extension by setting `xdebug: true` and doing a `lando rebuild`. When the extension is enabled Lando will automatically set the needed configuration for remote debugging. This means that `xdebug` _should_ be ready to receive connections out of the box.

In `xdebug` version you can optionally specify the mode.

```yaml
services:
  myservice:
    type: adeliom-php:7.4
    xdebug: "debug,develop"
```

For this version of `xdebug` setting `xdebug: true` will set `xdebug.mode=debug`. You can read more about `xdebug.mode` [here](https://xdebug.org/docs/all_settings#mode).

### Configuring xdebug

If you'd like to override Lando's out of the box `xdebug` config the easiest way to do that is by setting the `XDEBUG_CONFIG` environment variable as a service level override.

```yaml
services:
  myservice:
    type: adeliom-php:7.4
    xdebug: "debug,develop"
    overrides:
      environment:
        XDEBUG_CONFIG: "discover_client_host=0 client_host=localhost"
```

Note that you cannot set _every_ `xdebug` configuration option via `XDEBUG_CONFIG`, see [this](https://xdebug.org/docs/all_settings). If you need to configure something outside of the scope of `XDEBUG_CONFIG` we recommend you use a custom `php.ini`.

You can also modify or unset `XDEBUG_MODE` in a similar way. For example if you wanted to manage `xdebug.mode` in your own `php.ini` you could so something like

```yaml
services:
  myservice:
    type: adeliom-php:7.4
    xdebug: true
    overrides:
      environment:
        XDEBUG_MODE:
    config:
      php: config/php.ini
```

### Setting up your IDE for XDEBUG

While Lando will handle the server side configuration for you, there is often a considerable amount of pain lurking in the client side configuration. To that end, some helpful info about a few popular clients is shown below:

The first part of a pathmap will be the location of your code in the container. Generally, this should be `/app`. Also note that if your app is in a nested docroot, you will need to append that to the paths. The example above uses an app with a nested webroot called `www`.

**VSCODE**

[Setup XDebug in Visual Studio Code Guide](https://docs.lando.dev/guides/lando-with-vscode.html)

### Troubleshooting Xdebug

::: tip Problems starting XDEBUG
If you are visiting your site and xdebug is not triggering, it might be worth appending `?XDEBUG_SESSION_START=LANDO` to your request and seeing if that does the trick.
:::

If you have set `xdebug: true` in your recipe or service config and run `lando rebuild` but are still having issues getting `xdebug` to work correctly, we recommend that you remove `xdebug: true`, run `lando rebuild` and then set the relevant `xdebug` config directly using a custom a `php.ini` (see examples above on how to set a custom config file). Your config file should minimally include something as shown below:

```yaml
xdebug.max_nesting_level = 256
xdebug.show_exception_trace = 0
xdebug.collect_params = 0
xdebug.remote_enable = 1
xdebug.remote_host = YOUR HOST IP ADDRESS
```

You can use `lando info --deep | grep IPAddress` to help discover the correct host ip address but please note that this can change and will likely differ from dev to dev.

## Installing global composer dependencies

You can also use the `composer` key if you need to require any [global composer dependenices](https://getcomposer.org/doc/03-cli.md#require). This follows the same syntax as your normal [`composer.json`](https://getcomposer.org/doc/01-basic-usage.md#composer-json-project-setup) except written as YAML instead of JSON.

::: tip Use composer.json if you can
While there are some legitimate use cases to globally install a composer dependency, it is almost always preferred to install using your applications normal `composer.json` and then running either `lando composer install` or alternatively setting up a [build step](https://docs.lando.dev/config/services.html#build-steps) that will automatically run before your app starts up.

Note that `lando composer` is not provided out of the box by the `php` service and needs to be manually added by configuring your app's [tooling](https://docs.lando.dev/config/tooling.html).
:::

An example of globally installing `phpunit/phpunit` `^6.5` is shown below:

```yaml
services:
  myservice:
    type: adeliom-php
    composer:
      phpunit/phpunit: ^6.5
```

An example of using a [build step](https://docs.lando.dev/config/services.html#build-steps) to automatically `composer install` your dependencies before your app starts is shown below:

```yaml
services:
  myservice:
    type: adeliom-php
    build:
      - composer install
```

## Using custom config files

You may need to override our [default php.ini config](https://github.com/agence-adeliom/docker-images/blob/main/php/config/php.ini) with your own.

If you do this, you must use files that exist inside your application and express them relative to your project root as shown below:

**A hypothetical project**

Note that you can put your configuration files anywhere inside your application directory. We use a `config` directory but you can call it whatever you want such as `.lando` in the example below:

```bash
./
|-- config
   |-- php.ini
|-- index.php
|-- .lando.yml
```

**Landofile using custom php config**

```yaml
services:
  myservice:
    type: adeliom-php
    config:
      php: config/php.ini
```

## Adding tooling commands

By default a service will not do any tooling routing for you but you can add helpful `lando` commands.

```yaml
tooling:
  php:
    service: myservice
  composer:
    service: myservice
```

You can then invoke them on the command line.

```bash
lando php
lando composer
```

Lando tooling is actually pretty powerful so definitely check out [the rest](https://docs.lando.dev/config/tooling.html) of its cool features.

## Adding routing

By default a service will not do any proxy routing for you but you can add your own.

```yaml
proxy:
  myservice:
    - myapp.lndo.site
    - something.else.local
```

Lando proxying is actually pretty powerful so definitely check out [the rest](https://docs.lando.dev/config/proxy.html) of its cool features.