var express = require('express');
var router = express.Router();
var abouts = require('../models/abouts');
var checkToken = require('../checkToken');
/* GET home page. */
//获得关于网站内容
router.get('/getAboutContent', function(req, res, next) {
	abouts.find().then(function(doc) {
		if(doc) {
			res.json({
				status: "0",
				msg: "",
				reslut: doc
			})
		} else {
			res.json({
				status: "1",
				msg: "出错了",
				reslut: ""
			})
		}
	})
});
//修改关于网站内容
router.post('/updateAboutContent', function(req, res, next) {
	let token = req.body.token;
	if(checkToken(token)){
		let content = req.body.aboutContent;
		//查看数据是否有留言版表，无则重新创建
		abouts.findOne({id:'about001'}).then(function(doc){
			if(!doc){
				new abouts({
					id:'about001',
					aboutcontent: content
				}).save().then(function(doc) {
					if(doc) {
						res.json({
							status: "0",
							msg: "修改成功",
							reslut: ""
						})
					} else {
						res.json({
							status: "1",
							msg: "",
							reslut: err.msg
						})
					}
				})
			}else{
				abouts.update({
					id:'about001'
				}, {
					$set: {
						aboutcontent: content
					}
				}, function(err) {
					if(err) {
						res.json({
							status: "1",
							msg: "",
							reslut: err.msg
						})
					} else {
						res.json({
							status: "0",
							msg: "修改成功",
							reslut: ""
						})
					}
				})
			}
		})
	}else{
		res.json({
			status: "2",
			msg: "没有修改权限",
			reslut: ""
		})
	}
})

module.exports = router;