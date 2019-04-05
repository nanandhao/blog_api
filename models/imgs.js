/**
 * Created by Administrator on 2018/7/8.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var imgsSchema = new Schema({
    "imgurl":String,
    "imgname":String,
    "nowdate":Date
})


module.exports = mongoose.model('imgs',imgsSchema)