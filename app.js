var express = require('express');

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 8545);
app.use(express.static('static'));

//render GET for homepage
app.get('/',function(req,res){
  var context = {};
  context.dataList = "";
  res.render('home', context);
});

//render GET for Sales
app.get('/sales',function(req,res){
  var context = {};
  context.dataList = "";
  res.render('sales', context);
});

//render GET for Service
app.get('/service',function(req,res){
  var context = {};
  context.dataList = "";
  res.render('service', context);
});

//render GET for About
app.get('/about',function(req,res){
  var context = {};
  context.dataList = "";
  res.render('about', context);
});

app.use(function(req,res){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.type('plain/text');
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://flip3.engr.oregonstate.edu:' + app.get('port') + '; press Ctrl-C to terminate.');
});
