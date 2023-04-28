var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require("express-session")

const {expressjwt} = require("express-jwt")
// const _ = require('lodash')

var app = express();
// app.use(_)
// 跨域
var cors = require('cors');
app.use(cors());
app.all('*', function (req, res) {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'GEt,POST,PUT')
    res.header('Access-Control-Allow-Headers', 'Content-Type')
    res.header('Content-Type', 'application/json;charset=utf-8')
    req.next()
})
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//JWT 设置token
const secretKey = "RONALDO"
app.use(expressjwt({secret: secretKey, algorithms: ["HS256"]}).unless({path: ["/login", "/signUp"]}))

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(session({
    secret: "ronaldo",
    resave: false,
    saveUninitialized: true
}))
app.use(express.static(path.join(__dirname, 'public')));

//路由
app.use((req, res, next) => {
    res.resErr = function (err, status = 1) {
        res.send({
            status,
            msg: err instanceof Error ? err.message : err
        })
    }
    next()
})

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var registerRouter = require("./routes/register");
const taskRouter = require("./routes/task")
const routersRouter=require("./routes/routers")
app.use('/', indexRouter);
app.use('/', usersRouter);
app.use('/', registerRouter);
app.use('/', taskRouter);
app.use('/', routersRouter);



const Joi = require('joi')
app.use(function (err, req, res, next) {
    // 4.1 Joi 参数校验失败
    if (err instanceof Joi.ValidationError) {
        return res.resErr(err)
    }
    // 4.2 未知错误
    // console.log(err)
    if (err.status === 401) {
        return res.send({
            status: 401,
            message: "登录过期"
        })
    }

    res.resErr(err)
})

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    // console.log(err)

    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
