'use strict';
const jwt = require('jsonwebtoken');
const path= require('path');
const config= require(path.resolve('./config/config'));
const mongoose = require('mongoose');
const User = mongoose.model('User');
//const errorHandler  = require(path.resolve('./modules/core/controllers/error.server.controller'));

function JwtService(){

  this.parseToken = function (token, callback) {
    
    let decoded = jwt.verify(token.split(' ')[1], config.jwt.key);

    callback(null, decoded);
  };

  this.findUser = function (decoded, callback) {
    User.findById(decoded.id, function (err, user) {
        if(err) callback(err);
 //           console.log(user);
            callback(null, user);
        });
        
    };
};


JwtService.prototype.authorizeToken = function (token, callback)  {
    
    this.parseToken(token, (err, result) => {
        if(err) callback(err);
        this.findUser(result, 
            (err, result)=>callback(err,result)
        );
    })
}




module.exports=JwtService;
