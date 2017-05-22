var mongoose = require('mongoose');
var Category = require('../models/category').Category;

/* 电影分类录入的数据存储 */
exports.new = function (req, res) {
    var categoryObj = req.body;
    var _category = new Category(categoryObj);
    _category.save(function (err, category) {
        if (err) {
            console.log(err);
        }
        res.redirect('/admin/category/list');
    });
};