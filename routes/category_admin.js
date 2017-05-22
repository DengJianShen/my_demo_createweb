var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Movie = require('../models/movie').Movie;

// 检查登录&检查权限
var userCtrol = require('../controllers/user');

/* 电影录入页 */
router.get('/admin/category', userCtrol.signinRequire,userCtrol.adminRequire,function (req, res, next) {
    res.render('category_admin', {
        title: '后台分类录入页',
        category: {}
    });
});

module.exports = router;
