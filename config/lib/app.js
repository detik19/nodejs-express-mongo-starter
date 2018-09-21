'use strict';

const express           = require('./express');
const mongooseService   = require('./mongoose')
const config            = require('../config');
const seed              = require('./mongo-seed');
const chalk             = require('chalk');

function seedDB() {
    if (config.seedDB && config.seedDB.seed) {
      console.log(chalk.bold.red('Warning:  Database seeding is turned on'));
      seed.start();
    }
  }

module.exports.init = function init(callback) {

    mongooseService.connect(
        (db) => {
            mongooseService.loadModels(seedDB);

            let app = express.init(db);

            if (callback){
                callback(app, db, config);
            } 
        }
    );
}
module.exports.start = function start(callback) {
    let _this = this;
    _this.init(
        (app, db, config) => {
            app.listen(config.port, () => {
            let server = (process.env.NODE_ENV === 'secure' ? 'https://' : 'http://') + config.host + ':' + config.port;

            console.log('--');
            console.log(chalk.green(config.app.title));
            console.log();
            console.log(chalk.green('Environment:     ' + process.env.NODE_ENV));
            console.log(chalk.green('Server:          ' + server));
            console.log(chalk.green('Database:        ' + config.db.uri));
            console.log('--');

        });

        if(callback) (app, db, config);
    });


}