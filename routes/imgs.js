var express = require('express')
var router = express.Router()
var imgs = require('../models/imgs')
var fs = require('fs')
var checkToken = require('../checkToken')
/* GET home page. */

//获取图片列表
router.get('/getImgs', function(req, res, next) {
	imgs.find({}).sort({
		'_id': -1
	}).then(function(doc) {
		if(doc) {
			res.json({
				status: "0",
				msg: "",
				reslut: doc
			})
		} else {
			res.json({
				status: "1",
				msg: "获取图片失败",
				reslut: ""
			})
		}
	})
});
//删除图片
router.post('/removeImgs', function(req, res, next) {
	let token = req.body.token;
	if(checkToken(token)){
		let id = req.body.id;
		let imgUrl = req.body.url;
		let path = "../"+imgUrl.slice(22, imgUrl.length);//用于与URL相加返回前台的(不同电脑不一样)
		let newPath = imgUrl.slice(22, imgUrl.length); //用于与URL相加返回前台的(不同电脑不一样)
		imgs.remove({
			_id: id
		}, function(err) {
			if(err) {
				res.json({
					status: "1",
					msg: "",
					reslut: err.msg
				})
			} else {
				fs.unlink(newPath, function(err) {
					if(err) return console.log(err);
					res.json({
						status: "0",
						msg: "删除成功",
						reslut: ""
					})
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