var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Movie = require('../models/movie').Movie;
var Category = require('../models/category').Category;

// 检查登录&检查权限
var userCtrol = require('../controllers/user');

/* 首页 */
router.get('/', userCtrol.signinRequire, function (req, res) {
    Category
        .find({})
        .populate({
            path: 'movies',
            select: 'title poster',
            options: { limit: 6 }
        })
        .exec(function (err, categories) {
            if (err) {
                console.log(err);
            }
            res.render('index', {
                title: '首页',
                categories: categories
            });
        });
});

module.exports = router;