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

inquirer.prompt([
	{
		type: "list",
		message: "Choose an action:",
		choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"],
		name: "action"
	}
	]).then(function(input){
		switch (input.action){
			case "View Products for Sale":
			viewItems();
			break;
			case "View Low Inventory":
			viewLowInventory();
			break;
			case "Add to Inventory":
			addInventory();
			break;
			case "Add New Product":
			addProduct();
			break;
		}
	});

function viewItems(){
	connection.query("SELECT item_id, product_name, stock_quantity, price FROM products", function(error, results){
		if(error){
			console.log(error);
		}
		for(var i = 0; i < results.length; i++){
			console.log("item id#: " + results[i].item_id + " | " + results[i].product_name + " | price: $" + results[i].price + " | Qty on hand: " + results[i].stock_quantity);
		}
	});
};

function viewLowInventory(){
	connection.query("SELECT item_id, product_name, stock_quantity, price FROM products WHERE stock_quantity < 5", function(error, results){
		if(error){
			console.log(error);
		}
		for(var i = 0; i < results.length; i++){
			console.log("item id#: " + results[i].item_id + " | " + results[i].product_name + " | price: $" + results[i].price + " | Qty on hand: " + results[i].stock_quantity);
		}
	});
};

function addInventory(){
	connection.query("SELECT item_id, product_name, stock_quantity, price FROM products", function(error, results){
		if(error){
			console.log(error);
		}
		for(var i = 0; i < results.length; i++){
			console.log("item id#: " + results[i].item_id + " | " + results[i].product_name + " | price: $" + results[i].price + " | Qty on hand: " + results[i].stock_quantity);
		}
	
		inquirer.prompt([
		{
			type: "input",
			message: "which item would you like to add Inventory to?...pick a product id # and type it in.",
			name: "item"
		},
		{
			type: "input",
			message: "and how many of that item would you like to add?",
			name: "new_stock"
		}
		]).then(function(values){
			var newQty = values.new_stock;
			var item = values.item;
			connection.query(`UPDATE products SET stock_quantity = stock_quantity + ${newQty} WHERE ?`, [{item_id: item}], function(error, results){
				if(error){
					console.log(error);
				}
				// console.log(results);
				console.log("You have updated item #" + item + " by " + newQty + " unit(s) of inventory");
			});
		});
	});
};

var array = [];
function addProduct(){
	connection.query("SELECT department FROM products", function(error, results){
		if(error){
			console.log(error);
		}
		for(var i = 0; i < results.length; i++){
			array.push(results[i].department);
		}
	});

	inquirer.prompt([
		{
			type: "input",
			message: "What is the name of the new product?",
			name: "name"
		},
		{
			type: "input",
			message: "What is the price you will be selling this product for?",
			name: "price"
		},
		{
			type: "input",
			message: "What is the initial quantity you want on hand?",
			name: "qty"
		},
		{
			type: "list",
			message: "which department would you like this to be under?",
			choices: array,
			name: "dept"
		}
		]).then(function(newItem){
			// console.log("woot");
		connection.query(`INSERT INTO products(product_name, price, stock_quantity, department) VALUES ("${newItem.name}", ${newItem.price}, ${newItem.qty}, "${newItem.dept}")`, function(error, results){
			if(error){
				console.log(error);
			}
			console.log(results);
		})
	});
};





