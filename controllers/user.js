var mongoose = require('mongoose');
var User = require('../models/user').User;

var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 10;

/* 用户注册 */
exports.signup = function(req, res) {
    var userObj = req.body;
    console.log(userObj);
    User.find({ name: userObj.username }, function(err, user) {
        if (err) {
            console.log(err);
        }
        // 因为find出来的是数组,因此可通过长度判断
        if (user.length > 0) {
            return res.redirect('/user/signin');
        } else {
            // 密码加密保存
            bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
                if (err) {
                    console.log(err);
                }
                bcrypt.hash(userObj.userpassword, salt, function(err, crypted) {
                    if (err) {
                        console.log(err);
                    }
                    var user = new User({
                        name: userObj.username,
                        password: crypted
                    });
                    user.save(function(err, user) {
                        if (err) {
                            console.log(err);
                        }
                        res.redirect('/user/signin');
                    });
                });
            });
        }
    });
};

/* 用户登录 */
exports.signin = function(req, res) {
    var userObj = req.body;
    User.findOne({ name: userObj.username }, function(err, user) {
        if (err) {
            console.log(err);
        }
        if (user != null) {
            // 用户登录校正解密
            bcrypt.compare(userObj.userpassword, user.password, function(err, isMatch) {
                if (err) {
                    console.log(err);
                }
                if (isMatch) {
                    console.log('登录成功');
                    req.session.user = user;
                    return res.redirect('/');
                } else {
                    console.log('登录失败');
                    return res.redirect('/user/signin');
                }
            });
        }
    })
};

/* 用户登出 */
exports.logout = function(req, res) {
    delete req.session.user;
    return res.redirect('/user/signin');
};

/* 删除用户 */
exports.remove = function(req, res) {
    var id = req.params.id;
    if (id) {
        User.remove({
            _id: id
        }, function(err) {
            if (err) {
                console.log(err);
            }
            res.redirect('/user/list');
        });
    }
};

/* 登录状态检查 */
exports.signinRequire = function(req, res, next) {
    if (!req.session.user) {
        return res.redirect('/user/signin');
    }
    next();
};

/* 使用权限检查 */
exports.adminRequire = function(req, res, next) {
    if (req.session.user.role <= 10) {
        return res.redirect('/user/signin');
    }
    next();
};