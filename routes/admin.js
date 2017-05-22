var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Category = require('../models/category').Category;

// 检查登录&检查权限
var userCtrol = require('../controllers/user');

/* 电影录入页 */
router.get('/admin/movie', userCtrol.signinRequire, userCtrol.adminRequire, function (req, res, next) {
    Category.find({}, function (err, categories) {
        res.render('admin', {
            title: '后台录入页',
            categories: categories,
            movie: {}
        });
    });
});

module.exports = router;
