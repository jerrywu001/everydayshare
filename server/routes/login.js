var User = require('../lib/db').User;
var express = require('express');
var router = express.Router();

router.post('/login', function (req, res, next) {
    var data = req.body;
    var username = data.username;
    var pwd = data.password;

    if (username !== undefined && pwd !== undefined) {
        User.findOne({
            username: username,
            password: pwd
        }, (err, doc) => {
            if (doc && Object.keys(doc).length) {
                req.session.uid = doc._id;
                req.session.role = doc.role;
                req.session.name = doc.name;
                req.session.username = doc.username;
                req.session.avator = doc.avator;

                res.json({
                    success: true,
                    msg: '登录成功！'
                });
            } else {
                res.json({
                    success: false,
                    msg: '用户名或密码错误！'
                });
            }
        });
    } else {
        res.json({
            success: false,
            msg: '请输入用户名或密码！'
        });
    }
});

router.get('/login/check', function (req, res, next) {
    if (req.session.uid) {
        res.json({
            success: true,
            uid: req.session.uid,
            role: req.session.role,
            name: req.session.name,
            username: req.session.username,
            avator: req.session.avator
        });
    } else {
        res.json({
            success: false,
            msg: '用户未登录！'
        });
    }
});

router.get('/logout', function (req, res, next) {
    req.session.uid = null;
    req.session.role = null;
    req.session.name = null;
    req.session.username = null;
    req.session.avator = null;

    res.json({
        success: true,
        msg: '用户退出！'
    });
});

module.exports = router;
