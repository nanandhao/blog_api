/**
 * Created by Administrator on 2018/6/29.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var adminArticleSchema = new Schema({
    "title":String,
    "description":String,
    "content":String,
    "nowdate":Date,
    "show":{
        type:Boolean,
        default:true
    },
    "promotion":{
        type:Boolean,
        default:false,
    },
    "imgurl":String,
    "comment":Array,
    //关联字段 - 内容分类的id
    "category":{
        //类型
        type: mongoose.Schema.Types.ObjectId,
        //引用
        ref: 'Category'
    },
})


module.exports = mongoose.model('adminArticle',adminArticleSchema)