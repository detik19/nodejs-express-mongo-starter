'use strict';

const mongoose  = require('mongoose');
const Schema    = mongoose.Schema;

const bookingSchema = new Schema({
    startAt: {
        type: Date,
        required: 'starting date is required'
    }, 
    endAt: {
        type: Date, 
        required: 'Starting date is required'
    },
    totalPrice: Number,
    days: Number,
    guests: Number, 
    createdAt: {
        type: Date,
       default: Date.now
    },
    _user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    _rental:
    {
        type: Schema.Types.ObjectId,
        ref: 'Rental'
    }
    

});

module.exports = mongoose.model('Booking', bookingSchema);