const rentals = require('../controllers/rentals.server.controller');
// const path    = require('path');
// const auth    = require(path.resolve('./modules/users/policies/user.server.policy'));
module.exports = (app) => {
  app.route('/api/rentals')
    .get(
      //\auth.isAuthorization,
      rentals.list)
    .post(rentals.create);

    app.route('/api/rentals/:id')
        .get(rentals.read);

     // Finish by binding the article middleware
    app.param('id', rentals.rentalById);
};

