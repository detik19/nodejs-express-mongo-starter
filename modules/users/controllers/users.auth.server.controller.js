
'use strict';

const path          = require('path');
const mongoose      = require('mongoose');
const User          = mongoose.model('User');
const errorHandler  = require(path.resolve('./modules/core/controllers/error.server.controller'));

exports.signup =  (req, res) => {
    delete req.body.roles;

    let user = new User(req.body);
    console.log(user);
    user.save((err, _user) => {
        if(err){
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        }
        else {
            res.json(_user);
;        }
    });
}