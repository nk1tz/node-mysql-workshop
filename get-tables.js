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
)
.map(
    function(row) {
        return connection.queryAsync('SHOW TABLES FROM ' + row.Database)
        .then(
            function(res) {
                var tables = res[0].map(function(table) {
                    return table['Tables_in_'+ row.Database];
                });
                return {nameOfDatabase: row.Database, tableNames: tables};
            }
        );
    }
)
.then(
    function(mappedTables) {
        mappedTables.forEach(function(databaseWithTables){
            console.log( ('Tables in ' + databaseWithTables.nameOfDatabase + ' are: ').yellow );
            databaseWithTables.tableNames.forEach(function(table){
                console.log( ('\t' + table).green );
            });
        });
    }
)
.finally(
    function() {
        connection.end();
    }
);