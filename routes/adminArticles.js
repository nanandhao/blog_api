/**
 * Created by Administrator on 2018/6/29.
 */
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var articles = require('../models/adminArticles');
var imgs = require('../models/imgs')
var fs = require('fs');
var checkToken = require('../checkToken')
var num = 100; //为了防止出现图片命名重复



//建立接口
//初始化前台文章列表
router.post("/ArticleList", function(req, res, next) {
	var page = req.body.page || 1;
	var categoryID = req.body.categoryID || '';
	//去多少条数据
	var limit = 4;
	if(categoryID) {
		articles.count({
				show: true,
				category: categoryID
			}).then(function(count) {
			//取值不能小于1
			page = Math.max(page, 1);
			//计算数据从第几条开始
			var skip = (page - 1) * limit;
			//排除掉show:false的文章，达到过滤的效果
			articles.find({
				show: true,
				category: categoryID
			}).populate('category').sort({
				'_id': -1
			}).skip(skip).limit(limit).then(function(doc) {
				if(doc) {
					res.json({
						status: "0",
						msg: "",
						count: count,
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
		})
	} else {
		articles.count({
				show: true
			}).then(function(count) {
			//取值不能小于1
			page = Math.max(page, 1);
			//计算数据从第几条开始
			var skip = (page - 1) * limit;
			//排除掉show:false的文章，达到过滤的效果
			articles.find({
				show: true
			}).populate('category').sort({
				'_id': -1
			}).skip(skip).limit(limit).then(function(doc) {
				if(doc) {
					res.json({
						status: "0",
						msg: "",
						count: count,
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
		})
	}
})
//初始化前台排行榜文章列表
router.get("/getRankList", function(req, res, next) {
	articles.find({
		show: true
	}).populate('category').then(function(doc) {
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
})
//初始化后台文章列表 && 获得所有文章的数量 &&获得所有文章评论数量的总和
router.get("/management", function(req, res, next) {
    articles.count().then(function (count) {
        articles.find({}).sort({
            '_id': -1
        }).then(function(doc) {
            if(doc) {
                    res.json({
                        status: "0",
                        msg: "",
                        count:count,
                        reslut: doc
                    })
            } else {
                res.json({
                    status: "1",
                    msg: "",
                    reslut: ""
                })
            }
        })
    })
})
//获取文章的内容，和各种文章信息
router.post('/articleInfo', function(req, res, next) {
	let Id = req.body.id;
	articles.findOne({
		_id: Id
	}, function(err, doc) {
		if(err) {
			res.json({
				status: "1",
				msg: "",
				reslut: err.msg
			})
		} else {
			res.json({
				status: "0",
				msg: "",
				reslut: doc
			})
		}
	}).populate('category')
})
//修改文章show状态，是否在前台显示
router.post('/articleShow', function(req, res, next) {
	let token = req.body.token;
	if(checkToken(token)){
		let Id = req.body.id;
		let showflag = req.body.flag;
		articles.update({
			_id: Id
		}, {
			$set: {
				show: showflag
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
	}else{
		res.json({
			status: "2",
			msg: "没有修改权限",
			reslut: ""
		})
	}
})
//修改文章推介状态，是否在前台图文推介显示
router.post('/setPromotion', function(req, res, next) {
	let token = req.body.token;
	if(checkToken(token)){
		let Id = req.body.id;
		let promotionFlag = req.body.flag;
		articles.update({
			_id: Id
		}, {
			$set: {
				promotion: promotionFlag
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
					msg: "推介成功",
					reslut: ""
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
//编辑发布文章
router.post("/edit", function(req, res, next) {
	let token = req.body.token;
	if(checkToken(token)){
		new articles({
			title: req.body.title,
			description: req.body.description,
			category: req.body.category,
			content: req.body.content,
			nowdate: req.body.nowdate,
			imgurl: req.body.imgurl
		}).save().then(function(doc) {
			if(doc) {
				res.json({
					status: "0",
					msg: "发布成功",
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
});
//删除文章
router.post("/remove", function(req, res, next) {
	let token = req.body.token;
	if(checkToken(token)){
		let id = req.body.id;
		articles.remove({
			_id: id
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
					msg: "删除成功",
					reslut: ""
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
//修改指定的一篇文章
router.post("/modify", function(req, res, next) {
	let token = req.body.token;
	if(checkToken(token)){
		let Id = req.body.Id;
		articles.findOne({
			_id: Id
		}, function(err, doc) {
			if(err) {
				res.json({
					status: "1",
					msg: "",
					reslut: err.msg
				})
			} else {
				res.json({
					status: "0",
					msg: "",
					reslut: doc
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
//更新修改过的指定文章
router.post("/update", function(req, res, next) {
	let token = req.body.token;
	if(checkToken(token)){
		let Id = req.body.Id;
		articles.update({
			_id: Id
		}, {
			$set: {
				title: req.body.title,
				description: req.body.description,
				content: req.body.content,
				category: req.body.category,
				imgurl: req.body.imgurl
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
	}else{
		res.json({
			status: "2",
			msg: "没有修改权限",
			reslut: ""
		})
	}
})
//文章图片上传
router.post("/updataImg", function(req, res, next) {
	let url = "http://localhost:3000/";//http://47.101.206.121/
	let pathlist = [];
	let nowdate = req.body.date;
	for(var i = 0; i < req.body.images_name.length; i++) {
		let obj = {};
		let filename = req.body.images_name[i];
		let file = req.body.images[i];
		let typeArr = filename.split(".");
		let type = typeArr[typeArr.length - 1];
		let path = "../public/images/" + Date.now() + num + "." + type; //不加绝对路径(../)，fs无法写入(不同电脑不一样)
		let newPath = "public/images/" + Date.now() + num + "." + type; //用于与URL相加返回前台的(不同电脑不一样)
		let base64 = file.replace(/^data:image\/\w+;base64,/, ""); //去掉图片base64码前面部分data:image/png;base64
		let dataBuffer = new Buffer(base64, 'base64'); //把base64码转成buffer对象
		//      console.log('dataBuffer是否是Buffer对象：'+Buffer.isBuffer(dataBuffer));
		num++;
		fs.writeFile(newPath, dataBuffer, function(err) { //用fs写入文件
			if(err) {
				console.log(err);
			} else {
				new imgs({
					imgurl: url + newPath,
					imgname: filename,
					nowdate: nowdate
				}).save();
				obj = {
					imgurl: url + newPath,
					imgname: filename,
					nowdate: nowdate
				}
				pathlist.push(obj);
			}
		})
	}
	//让循环结束后再进行操作
	setTimeout(function() {
		res.json({
			status: "0",
			msg: "",
			reslut: pathlist
		})
	}, 300)
})
//添加文章评论
router.post("/addComment", function(req, res, next) {
	let articleId = req.body.articleId;
	let obj = {};
	obj.commentator = req.body.commentator;
	obj.comments = req.body.comments;
	obj.show = true;
	obj.email = req.body.email
	obj.nowDate = req.body.nowDate;
	obj.reply = req.body.reply;
	articles.findOne({
		_id: articleId
	}, function(err, doc) {
		if(err) {
			res.json({
				status: "1",
				msg: "",
				reslut: err.msg
			})
		} else {
			doc.comment.push(obj);
			articles.update({
				_id: articleId
			}, {
				$set: {
					comment: doc.comment
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
						msg: "评论成功",
						reslut: doc.comment
					})
				}
			})
		}
	})
})
//添加文章评论回复
router.post("/addReply", function(req, res, next) {
	let articleId = req.body.articleId;
	let commentIndex = req.body.commentindex;
	let obj = {};
	obj.commentator = req.body.commentator;
	obj.comments = req.body.comments;
    obj.show = true;
	obj.commentee = req.body.commentee;
	obj.email = req.body.email
	obj.nowDate = req.body.nowDate;
	obj.commentindex = req.body.commentindex;
	articles.findOne({
		_id: articleId
	}, function(err, doc) {
		if(err) {
			res.json({
				status: "1",
				msg: "",
				reslut: err.msg
			})
		} else {
			doc.comment[commentIndex].reply.push(obj);
			articles.update({
				_id: articleId
			}, {
				$set: {
					comment: doc.comment
				}
			}, function(err) {
				if(err) {
					res.json({
						status: "1",
						msg: "评论失败",
						reslut: ""
					})
				} else {
					res.json({
						status: "0",
						msg: "评论成功",
						reslut: doc.comment
					})
				}
			})
		}
	})
})
//删除评论
router.post("/removeComment",function (req, res, next) {
	let token = req.body.token;
	if(checkToken(token)){
		let Id = req.body.id;
		let commentIndex = req.body.commentIndex;
		articles.findOne({
			_id: Id
		}, function(err, doc) {
			if(err) {
				res.json({
					status: "1",
					msg: "",
					reslut: err.msg
				})
			} else {
				doc.comment.splice(commentIndex,1)
				articles.update({
					_id: doc._id
				}, {
					$set: {
						comment: doc.comment
					}
				}, function(err) {
					if(err) {
						res.json({
							status: "1",
							msg: "删除失败",
							reslut: ""
						})
					} else {
						res.json({
							status: "0",
							msg: "删除成功",
							reslut:""
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
//删除评论回复
router.post("/removeReply",function (req, res, next) {
	let token = req.body.token;
	if(checkToken(token)){
		let Id = req.body.id;
		let commentIndex = req.body.commentIndex;
		let replyIndex = req.body.replyIndex;
		articles.findOne({
			_id: Id
		}, function(err, doc) {
			if(err) {
				res.json({
					status: "1",
					msg: "",
					reslut: err.msg
				})
			} else {
				doc.comment[commentIndex].reply.splice(replyIndex,1);
				articles.update({
					_id: doc._id
				}, {
					$set: {
						comment: doc.comment
					}
				}, function(err) {
					if(err) {
						res.json({
							status: "1",
							msg: "删除失败",
							reslut: ""
						})
					} else {
						res.json({
							status: "0",
							msg: "删除成功",
							reslut:""
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
//修改评论回复状态
router.post("/updataReplyShow",function (req, res, next) {
	let token = req.body.token;
	if(checkToken(token)){
		let Id = req.body.id;
		let commentIndex = req.body.commentIndex;
		let replyIndex = req.body.replyIndex;
		let show = req.body.show;
		articles.findOne({
			_id: Id
		}, function(err, doc) {
			if(err) {
				res.json({
					status: "1",
					msg: "",
					reslut: err.msg
				})
			} else {
				doc.comment[commentIndex].reply[replyIndex].show = show;
				articles.update({
					_id: doc._id
				}, {
					$set: {
						comment: doc.comment
					}
				}, function(err) {
					if(err) {
						res.json({
							status: "1",
							msg: "修改失败",
							reslut: ""
						})
					} else {
						res.json({
							status: "0",
							msg: "修改成功",
							reslut:""
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
//修改评论状态
router.post("/updataCommentShow",function (req, res, next) {
	let token = req.body.token;
	if(checkToken(token)){
		let Id = req.body.id;
		let commentIndex = req.body.commentIndex;
		let show = req.body.show;
		articles.findOne({
			_id: Id
		}, function(err, doc) {
			if(err) {
				res.json({
					status: "1",
					msg: "",
					reslut: err.msg
				})
			} else {
				doc.comment[commentIndex].show = show;
				articles.update({
					_id: doc._id
				}, {
					$set: {
						comment: doc.comment
					}
				}, function(err) {
					if(err) {
						res.json({
							status: "1",
							msg: "修改失败",
							reslut: ""
						})
					} else {
						res.json({
							status: "0",
							msg: "修改成功",
							reslut:""
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