var express = require('express');
var path = require('path');
var _ = require('underscore');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var dbUrl = 'mongodb://localhost/movie';

var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

// 页面
var index = require('./routes/index');
var list = require('./routes/list');
var admin = require('./routes/admin');
var detail = require('./routes/detail');
var user = require('./routes/user');
var category_admin = require('./routes/category_admin');
var categorylist = require('./routes/categorylist');

//控制器
var adminCtrol = require('./controllers/admin');
var userCtrol = require('./controllers/user');
var commentCtrol = require('./controllers/comment');
var categoryCtrol = require('./controllers/category');
var indexCtrol = require('./controllers/index');

// mongo初始化
require('./models/connect');
var mongoose = require('mongoose');

var app = express();

app.use(require('connect-multiparty')());

app.use(session({
  secret: 'foo',
  store: new MongoStore({
    url: dbUrl,
    collection: 'sessions'
  })
}));

app.use(function(req, res, next) {
  req.app.locals.user = req.session.user;
  next()
});

//时间戳转换
app.locals.moment = require("moment");

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

// 使用页面
app.use(index);
app.use(list);
app.use(admin);
app.use(detail);
app.use(user);
app.use(category_admin);
app.use(categorylist);

// 使用控制器
app.use('/user/signin', userCtrol.signin);
app.use('/user/signup', userCtrol.signup);
app.use('/user/logout', userCtrol.logout);
app.use('/user/comment', commentCtrol.save);
app.use('/admin/movie/new', userCtrol.signinRequire,userCtrol.adminRequire,adminCtrol.savePoster,adminCtrol.new);
app.use('/admin/list/update/:id', userCtrol.signinRequire,userCtrol.adminRequire,adminCtrol.update);
app.use('/admin/remove/:id', userCtrol.signinRequire,userCtrol.adminRequire,adminCtrol.remove);
app.use('/user/remove/:id', userCtrol.signinRequire,userCtrol.adminRequire,userCtrol.remove);
app.use('/admin/category/new', userCtrol.signinRequire,userCtrol.adminRequire,categoryCtrol.new);
app.use('/results', indexCtrol.search);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(3000);

module.exports = app;
