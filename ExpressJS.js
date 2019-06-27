//Cheat Sheet for ExpressJS

//Install express-generator globally
npm install -g express-generator

//create an express app called "express-app"
express express-app
npm install  //install all modules
npm start    //start the server on localhost:3000




//IN THE app.js FILE
//install nodemon as a development dependency
npm install -D nodemon
//after installation, add the follwing line to the scripts object in package.json
"dev": "nodemon ./bin/www"

//add the following code to the app.js file
var usersRouter = require('./routes/users');
const bodyParser = require('body-parser');    //parsing parameters passedin
const cors = require('cors');    //cross domain access

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}))
app.use(cors());     //has to be used before the data accessing methods

app.use('/users', usersRouter);




//IN THE users.js FILE
var express = require('express');
var router = express.Router();
const mysql = require('mysql')

//create a connection pool to access data
const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'practice_database'

})

//get all users in the database
router.get('/', (req, res) => {
  pool.getConnection((err, conn) => {
    conn.release()
    if(err){
      res.sendStatus(500)
    }

    const queryString = 'SELECT * FROM users'
    conn.query(queryString, (err, rows) => {
      if(err){
        res.sendStatus(500)
      }
      res.json(rows)

    })
  })
  
});

//select a specific user 
router.get('/:id', (req, res) => {
  pool.getConnection((err, conn) => {
    conn.release()
    if(err){
      res.sendStatus(500)
    }

    const queryString = 'SELECT * FROM users WHERE id = ?'
    conn.query(queryString, [req.params.id], (err, rows) => {
      if(err){
        res.sendStatus(500)
      }
      res.json(rows)

    })
  })
})

//create a new user
router.post('/', (req, res) => {
  pool.getConnection((err, conn) => {
    conn.release()
    if(err){
      res.sendStatus(500)
    }

    const queryString = 'INSERT INTO users(first_name, last_name) VALUES(?, ?)'
    conn.query(queryString, [req.body.firstName, req.body.lastName], (err, rows) => {
      if(err){
        res.sendStatus(500)
      }

      res.json(rows)
    })
  })
})

//update a user
router.put('/', (req, res) => {
  pool.getConnection((err, conn) => {
    conn.release()
    if(err){
      res.sendStatus(500)
    }

    const queryString = 'UPDATE users SET first_name = ?, last_name = ? WHERE id = ?'
    conn.query(queryString, [req.body.firstName, req.body.lastName, req.body.id], (err, rows) => {
      if(err){
        res.sendStatus(500)
      }

      res.json(rows)
    })
  })
})

//delete a user
router.delete('/:id', (req, res) => {
  pool.getConnection((err, conn) => {
    conn.release()
    if(err){
      res.sendStatus(500)
    }

    const queryString = 'DELETE FROM users WHERE id = ?'
    conn.query(queryString, [req.params.id], (err, rows) => {
      if(err){
        res.sendStatus(500)
      }

      res.send(`User ${req.params.id} was deleted!!`)
    })
  })
})

module.exports = router;




