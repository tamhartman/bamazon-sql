// require("dotenv").config();
'use strict';

//Node Modules
const mysql         = require('mysql');
const inquirer      = require('inquirer');
const cTable        = require('console.table');


// sql node server configuration not sure how to get this working

let connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'root',
  database : 'bamazon',
  port     :  3306
});

connection.connect();


inquirer.prompt([
     {
      type: 'list',
      name: 'manager',
      message: 'What do you want to do?',
      choices: [
        'View Products for Sale',
        'View Low Inventory',
        'Add to Inventory',
        'Add New Product',
        ]}
]).then(answers => {

    const response = answers.manager;

    switch (response) {
      // View table
      case 'View Products for Sale':

        connection.query('select * from bamazon.products',
          function(err, rows){
            if (err) {
              console.log(err);
              return;
            }
              // shows the table nice and neat. Thanks to my friend on discord CrazyInfin8#7283 for helping so much with this
              function print(rows) {
              // Find Max item string length of each column
              var max = {item_id: 2, product_name: 4, department_name: 11, price: 5, stock_quantity: 5};
              for(let i = 0; i < rows.length; i++) {
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
          connection.end();
          });

        break;

      // View low Inventory
      case 'View Low Inventory':
        let call = 'select * from products where stock_quantity <= 105';

        connection.query(call,
          function(err, rows){
            if (err) {
              console.log(err);
              return;
            }

          const table3 = rows;
          console.table(table3);
          connection.end();
          });

        break;
      // add to Inventory
      case 'Add to Inventory':
        inquirer.prompt([
          {
            type: "input",
            name: "product",
            message: "What product would you like to add Stock to? Use the item_id"
          },{
            type: "input",
            name: "addAmount",
            message: "How many would you like to add?"
          }]).then(function(answers){
          // something is off on this then(function) because it is ending my app before it makes the request below.
          let product     = answers.product;
          let addAmount   = answers.addAmount;
          let sql         = 'update products set stock_quantity = stock_quantity + ? where item_id = ?';
          let data        = [addAmount, product];

          //passes and subtracts from the db
          connection.query(sql, data,
                           function(err, rows){
            if (err) {
              console.log(err);
              return;
            }
            const table2 = rows;
            console.table(table2);

            connection.end();
          })

        });
        break;

      case 4:
      case 'Add New Product':
        inquirer.prompt([
          {
            type: "input",
            name: "warning",
            message: "Press enter to continue."
          },{
            type: "input",
            name: "newProduct",
            message: "What is the name of the product you would like to add?"
          },{
            type: "input",
            name: "addStock",
            message: "How many would you like to add?"
          },{
            type: "input",
            name: "addDepartment",
            message: "What department is this in?"
          },{
            type: "input",
            name: "addPrice",
            message: "How much will this item cost?"
          },{
            type: "input",
            name: "addId",
            message: "What will the item_id be?"
          }]).then(function(answers){
            let newProduct    = answers.newProduct;
            let addStock      = answers.addStock;
            let addDepartment = answers.addDepartment;
            let price         = answers.addPrice;
            let addId         = answers.addId;

            let data          = [addId, newProduct, addDepartment, addStock, price];
            let sql           = 'insert into products(item_id, product_name, department_name, stock_quantity,  price) values(?, ?, ?, ?, ?)';

            connection.query(sql, data,
                             function(err, rows){
              if (err) {
                console.log(err);
                console.log('You probably did not put in anything in the fields above. And are seeing the error above. Try actually adding a product');
                return;
            }
            const table3 = rows;
            console.table(table3);

            connection.end();
          })
        });
        break;

    }
  console.log(response);

});


