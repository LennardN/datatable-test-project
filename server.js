const express = require('express');
const path = require('path');
//const fs = require('fs');
//const obj = JSON.parse(fs.readFileSync('./data.json', 'utf8'));
const db = require("./database")

const app = express();
const port = process.env.PORT || 8080;


console.log('Server started at http://localhost:' + port);

app.use(express.static(path.join(__dirname, 'client')))
app.use(express.urlencoded({ extended: false }));

app.post('/api/change', function(req, res){
    let changedCol = req.body.changedCol
    let changedText = req.body.changedText

    let query = `
        UPDATE testing.users SET ${changedCol} = "${changedText}"
        WHERE 1
        AND (name LIKE "${req.body.name}" 
        AND position LIKE "${req.body.position}" 
        AND office LIKE "${req.body.office}" 
        AND extn LIKE "${req.body.extn}"
        AND start_date LIKE "${req.body.start_date}"
        AND salary LIKE "${req.body.salary}")`

    db.query(query, function(error, data){
        if(error){
            res.send(500)
            res.send("Query not found")
            return
        }
        res.status(200)
        res.send("Changed " + changedCol + " = " + changedText)
    })

    
})

app.get('/api/data', function(req, res) {
    res.setHeader('Content-Type', 'application/json')
    res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:8080');

    var draw = req.query.draw;
    var start = req.query.start;
    var length = req.query.length;
    var order_data = req.query.order;
    
    if(typeof order_data == 'undefined'){
        var column_name = 'users.name'
        var column_sort_order = 'asc'
    }else{
        var column_index = req.query.order[0]['column']
        var column_name = req.query.columns[column_index]['data']
        var column_sort_order = req.query.order[0]['dir']
    }
    var search_value = req.query.search['value']

    var search_query = `
        AND (name LIKE '%${search_value}%' 
        OR position LIKE '%${search_value}%' 
        OR office LIKE '%${search_value}%' 
        OR extn LIKE '%${search_value}%'
        OR start_date LIKE '%${search_value}%'
        OR salary LIKE '%${search_value}%'
        )`


    db.query("SELECT COUNT(*) AS Total FROM users", function(error, data){
        var total_records = data[0].Total

        db.query(`SELECT COUNT(*) AS Total FROM users WHERE 1 ${search_query}`, function(error, data){
            var total_records_with_filter = data[0].Total;
            var data_arr = [];

            var query = `
                SELECT * FROM users 
                WHERE 1 ${search_query} 
                ORDER BY ${column_name} ${column_sort_order} 
                LIMIT ${start}, ${length}`;

            db.query(query, function(error, data){
                data.forEach((row) => {
                    data_arr.push({
                        'name' : row.name,
                        'position' : row.position,
                        'office' : row.office,
                        'extn' : row.extn,
                        'start_date' : row.start_date,
                        'salary' : row.salary
                    })
                })
                var output = {
                    'draw' : draw,
                    'iTotalRecords' : total_records,
                    'iTotalDisplayRecords' : total_records_with_filter,
                    'aaData' : data_arr
                };
    
                res.json(output);
            })
        })
    })
})

app.listen(port)