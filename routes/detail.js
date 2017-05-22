var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Movie = require('../models/movie').Movie;
var Comment = require('../models/comment').Comment;

// 检查登录&检查权限
var userCtrol = require('../controllers/user');

/* 详情页 */
router.get('/movie/:id', function (req, res, next) {
    var id = req.params.id;
    Movie.update({_id: id}, {$inc: {pv: 1}}, function (err) {
        if (err) {
            console.log(err);
        }
    });
    Movie.findById(id, function (err, movie) {
        if (err) {
            console.log(err);
        }
        Comment.find({movie: id})
        // 用from(user._id)查询在Schema通过ref关联的user数据name值
            .populate('from', 'name')
            .populate('reply.from reply.to', 'name')
            .exec(function (err, comments) {
                if (err) {
                    console.log(err);
                }
                res.render('detail', {
                    title: movie.title,
                    movie: movie,
                    comments: comments
                });
            });
    });
});

module.exports = router;