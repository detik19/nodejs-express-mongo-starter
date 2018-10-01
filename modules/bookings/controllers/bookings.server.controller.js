'use strict';
const path              = require('path');
const mongoose          = require('mongoose');
const Booking           = mongoose.model('Booking');
const errorHandler      = require(path.resolve('./modules/core/controllers/error.server.controller'));
const BookingService    = require('../services/booking.server.service');

const bookingService = new BookingService();

/**
 * Creqte booking
 *
 * @param {*} req
 * @param {*} res
 */
exports.create = function (req, res) {
    console.log(req.user)
    console.log('ananana');
    bookingService.createABooking(req.body,
        function(err, result) {
            if(err){
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            }
            console.log(result);
            res.json(result);

        }
    
    );

};


