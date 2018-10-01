'use strict';

const mongoose = require('mongoose');
const config = require('../config');
const path = require('path');
const _ = require('lodash');

// Load the mongoose models
module.exports.loadModels = function (callback) {
    // Globbing model files
    config.files.server.models.forEach(function (modelPath) {
      require(path.resolve(modelPath));
    });
  
    if (callback) callback();
  };
  

module.exports.connect = function (callback) {
    // console.log('1a');
    mongoose.Promise = global.Promise;

    const options = _.merge(config.db.options || {}, { useNewUrlParser: true });

    //console.log(config.db.uri);
    mongoose.connect(config.db.uri, options)
    .then(function (connection) {
        // Enabling mongoose debug mode if required
        mongoose.set('debug', true);
       //console.log(connection.Mongoose);
        // Call callback FN
       
        if (callback) callback( mongoose.connection.db);

        
    })
    .catch(function (err) {
        console.log(err);
    });
};


module.exports.disconnect = function (cb) {
    mongoose.connection.db
      .close(function (err) {
        console.info('Disconnected from MongoDB.');
        return cb(err);
      });
  };