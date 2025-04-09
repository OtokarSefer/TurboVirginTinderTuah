const bodyParser = require("body-parser");
const path = require("path");
const mysql = require("mysql2");
const express = require("express");
const app = express();

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config(); // Load environment variables

const SECRET_KEY = process.env.JWT_SECRET || "fuck_you"; // Use env variable for security

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // Add JSON body parser
app.use(express.static(path.join(__dirname, "..", "build")));
app.use(express.static("public"));

const cors = require("cors");

// CORS Middleware
app.use(
  cors({
    origin: "http://localhost:5173", // Allow only your frontend domain
    methods: "GET,POST,OPTIONS",
    allowedHeaders: "Content-Type,Authorization",
  })
);

// Handle Preflight Requests
app.options("*", cors());


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

const authenticateToken = require("../Backshots/auth.js"); // Import JWT middleware

// 🔒 Protected route example
app.get("/protected", authenticateToken, (req, res) => {
  res.json({ message: "You have accessed a protected route!", user: req.user });
});


// Modify the login route to use JWT
app.post("/login", (req, res) => {
  console.log("Login request received");
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

    const sql = "SELECT * FROM users WHERE email = ?";
  con.query(sql, [username], async (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Internal server error" });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: "User not found" });
    }

    const user = results[0];

    // Compare hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: "1h" });

    res.json({ message: "Login successful", token });
  });
});


//signup
app.post("/signup", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  const hashedPassword = await bcrypt.hash(password, 10); // Hash password

  const sql = "INSERT INTO users (email, password) VALUES (?, ?)";
  con.query(sql, [username, hashedPassword], (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Error creating user" });
    }

    res.json({ message: "User created successfully!" });
  });
});


// Default route
app.get("/", (req, res) => {
  res.send("Welcome to the server!");
});

// Handle 404 errors
app.use((req, res) => {
  res.status(404).json({ message: "Somethings moldy" });
});

// Start the server
const port = 3001;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// Export the connection for use in other modules (if needed)
module.exports = con;