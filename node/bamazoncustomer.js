// require("dotenv").config();
'use strict';

//Node Modules
const mysql         = require('mysql');
const inquirer      = require('inquirer');
const cTable        = require('console.table');


// sql node server configuration not sure how to get this working

const connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'root',
  database : 'bamazon',
  port     :  3306
});

connection.connect();


// show the list

const goPrompt = () => {
    connection.query('select * from bamazon.products',
        function (err, rows) {
            if (err) {
                console.log(err);
                return;
            }

            function print(rows) {
                // Find Max item string length of each column
                var max = {item_id: 2, product_name: 4, department_name: 11, price: 5, stock_quantity: 5};
                for (let i = 0; i < rows.length; i++) {
                    max.item_id = (rows[i].item_id.toString().length > max.item_id) ? rows[i].item_id.toString().length : max.item_id;
                    max.product_name = (rows[i].product_name.length > max.product_name) ? rows[i].product_name.length : max.product_name;
                    max.department_name = (rows[i].department_name.length > max.department_name) ? rows[i].department_name.length : max.department_name;
                    max.price = (rows[i].price.toString().length > max.price) ? rows[i].price.toString().length : max.price;
                    max.stock_quantity = (rows[i].stock_quantity.toString().length > max.stock_quantity) ? rows[i].stock_quantity.toString().length : max.stock_quantity;
                }

            }

            print(rows);
            const table = rows;
            console.table(table);
            goPrompt();
        });


// Inquirer Prompt for Customer

    const goPrompt = () => {
        inquirer.prompt([
            // this line is logging before the sql? why...? probably need the wait function
            {
                type: "input",
                name: "warning",
                message: "Use this app to buy some products from Bamazon! Press cntrl + c at anytime to exit. Press enter to continue."
            }, {
                type: "input",
                name: "custProduct",
                message: "Please search for your item by item_id."
            }, {
                type: "input",
                name: "custAmount",
                message: "Quantity?"
            }]).then(function (answers) {
            // something is off on this then(function) because it is ending my app before it makes the request below.
            let custProduct = answers.custProduct;
            let custAmount = answers.custAmount;
            let sql = 'update products set stock_quantity = stock_quantity - ? where item_id = ?;';
            let sql2 = 'update calc_product_sales set amount_of_sales = amount_of_sales + ? where item_id = ?';
            let sql3 = 'update calc_product_sales set revenue = amount_of_sales * price';
            let data2 = [custAmount, custProduct];
            let data = [custAmount, custProduct, custAmount];
            let stock = 'select stock_quantity from products where item_id =' + custProduct;
            let updateSuper = 'update supervisor set product_sales = product_sales + ? where department_id = ?;'
            // need to add function for if the users amount they want to buy is greater than the stock_quantity it will give them an error

            //passes and subtracts from the db
            connection.query(sql, data,
                function (err, rows) {
                    if (err) {
                        console.log(err);
                        return;
                    }
                    if (custAmount > stock){
                        console.log('Not enough stock');
                        connection.end();
                    }
                    if (custAmount >= 1) {
                        connection.query(sql2, data2,
                            function (err) {
                                console.log(err);
                                return;
                            }
                        )
                    }
                    if (custProduct >= 0) {
                        connection.query(sql3,
                            function (err) {
                                console.log(err);
                                return;
                            })
                    }

                    const table2 = rows;
                    console.table(table2);
                    connection.end();
                })
        });
    }
}
goPrompt();
