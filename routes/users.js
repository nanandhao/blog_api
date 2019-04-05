var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var users = require('../models/users');
var jwt = require('jsonwebtoken');
var checkToken = require('../checkToken')
/* GET users listing. */

//建立接口
//用户登录
router.post("/login", function (req, res, next) {
    let data = {
        email: req.body.userEmail,
        userpwd: req.body.userPwd
    }
    users.findOne(data, function (err, doc) {
        if (err) {
            res.json({
                status: "1",
                msg: err.messsage
            })
        } else {
            if (doc) {
                let id = typeof JSON.stringify(doc._id);
                if (doc.banned) {
                    res.json({
                        status: "2",
                        msg: "该账户已被封禁，请与管理员联系",
                        result: ""
                    })
                } else {
                    if (doc.email == req.body.userEmail && doc.userpwd == req.body.userPwd) {
                        let id = JSON.stringify(doc._id);
                        const _token = jwt.sign({
                            id:id,
                            permission:doc.permission,//用于验证是否为2次验证管理员
                        }, 'yeluoguigen', {
                            issuer: 'luo',//签发者
                            audience: 'Audience',//用户
                            expiresIn: 60 * 60 * 24,// 授权时效24小时
                        });
                        res.json({
                            status: "0",
                            msg: "登录成功",
                            result: {
                                isAdmin:doc.permission,
                                userName: doc.username,
                                token: _token,
                            }
                        })
                    } else {
                        res.json({
                            status: "1",
                            msg: "密码或者帐号错误",
                            result: ""
                        })
                    }
                }
            } else {
                res.json({
                    status: "1",
                    msg: "密码或者帐号错误",
                    result: ""
                })
            }
        }
    })
});
//注册
router.post("/register", function (req, res, next) {
    //自增用户ID
    users.count().then(function (count) {
        var id = count + 1;
        var userid = "";
        if (id < 10) {
            userid = "000" + id;
        } else if (id > 10 || id < 100) {
            userid = "00" + id;
        } else if (id > 100 || id < 1000) {
            userid = "000" + id;
        } else {
            userid = id;
        }
        let data = {
            email: req.body.userEmail,
            username: req.body.userName,
            userpwd: req.body.userPwd,
            nowdate: req.body.nowdate,
            userid: userid
        };
        users.findOne({email:data.email},function(err, doc){
            if(err){
                res.json({
                    status: "1",
                    msg: err.msg,
                    reslut: ""
                })
            }else{
                if(doc){
                    res.json({
                        status: "1",
                        msg: "该邮箱已经注册！！！",
                        reslut:""
                    })
                }else {
                    users.findOne({username:data.username},function(error,document){
                        if(error){
                            res.json({
                                status: "1",
                                msg: err.msg,
                                reslut: ""
                            })
                        }else {
                            if(document){
                                res.json({
                                    status: "1",
                                    msg: "该用户名已经存在！！！",
                                    reslut:""
                                })
                            }else {
                                new users(data).save().then(function (doc, err) {
                                    if (doc) {
                                        res.json({
                                            status: "0",
                                            msg: "注册成功",
                                            reslut: ""
                                        })
                                    } else {
                                        res.json({
                                            status: "1",
                                            msg: "",
                                            reslut:""
                                        })
                                    }
                                })
                            }
                        }
                    })
                }
            }
        })
    })
});
//检查是否登录,校验token
router.post("/checkLogin", function (req, res, next) {
    let token = req.body.token || req.query.token || req.headers['authorization'];
    if (token) {
        let decoded = jwt.decode(token, 'yeluoguigen');
        if (!decoded || decoded.exp <= new Date() / 1000) {
            res.json({
                status: "1",
                msg: 'token过期或无效',
                result: ""
            });
        } else {
            res.json({
                status: "0",
                msg: "已登录",
                result: ""
            });
        }
    } else {
        res.json({
            status: "1",
            msg: "没有检测到token",
            result: ""
        })
    }
})
//获得用户列表
router.get("/getUserList", function (req, res, next) {
    users.count().then(function (count) {
        users.find().sort().then(function (doc) {
            if (doc) {
                res.json({
                    status: "0",
                    msg: "",
                    count:count,
                    result: doc
                })
            } else {
                res.json({
                    status: "1",
                    msg: "获取列表失败",
                    result: ""
                })
            }
        })
    })
})
//修改封禁状态
router.post('/banned', function (req, res, next) {
    let token = req.body.token;
	if(checkToken(token)){
        let Id = req.body.id;
        let bannedFlag = req.body.flag;
        users.update({
            _id: Id
        }, {
            $set: {
                banned: bannedFlag
            }
        }, function (err) {
            if (err) {
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
//删除用户/
router.post('/removeUser', function (req, res, next) {
    let token = req.body.token;
	if(checkToken(token)){
        let id = req.body.id;
        users.remove({
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
})
module.exports = router;
