var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Movie = require('../models/movie').Movie;

// 检查登录&检查权限
var userCtrol = require('../controllers/user');

/* 电影列表 */
router.get('/admin/list', userCtrol.signinRequire,function (req, res, next) {
    Movie.find({}, function (err, movies) {
        if (err) {
            console.log(err)
        }
        res.render('list', {
            title: '列表页',
            movies: movies
        });
    });
});

module.exports = router;

