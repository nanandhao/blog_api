/**
 * Created by Administrator on 2018/7/8.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var usersSchema = new Schema({
    "userid":String,
    "username":String,
    "userpwd":String,
    "email":String,
    "nowdate":Date,
    "banned":{
        type:Boolean,
        default:false
    },
    "permission":{
    	type:Boolean,
        default:false
    }
})


module.exports = mongoose.model('users',usersSchema)