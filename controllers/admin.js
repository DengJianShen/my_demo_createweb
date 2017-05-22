var mongoose = require('mongoose');
var Movie = require('../models/movie').Movie;
var Category = require('../models/category').Category;
var _ = require('underscore');
var fs = require('fs');
var path = require('path');

/* 电影录入的数据存储 */
exports.new = function (req, res) {
    var id = req.body._id;
    var movieObj = req.body;
    var _movie;
    if (req.poster) {
        movieObj.poster = req.poster;
    }
    // id存在就是更新
    if (id) {
        Movie.findById(id, function (err, movie) {
            if (err) {
                console.log(err)
            }
            // 获取保存前该电影的分类id
            var old_cat_id = movie.category;

            _movie = _.extend(movie, movieObj);
            _movie.save(function (err, movie) {
                if (err) {
                    console.log(err)
                }
                // 获取保存后的分类id
                var categoryId = movie.category;
                // 根据保存前的分类id在分类表中查找并删除
                Category.findById(old_cat_id, function (err, category) {
                    if (err) {
                        console.log(err);
                    }
                    category.movies.remove(movieObj._id);
                    category.save(function (err, category) {
                        if (err) {
                            console.log(err);
                        }
                    });
                });
                // 保存对应分类数据
                Category.findById(categoryId, function (err, category) {
                    if (err) {
                        console.log(err);
                    }
                    category.movies.push(movieObj._id);
                    category.save(function (err, category) {
                        res.redirect('/movie/' + movieObj._id);
                    });
                });
            })
        })
    }
    // id不存在就是创建
    else {
        _movie = new Movie(movieObj);
        var categoryId = movieObj.category;
        var categoryName = movieObj.categoryName;

        _movie.save(function (err, movie) {
            if (err) {
                console.log(err);
            }
            // 如果存在分类id就是使用本身已有分类
            if (categoryId) {
                Category.findById(categoryId, function (err, category) {
                    if (err) {
                        console.log(err);
                    }
                    category.movies.push(movie._id);
                    category.save(function (err, category) {
                        res.redirect('/movie/' + movie._id);
                    });
                });
            }
            // 如果存在自定义分类名就是创建一个新的分类
            else if (categoryName) {
                // 创建新的分类时同时指定该电影的id
                var category = new Category({
                    name: categoryName,
                    movies: [movie._id]
                });
                // 存储该分类之后将新的电影的分类id指定到当前的id
                category.save(function (err, category) {
                    movie.category = category._id;
                    movie.save(function (err, movie) {
                        res.redirect('/movie/' + movie._id)
                    })
                })
            }
        });
    }
};

/* 更新电影数据页面数据对应 */
exports.update = function (req, res) {
    var id = req.params.id;
    if (id) {
        Movie.findById(id, function (err, movie) {
            Category.find({}, function (err, categories) {
                res.render('admin', {
                    title: '后台更新页',
                    movie: movie,
                    categories: categories
                })
            })
        })
    }
};

/* 删除电影数据 */
exports.remove = function (req, res) {
    var id = req.params.id;
    if (id) {
        Movie.remove({
            _id: id
        }, function (err) {
            if (err) {
                console.log(err);
            }
            res.redirect('/admin/list/');
        });
    }
};

/* 海报上传是否完成中间件检测 */
// 因为fs是异步所以需要注意
exports.savePoster = function (req, res, next) {
    // 从name值获得上传文件
    var posterData = req.files.uploadPoster;
    // 获取文件路径
    var filePath = posterData.path;
    // 获取原始文件名
    var originalFilename = posterData.originalFilename;
    // 如果存在那就是上传完了
    if (originalFilename) {
        fs.readFile(filePath, function (err, data) {
            var timestamp = Date.now();
            var type = posterData.type.split('/')[1];
            var poster = timestamp + '.' + type;
            var newPath = path.join(__dirname, '../', 'public/upload/' + poster);
            console.log('路径是' + newPath);
            fs.writeFile(newPath, data, function (err) {
                req.poster = poster;
                next()
            })
        });
    } else {
        next()
    }
};