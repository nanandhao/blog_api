var express = require('express');
var router = express.Router();
var links = require('../models/links');
var checkToken = require('../checkToken')
/* GET home page. */

//添加友情链接
router.post("/addLinks", function(req, res, next) {
	let token = req.body.token;
	if(checkToken(token)){
		let data = {
			keyword: req.body.keyword,
			url: req.body.links
		};
		new links(data).save().then(function(doc) {
			if(doc) {
				res.json({
					status: "0",
					msg: "保存成功",
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
		res.json({
			status: "2",
			msg: "没有修改权限",
			reslut: ""
		})
	}
})

//获取友情链接列表
router.get("/getLinksList",function(req, res, next) {
	links.find({}).sort({
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
				msg: "获取友情链接失败",
				reslut: ""
			})
		}
	})
})
//修改友情链接show属性
router.post("/setLinksShow",function(req, res, next) {
	let token = req.body.token;
	if(checkToken(token)){
		let id = req.body.id;
		let showFlag = req.body.showFlag;
		links.update({_id:id},{$set:{
			show:showFlag
		}},function(err){
			if(err){
				res.json({
					status:"1",
					msg:"",
					reslut:err.msg
				})
			}else{
				res.json({
					status:"0",
					msg:"修改成功",
					reslut:""
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
//删除友情链接
router.post("/removeLinks",function(req, res, next) {
	let token = req.body.token;
	if(checkToken(token)){
		let id = req.body.id;
		links.remove({_id:id},function(err){
			if(err){
				res.json({
					status:"1",
					msg:"",
					reslut:err.msg
				})
			}else{
				res.json({
					status:"0",
					msg:"删除成功",
					reslut:""
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