
'use strict';

const path          = require('path');
const mongoose      = require('mongoose');
const passport      = require('passport');
const User          = mongoose.model('User');
const errorHandler  = require(path.resolve('./modules/core/controllers/error.server.controller'));
const jwt           = require('jsonwebtoken');
const config        = require(path.resolve('./config/config'));

exports.signup =  (req, res) => {
    //delete req.body.roles;

    let user = new User(req.body);
    
    user.save((err, _user) => {
        if(err){
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        }
        else {
            res.json(_user);
        }
    });
};


exports.signin = (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err || !user) {
            return  res.status(422).send(info);
        }
        const token = jwt.sign({
            id:user.id,
            username:user.username
        }, config.jwt.key, {expiresIn:'1h'});

        req.login(user, function (err) {
            if (err) {
                res.status(400).send(err);
            } else {
                console.log('success');
                res.status(200).json({
                    'token': token,
                    'user': user
                });
            }
        });

        // const token = jwt.sign({
        //     id:user.id,
        //     username:user.username
        // }, config.jwt.key, {expiresIn:'1h'});
        // return res.status(200).json({
        //     'token': token,
        //     'user': user
        // });
    })(req,res, next);
};
