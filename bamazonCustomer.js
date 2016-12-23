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


