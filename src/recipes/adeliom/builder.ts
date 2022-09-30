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
        wkhtmltopdf: false,
        forward_composer_auth: false,
        webroot: '.',
        services: {
            appserver: {
                type: 'adeliom-php',
                overrides: {
                    volumes: [],
                }
            }
        },
    },
    builder: (parent, config) => class LandoAdeliom extends parent {
        constructor(id, options: any = {}) {
            options = _.merge({}, config, options)
            options.services.appserver.type = `adeliom-php`;
            options.services.appserver.version = options.php;
            options.services.appserver.node = options.node;
            options.services.appserver.via = options.via;
            options.services.appserver.wkhtmltopdf = options.wkhtmltopdf;

            if (options.forward_composer_auth) {
                options.services.appserver.overrides.volumes.push(`~/.composer/auth.json:/var/www/.composer/auth.json:ro`);
            }
            if (options.node) {
                options.tooling = _.merge({}, nodeTooling, options.tooling);
            }
            options.proxyService = 'appserver';
            super(id, options);
        }
    },
};
