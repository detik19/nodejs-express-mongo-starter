'use strict';

const passport      = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User          = require('mongoose').model('User');

module.exports = function () {
    passport.use(new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password'
    },
    (username, password, done) => {
        User.findOne({username:username.toLowerCase()},(err,user)=>{
            if(err) return done(err);
            
            if (!user || !user.authenticate(password)) {
                return done(null, false, {
                  message: 'Invalid username or password (' + (new Date()).toLocaleTimeString() + ')'
                });
            }
            return done(null, user);
        });
    }
    ))
}