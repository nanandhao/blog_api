/*
*  检查token中的管理员权限进行返回
*/
var jwt = require('jsonwebtoken');

let checkToken = function(token){
    if(token){
        let decoded = jwt.decode(token, 'yeluoguigen');
        if (decoded){
            return decoded.permission
        }else{
            return false;
        }
    }else{
            return false;
    }
}

module.exports = checkToken