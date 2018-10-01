'use strict';
const mongoose      = require('mongoose');
const Booking       = mongoose.model('Booking');
const Rental        = mongoose.model('Rental');
const async         = require('async');
function BookingService() {

    this.findRentalById = function(id, callback) {
        Rental.findById(id)
           // .populate('_user')
            .exec(callback);

    };
    

    this.findUserRental=function(rental, callback) {
        callback(null, rental._user);
    };


    this.isYourRental = function(bookedUser, OwnerUser, callback) {
        if(bookedUser._id === OwnerUser._id){
            callback('this is your rental');
        }
        callback(null, true);
    };

}

BookingService.prototype.createABooking= function(booking, callback){
    const id = booking._rental;
    async.waterfall([
        (cb) => this.findRentalById(id, cb),
        this.findUserRental
    ],
    callback);
};

module.exports = BookingService;