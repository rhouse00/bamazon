// Populate this database with around 10 different products. (i.e. Insert "mock" data rows into this database and table).

// Then create a Node application called bamazonCustomer.js. Running this application will first display all of the items available for sale. 
// Include the ids, names, and prices of products for sale.

// The app should then prompt users with two messages.
// The first should ask them the ID of the product they would like to buy.
// The second message should ask how many units of the product they would like to buy.

// Once the customer has placed the order, your application should check if your store has enough of the product to meet the customer's request.'
// If not, the app should log a phrase like Insufficient quantity!, and then prevent the order from going through.

// However, if your store does have enough of the product, you should fulfill the customer's order.'

// This means updating the SQL database to reflect the remaining quantity.
// Once the update goes through, show the customer the total cost of their purchase.



var inquirer = require("inquirer");
var mysql = require("mysql");

var connection = mysql.createConnection({
	host: "localhost",
	port: 3306,
	user: "root",
	password: "password",
	database: "Bamazon"
});

// TESTS CONNECTION TO MySQL 
// connection.connect(function(err){
// 	if(err) throw err;
// 	console.log("connected as id " + connection.threadId);
// });

function start(){
	connection.query("SELECT product_name, item_id, price FROM products", function(error, results){
		if(error){
			console.log(error);
		}
		for(var i = 0; i < results.length; i++){
			console.log("item id#: " + results[i].item_id + " | " + results[i].product_name + " | price: $" + results[i].price + "\n" );
		}
		buyItem();
	});

};
start();

function buyItem(){
	inquirer.prompt([
			{
				type: "input",
				message: "Which item would you like to buy?...type in item id #",
				name: "choice"
			}
		]).then(function(input){

			inquirer.prompt([
				{
					type: "input",
					message: "How many would you like to buy?",
					name: "quantity",
					validate: function(value){
						if(isNaN(value) == false){
							return true
						}
						return false
					}
				}
			]).then(function(units){
				var item = input.choice;
				var qty = units.quantity;
				products(qty, item);
			});
	});
};

function products(qty, item){
	connection.query("SELECT product_name, stock_quantity, price FROM products WHERE ?", {item_id: item}, function(error, results){
		var stock = results[0].stock_quantity;
		var name = results[0].product_name;
		var price = results[0].price
		if(error){
			console.log(error);
		}
		if(qty > stock){
			console.log("Insufficient quantity. Try a smaller quantity or a different item.");
			buyItem();
		} else {
			var newQty = stock - qty;
			console.log("You just bought:\n" + results[0].product_name + " x" + qty + "\nTotal: $" + (results[0].price * qty) );
				connection.query("UPDATE products SET ? WHERE ?", [{stock_quantity: newQty}, {item_id: item}], function(error, results){
					if(error){
						console.log(error);
					}
				});
				connection.query("SELECT product_name, stock_quantity, price FROM products WHERE ?", {item_id: item}, function(error, results){
					if(error){
						console.log(error);
					}
				});
		}
	});
};


