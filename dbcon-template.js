var mysql = require('mysql');
var pool = mysql.createPool({
   connectionLimit   : 10,
   host              : 'YOUR HOST HERE',
   user              : 'YOUR USERNAME HERE',
   password          : 'YOUR PORT HERE',
   database          : 'YOUR DB HERE'
});

module.exports.pool = pool;
