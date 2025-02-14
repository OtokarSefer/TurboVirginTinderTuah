const bodyParser = require("body-parser");
const path = require("path");
const mysql = require("mysql2");
const express = require("express");
const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // Add JSON body parser
app.use(express.static(path.join(__dirname, "..", "build")));
app.use(express.static("public"));

// CORS Headers
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

// Create MySQL connection
const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Mybr41n15",
  database: "users",
});

// Connect to MySQL
con.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }
  console.log("Connected to MySQL database!");
});

// Example route to fetch users
app.get("/users", (req, res) => {
  const sql = "SELECT * FROM users";
  con.query(sql, (err, results) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ message: "Database error" });
    }
    res.json(results); // Send the results as JSON
  });
});

// Default route
app.get("/", (req, res) => {
  res.send("Welcome to the server!");
});

// Handle 404 errors
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Start the server
const port = 3001;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// Export the connection for use in other modules (if needed)
module.exports = con;