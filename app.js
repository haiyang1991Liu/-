/**
 * 建立服务的入口文件
 * Author:Haiyang Liu
 * Version:1.0
 **/

//pug(Jade) --为视图引擎启动（服务器）

//引入库
const express = require('express');
const path = require('path');

//引入mongoose 的库
const mongoose = require('mongoose');
let db = mongoose.connection;

//用于数据库回返解码
const bodyParser = require('body-parser');
mongoose.connect("mongodb://localhost/nodejs-blog");

db=mongoose.connection;
//database 连接成功
db.once('open',function(){
    console.log('Connected to Mongodb 连接成功');
})
//database 连接出错
db.on('error',function(err){
    console.log(err);
});
const app = express();
//用来解码数据库拿出来的数据（解码器）
app.use(bodyParser.urlencoded({extented:false}));

//用于后端拼接静态文件public 下的路由
app.use(express.static(path.join(__dirname,'public')));
let Articles = require('./models/articles');
app.set('views', path.join(__dirname,'views/pugs'));

//set 界面的模版引擎
app.set('view engine','pug');

//渲染默认首页路由
app.get('/',function(req,res){
    Articles.find({},function(err,articles){
        res.render('index',{
            title:'this is index',
            articles:articles
        });
    })
});

//新增加页面路由
app.get('/articles/new',function(req,res){
    res.render('newArticles',{
        title:'Add Article',
    });
});
//app页面路由
app.get('/app',function(req,res){
    res.render('app');
})
//定制404页面
app.use(function(req,res){
    res.type('text/plain');
    res.status(404);
    res.send('404 - Not Found');
});

//定制500页面
app.use(function(err,req,res,next){
    console.error(err.stack);
    res.type('text/plain');
    res.status(500);
    res.send('500-Server Eror');
});

//设置监听在5000端口
app.listen(5000,function(){
    console.log("Server started on port 5000...");
})