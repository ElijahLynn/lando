'use strict';

// Modules
const _ = require('lodash');
const path = require('path');

/*
 * The lowest level lando service
 */
module.exports = {
  name: '_platformsh_service',
  parent: '_lando',
  builder: parent => class LandoPlatformService extends parent {
    constructor(id, options = {}, ...sources) {
      // Get some stuff from our parsed platform config
      const runConfigPath = _.get(options, 'runConfig.file');
      const bootScript = path.join(options.userConfRoot, 'scripts', 'boot-psh.sh');

      // A service uses the "app" user
      options.meUser = 'app';

      // Set the docker things we need for all appservers
      const service = {
        command: 'exec init',
        environment: {
          LANDO_SERVICE_TYPE: '_platformsh_appserver',
          LANDO_WEBROOT_USER: 'app',
          LANDO_WEBROOT_GROUP: 'app',
        },
        // @TODO: would be great to not need the below but
        // its required if we want to unmount /etc/hosts /etc/resolv.conf
        privileged: true,
        volumes: [
          `${runConfigPath}:/run/config.json`,
          `${bootScript}:/scripts/001-boot-platformsh`,
          `${options.data}:/mnt/data`,
        ],
      };

      // Add in aliases if we have them
      if (!_.isEmpty(options.platformsh.aliases)) {
        service.networks = {default: {
          aliases: _(options.platformsh.aliases)
            .map(alias => `${alias}.internal`)
            .value(),
        }};
      }

      // ADD IN OTHER LANDO STUFF? info? etc?
      sources.push({services: _.set({}, options.name, service)});
      super(id, options, ...sources);
    };
  },
};
