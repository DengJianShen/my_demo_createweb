var mongoose = require('mongoose');
var Comment = require('../models/comment').Comment;

/* 提交评论 */
exports.save = function (req, res) {
    var commentObj = req.body;
    var movieId = commentObj.movie;
    // 如果存在cid就是回复
    if (commentObj.cid) {
        Comment.findById(commentObj.cid, function (err, comment) {
            var reply = {
                from: commentObj.from,
                to: commentObj.tid,
                content: commentObj.content
            };
            if (comment.reply.length>0){
                comment.reply.push(reply);
            } else {
                comment.reply = reply;
            }
            comment.save(function (err, comment) {
                if (err) {
                    console.log(err);
                }
                res.redirect('/movie/' + movieId);
            });
        })
    } else {
        var _comment = new Comment(commentObj);
        _comment.save(function (err, comment) {
            if (err) {
                console.log(err);
            }
            res.redirect('/movie/' + movieId);
        });
    }
};