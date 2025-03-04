require("dotenv").config();
const bcrypt = require('bcryptjs');
const mysql = require('mysql2');

// MySQL connection
const con = mysql.createConnection({
  host: process.env.DB_HOST,        
  user: process.env.DB_USER,        
  password: process.env.DB_PASSWORD, 
  database: process.env.DB_NAME     
});

con.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL!');
});

async function createUser(email, password) {
  const hashedPassword = await bcrypt.hash(password, 10);

  const sql = 'INSERT INTO users (email, password_hash, name) VALUES (?, ?, ?)';
  con.query(sql, [email, hashedPassword, 'Cooler name'], (err, result) => {
    if (err) throw err;
    console.log(`User ${email} created successfully!`);
    con.end();
  });
}

// Example user
createUser('tester@example.com', 'password123456');
