'use strict';
const mongoose      = require('mongoose');
const Rental        = mongoose.model('Rental');

function RentalService() {
    
}

/**
 * Find Rental by id
 * @param {*} id 
 * @param {*} callback 
 */
RentalService.prototype.findRentalById = function(id, callback) {
    Rental.findById(id).exec(
        function(err, rental)  {
            if(err) callback(err);
            callback(null, rental);
        }
    );
};


module.exports = RentalService;