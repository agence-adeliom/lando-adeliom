'use strict';
import utils from "../../lib/utils";
import * as _ from "lodash";

const xdebugConfig = host => ([
  `client_host=${host}`,
  'discover_client_host=1',
 'log=/tmp/xdebug.log',
 'remote_enable=true',
  `remote_host=${host}`,
].join(' '));

/*
 * Helper to build a package string
 */
const pkger = (pkg, version) => (!_.isEmpty(version)) ? `${pkg}:${version}` : pkg;

/*
 * Helpers to parse config
 */
const parseApache = options => {
  return options;
};

const parseCli = options => {
  options.command = [_.get(options, 'command', 'tail -f /dev/null')];
  return options;
};

const parseNginx = options => {
  return options;
};

const parseCaddy = options => {
  return options;
};

/*
 * Helper to parse php config
 */
const parseConfig = options => {
  switch (options.via) {
    case 'apache': return parseApache(options);
    case 'cli': return parseCli(options);
    case 'nginx': return parseNginx(options);
    case 'caddy': return parseCaddy(options);
  }
};

// Builder
export = {
  name: 'adeliom-php',
  config: {
    version: '8.1',
    supported: ['8.1', '8.0', '7.4'],
    path: [
      '/usr/local/apache2/bin',
      '/app/vendor/bin',
      '/app/bin',
      '/usr/local/sbin',
      '/usr/local/bin',
      '/usr/sbin',
      '/usr/bin',
      '/sbin',
      '/bin',
      '/var/www/.composer/vendor/bin',
      '/helpers',
    ],
    confSrc: __dirname,
    command: ["-D"],
    defaultFiles: {},
    environment: {
      COMPOSER_ALLOW_SUPERUSER: 1,
      COMPOSER_MEMORY_LIMIT: '-1',
      PHP_INI_MEMORY_LIMIT: '1G',
      PHP_INI_DISPLAY_ERRORS: "On",
      PHP_INI_DISPLAY_STARTUP_ERRORS: "On",
      PHP_INI_OPCACHE_REVALIDATE_FREQ: 0,
    },
    remoteFiles: {
      php: '/usr/local/etc/php/conf.d/zzz-lando-my-custom.ini'
    },
    sources: [],
    ssl: false,
    via: 'apache',
    wkhtmltopdf: false,
    node: '18',
    volumes: ['/usr/local/bin'],
    webroot: '.',
  },
  parent: '_appserver',
  builder: (parent, config) => class LandoAdeliomPhp extends parent {
    constructor(id, options:any = {}, factory) {
      options = parseConfig(_.merge({}, config, options));      
      options.command.unshift('docker-entrypoint');
      
      // If xdebug is set to "true" then map it to "debug"
      if (options.xdebug === true) options.xdebug = 'debug';

      // Build the php
      const php = {
        image: `adeliom/php:${options.version}-${options.via}${options.wkhtmltopdf ? '-wkhtmltopdf' : ''}${options.node ? '-node' + options.node : ''}`,
        environment: _.merge({}, options.environment, {
          PATH: options.path.join(':'),
          LANDO_WEBROOT: `/app/${options.webroot}`,
          LANDO_RESET_DIR: '/var/www',
          DOCUMENT_ROOT: `/app/${options.webroot}`,
          XDEBUG_CONFIG: xdebugConfig(options._app.env.LANDO_HOST_IP),
          XDEBUG_MODE: (options.xdebug === false) ? 'off' : options.xdebug,
          PHP_INI_XDEBUG_MODE: (options.xdebug === false) ? 'off' : options.xdebug,
        }),
        networks: {default: {}},
        ports: ['80'],
        volumes: options.volumes,
        command: options.command.join(' '),
      };

      options.info = {via: options.via};

      // Add our composer things to run step
      if (!_.isEmpty(options.composer)) {
        const commands = utils.getInstallCommands(options.composer, pkger, ['composer', 'global', 'require', '-n']);
        utils.addBuildStep(commands, options._app, options.name, 'build_internal');
      }

      // Add activate steps for xdebug
      if (options.xdebug) {
        utils.addBuildStep(['install-php-extensions xdebug'], options._app, options.name, 'build_as_root_internal');
      }

      // Add in the php service and push downstream
      options.sources.push({services: _.set({}, options.name, php)});
    
      super(id, options, ..._.flatten(options.sources));
    }
  },
}