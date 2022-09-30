'use strict';
import { App } from "lando";
import * as _ from "lodash";

// Tooling defaults
const nodeTooling = {
    node: { service: 'appserver' },
    npm: { service: 'appserver' },
    npx: { service: 'appserver' },
    yarn: { service: 'appserver' },
};

/*
 * Build LAMP
 */
export = {
    name: 'adeliom',
    parent: 'lamp',
    config: {
        confSrc: __dirname,
        database: 'mysql',
        php: '8.1',
        node: '18',
        via: 'apache',
        webroot: '.',
        wkhtmltopdf: false,
        forward_composer_auth: false,
        xdebug: false,
        proxy: {},
        services: {
            appserver: {
                overrides: {
                    volumes: [],
                }
            }
        },
    },
    builder: (parent, config) => class LandoAdeliom extends parent {
        constructor(id, options: any = {}) {
            options = _.merge({}, config, options)
            options.services.appserver.type = `adeliom-php:${options.php}`;
            options.services.appserver.node = options.node;
            options.services.appserver.via = options.via;
            options.services.appserver.wkhtmltopdf = options.wkhtmltopdf;
            options.services.appserver.xdebug = options.xdebug;
            options.proxyService = 'appserver';

            if (options.forward_composer_auth) {
                options.services.appserver.overrides.volumes.push(`~/.composer/auth.json:/var/www/.composer/auth.json:ro`);
            }
            if (options.node) {
                options.tooling = _.merge({}, nodeTooling, options.tooling);
            }
            super(id, options);
        }
    },
};
