
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var categorySchema = new Schema({
   //分类名称
    name: String
})

module.exports = mongoose.model('Category',categorySchema)