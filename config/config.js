const _     = require('lodash');
const chalk = require('chalk');
const glob  = require('glob');
const fs    = require('fs');
const path  = require('path');

let getGlobbedPaths = (globPatterns, excludes) => {
  // URL paths regex
  var urlRegex = new RegExp('^(?:[a-z]+:)?\/\/', 'i');

  // The output array
  var output = [];

  // If glob pattern is array then we use each pattern in a recursive way, otherwise we use glob
  if (_.isArray(globPatterns)) {
    globPatterns.forEach(function (globPattern) {
      output = _.union(output, getGlobbedPaths(globPattern, excludes));
    });
  } else if (_.isString(globPatterns)) {
    if (urlRegex.test(globPatterns)) {
      output.push(globPatterns);
    } else {
      var files = glob.sync(globPatterns);
      if (excludes) {
        files = files.map(function (file) {
          if (_.isArray(excludes)) {
            for (var i in excludes) {
              if (excludes.hasOwnProperty(i)) {
                file = file.replace(excludes[i], '');
              }
            }
          } else {
            file = file.replace(excludes, '');
          }
          return file;
        });
      }
      output = _.union(output, files);
    }
  }

  return output;
};

let validateEnvironmentVariable = () => {

  let environmentFiles = glob.sync('./server/config/env/' + process.env.NODE_ENV + '.js');

  if (!environmentFiles.length) {
    if (process.env.NODE_ENV) {
      console.error(chalk.red('+ Error: No configuration file found for "' + process.env.NODE_ENV + '" environment using development instead'));
    } else {
      console.error(chalk.red('+ Error: NODE_ENV is not defined! Using default development environment'));
    }
    process.env.NODE_ENV = 'development';
  }
  // Reset console color
  console.log(chalk.white(''));
}

/** 
 * Validate config.domain is set
 */
//let validateDomainIsSet = (config) => {};

/**
 * Validate Secure=true parameter can actually be turned on
 * because it requires certs and key files to be available
 */
// let validateSecureMode = (config) => {};

/**
 * Validate Session Secret parameter is not set to default in production
 */
let validateSessionSecret = function (config, testing) {
  if (process.env.NODE_ENV !== 'production') {
    return true;
  }

  if (config.sessionSecret === 'MEAN') {
    if (!testing) {
      console.log(chalk.red('+ WARNING: It is strongly recommended that you change sessionSecret config while running in production!'));
      console.log(chalk.red('  Please add `sessionSecret: process.env.SESSION_SECRET || \'super amazing secret\'` to '));
      console.log(chalk.red('  `config/env/production.js` or `config/env/local.js`'));
      console.log();
    }
    return false;
  } else {
    return true;
  }
}

/**
 * Initialize global configuration files
 */
let initGlobalConfigFolders = function (config, assets) {
  // Appending files
  config.folders = {
    server: {},
    
  };

};
/**
 * Initialize global configuration files
 */
let initGlobalConfigFiles = function (config, assets) {
  // Appending files
  config.files = {
    server: {},
    // client: {}
  };

  // Setting Globbed model files
  config.files.server.models = getGlobbedPaths(assets.server.models);
  // Setting Globbed route files
  config.files.server.routes = getGlobbedPaths(assets.server.routes);

  // Setting Globbed config files
  config.files.server.configs = getGlobbedPaths(assets.server.config);

  // Setting Globbed socket files
  config.files.server.sockets = getGlobbedPaths(assets.server.sockets);

  // Setting Globbed policies files
  config.files.server.policies = getGlobbedPaths(assets.server.policies);
  // console.log(config.files);
}


/**
 * Initialize global configuration
 */
let initGlobalConfig = function () {
  //console.log('init global config run');
  validateEnvironmentVariable();
  let defaultAssets = require(path.join(process.cwd(), '/config/assets/default'));
  // Get the current assets
  let environmentAssets = require(path.join(process.cwd(), '/config/assets/', process.env.NODE_ENV)) || {};
  // Merge assets
  let assets = _.merge(defaultAssets, environmentAssets);


  // Get the default config
  let defaultConfig = require(path.join(process.cwd(), '/config/env/default'));

  // Get the current config
  let environmentConfig = require(path.join(process.cwd(), '/config/env/', process.env.NODE_ENV)) || {};

  // Merge config files
  let config = _.merge(defaultConfig, environmentConfig);

  // read package.json for MEAN.JS project information
  let pkg = require(path.resolve('./package.json'));
  config.meanjs = pkg;

  // Extend the config object with the local-NODE_ENV.js custom/local environment. This will override any settings present in the local configuration.
  config = _.merge(config, (fs.existsSync(path.join(process.cwd(), 'config/env/local-' + process.env.NODE_ENV + '.js')) && require(path.join(process.cwd(), 'config/env/local-' + process.env.NODE_ENV + '.js'))) || {});

  // Initialize global globbed files
  initGlobalConfigFiles(config, assets);

  // Initialize global globbed folders
  initGlobalConfigFolders(config, assets);
  // Validate session secret
  validateSessionSecret(config);
  // console.log(assets);
  // Expose configuration utilities
  config.utils = {
    getGlobbedPaths: getGlobbedPaths,
    validateSessionSecret: validateSessionSecret
  };
 // console.log(config);
  return config;
};

/**
 * Set configuration object
 */
module.exports = initGlobalConfig();