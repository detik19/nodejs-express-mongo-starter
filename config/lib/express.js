'use strict';
const config    = require('../config');
const express   = require('express');
const bodyParser = require('body-parser');
const compress = require('compression');
const cors      = require('cors');
const path      = require('path');
/**
 * Initialize local variables
 */
module.exports.initLocalVariables = function (app) {
  // Setting application local variables
  app.locals.title = config.app.title;
  app.locals.description = config.app.description;

  if (config.secure && config.secure.ssl === true) {
        app.locals.secure = config.secure.ssl;

  }
  app.locals.env = process.env.NODE_ENV;

    // Passing the request url to environment locals
    app.use(function (req, res, next) {
        res.locals.host = req.protocol + '://' + req.hostname;
        res.locals.url = req.protocol + '://' + req.headers.host + req.originalUrl;
        next();
      });
  //console.log(app);
}


/**
 * Initialize application middleware
 */
module.exports.initMiddleware = function (app) {
    // Should be placed before express.static
    app.use(compress({
      filter: function (req, res) {
        return (/json|text|javascript|css|font|svg/).test(res.getHeader('Content-Type'));
      },
      level: 9
    }));

  // Request body parsing middleware should be above methodOverride
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(bodyParser.json());
}

/**
 * Invoke modules server configuration
 */
module.exports.initModulesConfiguration = function (app) {
    config.files.server.configs.forEach(
    (configPath) => {
        console.log(configPath);
      require(path.resolve(configPath))(app);
    });
};

module.exports.initModulesServerRoutes = function (app) {
    // Globbing routing files
    config.files.server.routes.forEach(function (routePath) {
      require(path.resolve(routePath))(app);
    });
  };
  
module.exports.init = function (db) {
    let app = express();
    
    // Initialize local variables
    this.initLocalVariables(app);

    // Initialize Express middleware
    this.initMiddleware(app);

    // Initialize Modules configuration
    this.initModulesConfiguration(app);
    
     // Initialize modules server routes
    this.initModulesServerRoutes(app);
    return app;
}