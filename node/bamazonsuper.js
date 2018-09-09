// require("dotenv").config();

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
      name: 'supervisor',
      message: 'Please designate a task',
      choices: [
        'Set Revenue',
        'Set total_Profit',
         'View Data',
          'Reset Table'
        ]}
]).then(answers => {
    /*
   1. add an alias for sql not really sure what this is yet but have to do it
   2. add a function in bamazoncustomer.js that sends the data to the supervisor
   table to add product sales
   3.add a function in mysql (supervisor table) that takes the price of the product
   from the products table.
   4. add a function in sql that (product_sales * price) - over_head_costs
   */
    const response = answers.supervisor;

    switch (response) {
        case 'Set Revenue':
            let joinTables = 'select calc_product_sales.revenue from bamazon.calc_product_sales right join select supervisor.product_sales from bamazon.supervisor';
            // let sql2 = 'update supervisor set product _sales = ' + getRev;
            connection.query(joinTables,
                function (err, rows){
                if (err){
                    console.log(err);
                    return;
                }
                const table3 = rows;
                console.table(table3);
                connection.end();
                })

        case 'Set total_Profit':
        let sql = 'update supervisor set total_profit = product_sales - over_head_costs';

        //passes and subtracts from the db
        connection.query(sql,
            function (err, rows) {
                if (err) {
                    console.log(err);
                    return;
                }

                const table = rows;
                console.table(table);

                connection.end();
            });
        break;
        case  'View Data':

            connection.query('select * from bamazon.supervisor',
                function(err, rows){
                    if (err) {
                        console.log(err);
                        return;
                    }
                    const table = rows;
                    console.table(table);
                    connection.end();
                });
         break;
        case 'Reset Table':
            // function to Reset Profits
            const restProfit = () => {
                let sql1 = 'update supervisor set total_profit = 0';
                connection.query(sql1,
                    function (err, rows) {
                        if (err) {
                            console.log(err);
                            return;
                        }

                        const table = rows;
                        console.table(table);
                    });
            }
            // function to reset sales
            const restSales = () => {
                let sql4 = 'update supervisor set product_sales = 0';
                connection.query(sql4,
                    function (err, rows) {
                        if (err) {
                            console.log(err);
                            return;
                        }

                        const restTable = rows;
                        console.table(restTable);
                    });
            }
         restProfit();
         restSales();
         connection.end();
    }
});