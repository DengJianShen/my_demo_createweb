var mongoose = require('mongoose');
var Category = require('../models/category').Category;
var Movie = require('../models/movie').Movie;
// 搜索页面
exports.search = function (req, res) {
    var catId = req.query.cat;
    var q = req.query.q;
    var page = parseInt(req.query.p) || 0;
    // 每页显示数
    var count = 2;
    // 截取数据个数
    var index = page * count;
    // Category
    //     .find({_id: catId})
    //     .populate({
    //         path: 'movies',
    //         select: 'title poster',
    //         options: {limit: 2, skip: index}
    //     })
    //     .exec(function(err, categories){
    //        if(err) {
    //            console.log(err);
    //        }
    //        var category = categories[0] || {};
    //
    //        res.render('results', {
    //            title: '结果列表页',
    //            keyword: category.name,
    //            category: categories[0]
    //        })
    //     });

    // 有catId就是以分类为分页
    if (catId) {
        Category
            .find({_id: catId})
            .populate({
                path: 'movies',
                select: 'title poster'
            })
            .exec(function (err, categories) {
                if (err) {
                    console.log(err);
                }
                // 分类名同所以只取一
                var category = categories[0] || {};
                // 取出分类下存在的所有电影
                var movies = category.movies || [];
                // 当前截取个数,下次截取的个数
                var results = movies.slice(index, index + count);

                res.render('results', {
                    title: '结果列表页',
                    keyword: category.name,
                    // 当前页
                    currentPage: (page + 1),
                    // 总页
                    totalPage: Math.ceil(movies.length / 2),
                    query: 'cat=' + catId,
                    movies: results
                })
            });
    }
    else {
        Movie
            .find({title: new RegExp(q + '.*', 'i')})
            .exec(function (err, movies) {
                if (err) {
                    console.log(err)
                }
                var results = movies.slice(index, index + count);

                res.render('results', {
                    title: '结果列表页',
                    keyword: q,
                    currentPage: (page + 1),
                    query: 'q=' + q,
                    totalPage: Math.ceil(movies.length / count),
                    movies: results
                })
            })
    }
};
