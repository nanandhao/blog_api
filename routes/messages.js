var express = require('express');
var router = express.Router();
var messages = require('../models/messages');
var checkToken = require('../checkToken')
/* GET home page. */
//获得留言列表
router.get("/getMessageList", function (req, res, next) {
    messages.find({}).then(function (doc) {
        if (doc) {
            res.json({
                status: "0",
                msg: "",
                reslut: doc
            })
        } else {
            res.json({
                status: "1",
                msg: err.msg,
                reslut: ""
            })
        }
    })
})
//添加留言
router.post("/addMessage", function (req, res, next) {
    let obj = {};
    obj.commentater = req.body.commentater;
    obj.messageconten = req.body.messageContent;
    obj.email = req.body.email
    obj.nowdate = req.body.nowDate;
    new messages(obj).save().then(function (doc) {
        if (doc) {
            res.json({
                status: "0",
                msg: "留言成功",
                reslut: ""
            })
        } else {
            res.json({
                status: "1",
                msg: err.msg,
                reslut: ""
            })
        }
    })
})
// 添加文章评论回复
router.post("/messageReply", function (req, res, next) {
    let Id = req.body.MessageId;
    let obj = {};
    obj.commentater = req.body.commentater;
    obj.messagecontent = req.body.messageContent;
    obj.bename = req.body.bename;
    obj.show = true;
    obj.email = req.body.email
    obj.nowDate = req.body.nowDate;
    messages.findOne({
        _id: Id
    }, function (err, doc) {
        if (err) {
            res.json({
                status: "1",
                msg: "",
                reslut: err.msg
            })
        } else {
            doc.reply.push(obj);
            messages.update({
                _id: Id
            }, {
                $set: {
                    reply: doc.reply
                }
            }, function (err) {
                if (err) {
                    res.json({
                        status: "1",
                        msg: "回复失败",
                        reslut: ""
                    })
                } else {
                    res.json({
                        status: "0",
                        msg: "回复成功",
                        reslut: ""
                    })
                }
            })
        }
    })
})
//修改留言状态
router.post("/updataMessageShow", function (req, res, next) {
    let token = req.body.token;
	if(checkToken(token)){
        let Id = req.body.Id;
        let show = req.body.show;
        messages.update({
            _id: Id
        }, {
            $set: {
                show: show
            }
        }, function (err) {
            if (err) {
                res.json({
                    status: "1",
                    msg: "修改失败",
                    reslut: ""
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
//删除留言
router.post("/removeMessage", function (req, res, next) {
    let token = req.body.token;
	if(checkToken(token)){
        let Id = req.body.Id;
        messages.remove({_id: Id}, function (err) {
            if (err) {
                res.json({
                    status: "1",
                    msg: "删除失败",
                    reslut: ""
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
})
//修改回复留言状态
router.post("/updataMessageReplyShow", function (req, res, next) {
    let token = req.body.token;
	if(checkToken(token)){
        let Id = req.body.Id;
        let replyIndex = req.body.replyIndex;
        let show = req.body.show;
        messages.findOne({
            _id: Id
        }, function (err, doc) {
            if (err) {
                res.json({
                    status: "1",
                    msg: "修改失败",
                    reslut: ""
                })
            } else {
                doc.reply[replyIndex].show = show;
                messages.update({
                    _id: Id
                }, {
                    $set: {
                        reply: doc.reply
                    }
                }, function (err) {
                    if (err) {
                        res.json({
                            status: "1",
                            msg: "修改失败",
                            reslut: ""
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
//删除回复留言
router.post("/removeMessageReply", function (req, res, next) {
    let token = req.body.token;
	if(checkToken(token)){
        let Id = req.body.Id;
        let replyIndex = req.body.replyIndex;
        messages.findOne({_id: Id}, function (err,doc) {
            if (err) {
                res.json({
                    status: "1",
                    msg: "删除失败",
                    reslut: ""
                })
            } else {
                doc.reply.splice(replyIndex,1);
                messages.update({
                    _id: Id
                }, {
                    $set: {
                        reply: doc.reply
                    }
                }, function (err) {
                    if (err) {
                        res.json({
                            status: "1",
                            msg: "删除失败",
                            reslut: ""
                        })
                    } else {
                        res.json({
                            status: "0",
                            msg: "删除成功",
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