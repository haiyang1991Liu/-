
/**
 * 建立服务的入口文件
 * Author:Haiyang Liu
 * Version:1.0
 **/

// Handlebars --为视图引擎启动（服务器）

//全局定义一个fortune 饼干
var fortunes =[
    "conquer your fears or they will conquer you",
    "River need springs.",
    "Do not fear what you don't know.",
    "You will have pleasant suprise.",
    "whenever possibel,keep it simple"
]
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

//用于后端拼接静态文件public 下的路由 具体Express+node开发书page24
app.use(express.static(path.join(__dirname,'public')));
let Articles = require('./models/articles');

//设置handlebars 模版引擎
const handlebars = require('express3-handlebars').create({defaultLayout:'main'});
console.log("引入handlebar 引擎--检测未报错");
app.set('views', path.join(__dirname,'views/handlebars'));
console.log("set view 启动路径 为views下handlebars文件夹--检测未报错");
//set 界面的模版引擎
//这句话加上有啥用
app.engine('handlebars',handlebars.engine);
app.set('view engine','handlebars');
console.log("选取handlebars 视图引擎--检测未报错");
//渲染默认首页路由
app.get('/',function(req,res){
        res.render('index');
});
//渲染博客页面路由
app.get('/blogs',function(req,res){
        res.render('blogs');
});
//渲染游戏界面路由
app.get('/games',function(req,res){
        var randomFourtune = fortunes[Math.floor(Math.random()*fortunes.length)];
        res.render('games',{fortune:randomFourtune});
});
//渲染算法界面路由
app.get('/algorithms',function(req,res){
        res.render("algorithms");
});
//渲染接他界面路由
app.get('/guitars',function(req,res){
        res.render('guitars');
});

//定制404页面
app.use(function(req,res,next){
    //加上下面这段语言，会变成text
    //res.type('text/plain');
    res.status(404);
    res.render('404');
});

//定制500页面
app.use(function(err,req,res,next){
    console.error(err.stack);
    //res.type('text/plain');
    res.status(500);
    res.render('500');
});

//设置监听在5000端口
app.listen(5000,function(){
    console.log("Server started on port 5000...");
})