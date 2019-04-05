/**
 * Created by Administrator on 2018/7/8.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var linksSchema = new Schema({
    "keyword":String,
    "url":String,
    "show":{
    	type:Boolean,
        default:true
    }
})


module.exports = mongoose.model('links',linksSchema)