CREATE DATABASE Bamazon;

USE Bamazon;

CREATE TABLE products (
	item_id INTEGER AUTO_INCREMENT NOT NULL,
	product_name VARCHAR(40) NOT NULL,
	price INTEGER NOT NULL,
	stock_quantity INTEGER NOT NULL DEFAULT 0,
	department VARCHAR(40) NOT NULL,
	PRIMARY KEY(item_id)
);

CREATE TABLE departments (
	department_id INTEGER(10) AUTO_INCREMENT NOT NULL,
	department_name VARCHAR(40) NOT NULL,
	over_head_costs INTEGER(10) DEFAULT 0,
	total_sales INTEGER(10) DEFAULT 0,
	PRIMARY KEY(department_id)

);


INSERT INTO products (product_name, price, stock_quantity, department)
VALUES()