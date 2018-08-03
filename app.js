var express = require('express');
const formatCurrency = require('format-currency');

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
var bodyParser = require('body-parser');
var credentials = require('./credentials.js');
var request = require('request');
var mysql = require('./dbcon.js');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 8554);
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
app.get('/sales',function(req,res,next){
   var context = {};
   //check if search term found and build where clause
   if(req.query.search) {
      var search = '%'+req.query.search+'%';
      mysql.pool.query('SELECT * FROM inventory WHERE CONCAT(' + 
      'IFNULL(id,""), "", IFNULL(descript,""), "",IFNULL(price,""),' +
      'IFNULL(cond,""), "", IFNULL(stock,"")) LIKE ?', [search],
      function(err, rows, fields){
         if(err){
            next(err);
            return;
         }
         context.results = rows;
         
         //reformat price into currency
         let opts = { format: '%s%v', symbol: '$' }
         for (var i = 0; i<context.results.length; i++) {
            context.results[i].price = formatCurrency(context.results[i].price, opts);
         }
         
         res.render('sales', context);
      });
   //Select all when no search term found
   } else {
      mysql.pool.query('SELECT * FROM inventory', function(err, rows, fields){
         if(err){
            next(err);
            return;
         }
         context.results = rows;
         
         //reformat price into currency
         let opts = { format: '%s%v', symbol: '$' }
         for (var i = 0; i<context.results.length; i++) {
            context.results[i].price = formatCurrency(context.results[i].price, opts);
         }
         
         res.render('sales', context);
      });
   }
});

//render GET for Service
app.get('/service',function(req,res){
  res.render('service');
});

//render GET for About
app.get('/about',function(req,res){
  res.render('about');
});

/*app.get('/reset-table',function(req,res,next){
  var context = {};
  mysql.pool.query("DROP TABLE IF EXISTS inventory", function(err){
    var createString = "CREATE TABLE inventory(" +
    "id VARCHAR(8)," +
    "descript VARCHAR(50), " +
    "price DECIMAL(9,2) UNSIGNED, " +
    "cond VARCHAR(5), " +
    "stock TINYINT(3) UNSIGNED)";
    mysql.pool.query(createString, function(err){
      if(err){
         next(err);
         return;
      }
      context.results = "Table reset";
      res.render('db',context);
    })
  });
});

app.get('/insert',function(req,res,next){
  var context = {};
  var insertString = "INSERT INTO inventory (" +
  "`id`, `descript`, `price`, `cond`, `stock`) VALUES "+
  "('JD1023E','2013 John Deere 1023E Tractor', 10755.00,'Used',1)," +
  "('CIHMX270','2000 Case IH MX270 Tractor', 49900.00,'Used',1)," +
  "('KM126GX','Kubota M126GX Tractor', 60000.00,'Used',1)," +
  "('JDTire','John Deere Tractor Tires', 101.00,'New',5)," +
  "('CIHOil','Case IH 10W-40 Oil - 1 Gal', 17.00,'New',23)," +
  "('THB60','Tomahawk 60in. Smooth Bucket', 365.00,'New',2)," +
  "('WWRC15P','Smucker WWRC15-P - 15ft. Weed Wiper 3 Point Hitch Mount', 2579.99,'Used',1)," +
  "('HIDKit','HID Light Kit', 184.00,'New',4)," +
  "('T4DLT','Traveller 4DLT Heavy-Duty Battery', 179.99,'New',3)," +
  "('NHMC28','1999 New Holland MC28 Lawnmower', 230.00,'Used',1)";
  
  mysql.pool.query(insertString, function(err, result){
    if(err){
      next(err);
      return;
    }
    context.results = "Inserted data";
    res.render('db',context);
  });
});
*/
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
