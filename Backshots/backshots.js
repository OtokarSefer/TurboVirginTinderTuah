const bodyParser = require("body-parser")
const path = require("path");
const mysql = require('mysql2')
const express = require("express");
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "..", "build")));
app.use(express.static('public'));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

// Creating connection in MySql db
const con =  mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'qwerty',
    database: 'enter_name_here_for_db'
});

con.connect(function (err) {
    if (err) throw err;
    console.log("Connected to your joga_mysql database :V");
});


module.exports = con;

app.use((req, res) => {
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  res.status(404).json({ message: "Not" });
});

const port = 3001;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});