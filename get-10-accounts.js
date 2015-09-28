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
  database : 'addressbook'
});

connection.queryAsync('SELECT * FROM Account LIMIT 10')
.then(
    function(result) {
        result[0].forEach(function(ele, ind){
            if(ind > 8){
                console.log( ('#'+ele.id+': ').blue.bold + ele.email.yellow);
            }else{
                console.log( ('#'+ele.id+':  ').blue.bold + ele.email.yellow);
            }
        });
    }
)
.finally(
    function() {
        connection.end();
    }
);
