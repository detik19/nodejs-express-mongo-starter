'use strict';

const mongoose  = require('mongoose');
const Schema    = mongoose.Schema;
const bcrypt    = require('bcrypt');
const path      = require('path');
const config    = require(path.resolve('./config/config'));

let validateUsername = function (username) {
    let usernameRegex = /^(?=[\w.-]+$)(?!.*[._-]{2})(?!\.)(?!.*\.$).{3,34}$/;
    return (
      this.provider !== 'local' ||
      (username && usernameRegex.test(username) && config.illegalUsernames.indexOf(username) < 0)
    );
};

const userSchema = new Schema({
    username: {
        type: String,
        createIndex:{
            unique:'Username already exists',
        },
        required: 'Please fill in a username',
        validate: [validateUsername, 'Please enter a valid username: 3+ characters long, non restricted word,'+
          'characters "_-.", no consecutive dots, does not begin or end with dots, letters a-z and numbers 0-9.'],
        trim: true,
        min:[4, 'to short, minimum is 4 characters'],
        max:[32, 'too long, max is 32 characters']
        
    },
    email :{
        type: String,
        createIndex:{
            unique: true,
            sparse: true
        },
        // index: {
        //     unique: true,
        //     sparse: true
        // },
        lowercase: true,
        trim: true,
        required:'email is Required'
    },
    password: {
        type: String,
        required: 'password is required'
    },
    provider: {
        type: String,
        required: 'Provider is required'
    },
    salt: {
        type: String
    },
    updated: {
        type: Date
    },
    created: {
        type: Date,
        default: Date.now
    },
    rentals: [
        {
            type: Schema.ObjectId,
            ref: 'Rental'
        }
    ]
});

/**
 * Create instance method for hashing a password
 */
userSchema.methods.hashPassword = function (password) {
    return bcrypt.hashSync(password, this.salt);
};

/**
 * Create instance method for authenticating user
 */
userSchema.methods.authenticate = function (password) {
    return this.password === this.hashPassword(password);
  };
  
module.exports = mongoose.model('User', userSchema);

/**
 * Pre save method to hash password
 */
userSchema.pre('save',  function (next)  {
    this.salt=bcrypt.genSaltSync(10);
    this.password=this.hashPassword(this.password);
    next();
    
});

