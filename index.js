var express = require('express');
var path = require('path')
var pg = require('pg');
var bodyParser = require('body-parser');
var PORT = process.env.PORT || 8080;
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: '',
  ssl: false
});
// Database portnumber: 5432
var app = express();
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
// CORS settings
//app.use(cors());

// Add headers
app.use(function (req, res, next) {
// Website you wish to allow to connect
res.setHeader('Access-Control-Allow-Origin', '*')
// // Request methods you wish to allow
res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
// Request headers you wish to allow ,
res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers');
// , Origin,Accept,X-Requested-With,Access-Control-Request-Method,Access-Control-Request-Headers,Authorization
// Pass to next layer of middleware
next();
});

// completed | task | username
// ----+-----------+----------+----------

app.use(express.static(path.join(__dirname, 'project1')));

app.listen(PORT, () => console.log('Listening on ${ '+ PORT + ' }'))

app.get('/', function (req, res){
//res.send('Hello homepage');
});


app.get('/get-all', async function (req, res) {
  try {
    const client = await pool.connect();
    var dbData = await client.query('SELECT * FROM todo;');
    var result = [];

    if(!dbData){
      return res.send('No data found');
    } else {
      dbData.rows.forEach(row=>{
        result.push(row);
      });
      res.json(result);
    }
    await client.release();
  } catch (e){
    console.error(e);
    res.send("Error: " + e);
  }
});

app.post('/new-task', async function (req, res) {
  try {
    const client = await pool.connect();
    var completed = req.body.completed;
    var task = req.body.task;
    var username = req.body.username;
    var query = await client.query("INSERT INTO todo VALUES ('" + completed +"', '" + task + "', '" + username + "');");
    client.release();
  } catch (e){
    console.error(e);
    res.send("Error: " + e);
  }
});

app.put('/done-task', async function (req, res) {
  try {
    const client = await pool.connect();
    var completed = req.body.completed;
    var task = req.body.task;
    var username = req.body.username;
    var query = await client.query("UPDATE todo SET completed = '1' WHERE completed = '" + completed + "' AND task = '" + task + "' AND username = '" + username + "';");
    client.release();
  } catch (e){
    console.error(e);
    res.send("Error: " + e);
  }
});

app.put('/edit-task', async function (req, res) {
  try {
    const client = await pool.connect();
    var completed = req.body.completed;
    var task = req.body.task;
    var username = req.body.username;
    var newTaskName = req.body.newTaskName;
    var newUserName = req.body.newUserName;
    var query = await client.query("UPDATE todo SET task = '" + newTaskName + "', username = '" + newUserName + "' WHERE completed = '" + completed + "' AND task = '" + task + "' AND username = '" + username + "';");
    client.release();
  } catch (e){
    console.error(e);
    res.send("Error: " + e);
  }
});

app.delete('/delete-task', async function (req, res) {
  try {
    const client = await pool.connect();
    var completed = req.body.completed;
    var task = req.body.task;
    var username = req.body.username;
    var query = await client.query("DELETE FROM todo WHERE completed = '" + completed + "' AND task = '" + task + "' AND username = '" + username + "';");
    client.release();
  } catch (e){
    console.error(e);
    res.send("Error: " + e);
  }
});
