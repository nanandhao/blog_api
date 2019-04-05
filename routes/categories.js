var express = require('express');
var router = express.Router();
var category =  require('../models/category');
var checkToken = require('../checkToken')
/* GET home page. */

//添加分类名称
router.post('/addCategory',function(req,res,next){
	let token = req.body.token;
	if(checkToken(token)){
		let CategoryName = req.body.CategoryName;
		new category({
			name:CategoryName
		}).save().then(function(doc){
			if(doc){
				category.find({}).sort({'_id':-1}).then(function(doc){
					if(doc){
						res.json({
							status:"0",
							msg:"保存成功",
							reslut:doc
					})
					}else{
						res.json({
							status:"1",
							msg:"保存失败",
							reslut:""
						})
					}
				})
			}else{
				res.json({
					status:"1",
					msg:"保存失败",
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
//获得分类名称
router.get('/getCategory',function(req,res,next){
    	category.find({}).sort({'_id':-1}).then(function(doc){
	        if(doc){
	        	res.json({
	                status:"0",
	                msg:"",
	                reslut:doc
	           })
	        }else{
	            res.json({
	                status:"1",
	                msg:"获取分类没名称失败",
	                reslut:""
	            })
	        }
    	})
    })
//删除分类名称
router.post("/removeCategory",function(req,res,next){
	let token = req.body.token;
	if(checkToken(token)){
		let id = req.body.id;
		category.remove({_id:id},function(err){
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
});
module.exports = router;
