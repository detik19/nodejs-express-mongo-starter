const rentals = require('../controllers/rentals.server.controller');

module.exports = (app) => {
    app.route('/api/rentals')
        .get(rentals.list)
        .post(rentals.create);

    app.route('/api/rentals/:id')
        .get(rentals.read);
    
     // Finish by binding the article middleware
    app.param('id', rentals.rentalById);
}