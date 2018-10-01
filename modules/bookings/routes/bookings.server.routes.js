const booking = require('../controllers/bookings.server.controller');
// const path    = require('path');
// const rental  = require(path.resolve('./modules/rentals/controllers/rentals.server.controller'));
// const auth    = require(path.resolve('./modules/users/policies/user.server.policy'));
module.exports = (app) => {
    app.route('/api/bookings').post(
        booking.create);
};
