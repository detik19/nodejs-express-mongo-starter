'use strict';
const path = require('path');
const JwtService = require(path.resolve('./modules/users/services/jwt.server.service'));

exports.invokeRolesPolicies = function () {

}
exports.isAuthorization = function (req, res, next) {
    let jwtService = new JwtService();

    const token=req.headers.authorization;
    if(!token) return res.status(403).json({
        message: 'User is not authorized'
    });
    
    jwtService.authorizeToken(token, (err, result)=>{
        if(err)  return res.status(403).json({
            message: 'User is not authorized'
        });
        const user= result;
        next();
    });


}