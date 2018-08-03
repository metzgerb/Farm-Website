var express = require('express');

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
var bodyParser = require('body-parser');
var credentials = require('./credentials.js');
var request = require('request');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 8545);
app.use(express.static('static'));

//render GET for homepage
app.get('/',function(req,res){
   var context = {};
   context.dataList = [];
   context.commodity = "Corn";
   
   //make request to quandl for commodities
   request("https://www.quandl.com/api/v3/datasets/CHRIS/CME_C1/data.json?rows=5&api_key=" + credentials.apiKey, function(err, response, body){
      //check if good response received
      if(!err && response.statusCode < 400){
         var dataset = JSON.parse(body);
         dataset = dataset.dataset_data.data;

         //loop through returned data
         for (var i = 0; i < dataset.length; i++) {
            var data = dataset[i];
            context.dataList.push({
               date: data[0],
               op: (data[1]/100).toFixed(2),
               hi: (data[2]/100).toFixed(2),
               lo: (data[3]/100).toFixed(2),
               settle: (data[6]/100).toFixed(2)
            });
         };
         res.render('home', context);
         
      } else {
         console.log(err);
         if(response){
            console.log(response.statusCode);
         }
         next(err);
      }
   });
   
});

//render GET for Sales
app.get('/sales',function(req,res){
  var context = {};
  context.dataList = "";
  res.render('sales', context);
});

//render GET for Service
app.get('/service',function(req,res){

  res.render('service');
});

//render GET for About
app.get('/about',function(req,res){

  res.render('about');
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
