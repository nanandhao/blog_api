/**
 * Created by Administrator on 2018/7/8.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var aboutsSchema = new Schema({
    "id":String,
    "aboutcontent":String,
})


module.exports = mongoose.model('abouts',aboutsSchema)