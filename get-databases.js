var mysql = require('mysql');
var Promise = require('bluebird');
var colors = require('colors');
Promise.promisifyAll(mysql);
Promise.promisifyAll(require("mysql/lib/Connection").prototype);
Promise.promisifyAll(require("mysql/lib/Pool").prototype);

var connection = mysql.createConnection({
  host     : process.env.IP,
  user     : process.env.C9_USER,
  password : '',
  database : 'mysql'
});

connection.queryAsync('SHOW DATABASES')
.then(
    function(result) {
        var rows = result[0];
        console.log( ("\nThe databases in this mysql instance are: ").yellow );
        rows.forEach(function(ele, ind){
          console.log( "\t" + ele.Database.green );
        });
        return rows;
    }
).finally(
    function() {
        connection.end();
    }
);