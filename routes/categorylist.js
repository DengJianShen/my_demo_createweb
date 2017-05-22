var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Category = require('../models/category').Category;

// 检查登录&检查权限
var userCtrol = require('../controllers/user');

/* 分类列表 */
router.get('/admin/category/list', userCtrol.signinRequire,function (req, res, next) {
    Category.find({},function(err, categories) {
        if (err) {
            console.log(err)
        }

        res.render('categorylist', {
            title: '分类列表页',
            categories: categories
        })
    })
});

module.exports = router;

