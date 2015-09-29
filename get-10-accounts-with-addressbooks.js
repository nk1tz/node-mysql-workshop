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
        // console.log(result[0]);
        return result[0];
    }
)
.map(
    function(account){
        return connection.queryAsync('SELECT * FROM AddressBook WHERE accountId = '+ account.id)
        .then(
            function(addressBooks){
                var addressBooksInfo = addressBooks[0].map( function(ele, ind){
                    return ele.name;
                });
                return addressBooksInfo;
                // console.log(addressBooks[0].name);
                // console.log(addressBooks[0].accountId);
            }
        )
        .then(
            function(addressbookNames){
                return {AccountId: account.id, AccountEmail: account.email, AddressBooks: addressbookNames};
   
            }
        );
    }
)
.each(
    function(listings){
        console.log("\nAccount ID : ".yellow + listings.AccountId);
        console.log("Account Email : ".yellow + listings.AccountEmail.cyan.bold + "\nAddress Books : ".yellow);
        listings.AddressBooks.forEach(function(ele,ind){
            console.log("\t" + ele.green);
        });
    }
)
.finally(
    function() {
        connection.end();
    }
);




// // Joins
// // One of the problems is that if I need 10 accounts, LIMIT will be troublesome
// SELECT * FROM Account JOIN AddressBook ON Account.id = AddressBook.accountId;

// // Billion queries way
// SELECT * FROM Account LIMIT 10;
// // Then for each account, run the following query
// SELECT * FROM AddressBook WHERE accountId = <REPLACE THIS WITH CURRENT Account.id>;
// // This will result in 11 queries, not super efficient but at least we get 10 account and only 10 accounts

// // "Best of both worlds"?
// SELECT * FROM Account LIMIT 10;
// // Gather up all the Account.id and do one more query
// SELECT * FROM AddressBook WHERE accountId IN (1,2,3,4,5); // Whatever IDs were extracted
