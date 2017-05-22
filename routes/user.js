var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var User = require('../models/user').User;

// 检查登录&检查权限
var userCtrol = require('../controllers/user');

/* 用户列表 */
router.get('/user/list', userCtrol.signinRequire, userCtrol.adminRequire,function (req, res, next) {
    User.find({}, function (err, users) {
        if (err) {
            console.log(err)
        }
        res.render('userlist', {
            title: '用户列表页',
            users: users
        });
    });
});

/* 注册页面 */
router.get('/user/signup', function (req, res, next) {
    res.render('signup', {
        title: '注册页面'
    });
});

/* 登录页面 */
router.get('/user/signin', function (req, res, next) {
    res.render('signin', {
        title: '登录页面'
    });
});

module.exports = router;

