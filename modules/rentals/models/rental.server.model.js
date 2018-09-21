'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const rentalSchema = new Schema({
    title: { 
        type: String, 
        required: true,
        max: [128, 'too long']
    },
    city: {
        type: String,
        required: true,
        lowercase: true
    },
    street: {
        type: String,
        required: true,
        min: [4, 'too sort']
    },
    category: {
        type: String,
        required: true,
        lowercase: true
    },
    bedrooms: {
        type: Number
    },
    shared: Boolean,
    description: {
        type: String,
        required: true
    },
    dailyRate: Number,
    createdAt: {
        type: Date,
        default: Date.now
    },
    _user: {
        type: Schema.ObjectId,
        ref: 'User'
    }

});

module.exports = mongoose.model('Rental', rentalSchema);