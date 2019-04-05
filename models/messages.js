/**
 * Created by Administrator on 2018/7/8.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var messagesSchema = new Schema({
    "commentater":String,
    "email":String,
    "messageconten":String,
    "nowdate":Date,
    "reply":Array,
    "show":{
        type:Boolean,
        default:true
    }
})


module.exports = mongoose.model('messages',messagesSchema)