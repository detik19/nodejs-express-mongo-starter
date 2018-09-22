'use strict';
const users = require('../controllers/users.auth.server.controller')
module.exports = (app) => {
    app.route('/api/auth/signup').post(users.signup);
    app.route('/api/auth/signin').post(users.signin);

}