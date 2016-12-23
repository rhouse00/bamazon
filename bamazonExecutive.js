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
		choices: ["View Product Sales by Department","Create New Department"],
		name: "action"
	}
	]).then(function(input){
		switch (input.action){
			case "View Product Sales by Department":
			viewSales();
			break;
			case "Create New Department":
			addDepartment();
			break;
		}
});

function viewSales(){
	connection.query("SELECT *, (total_sales - over_head_costs) AS total_profit FROM departments", function(error, results){
		if(error){
			console.log(error);
		}
		// console.log(results);
		for(var i = 0; i < results.length; i++) {
			console.log("Dept id# " + results[i].department_id + " | Dept Name: " + results[i].department_name + " | Overhead Costs: $" + results[i].over_head_costs + " | Sales: $" + results[i].total_sales + " | Profit: $" + results[i].total_profit)
		}
	});
};

function addDepartment(){
	inquirer.prompt([
		{
			type: "input",
			message: "What is the name of the new department?",
			name: "name"
		},
		{
			type: "input",
			message: "What is the current Overhead Costs in this department?",
			name: "overhead",
			validate: function(value){
						if(isNaN(value) == false){
							return true
						}
						return false
					}
		},
		{
			type: "input",
			message: "What is the current Total Sales in this department?",
			name: "sales",
			validate: function(value){
						if(isNaN(value) == false){
							return true
						}
						return false
					}
		}
		]).then(function(newDept){
			var name = newDept.name;
			var costs = newDept.overhead;
			var sales = newDept.sales;
			connection.query(`INSERT INTO departments(department_name, over_head_costs, total_sales) VALUES("${name}", ${costs}, ${sales})`, function(error, results){
				if(error){
					console.log(error);
				}
				console.log(results);
			});
		});
};

