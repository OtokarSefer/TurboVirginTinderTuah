require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// Create MySQL connection
const con = mysql.createConnection({
  host: process.env.DB_HOST,        
  user: process.env.DB_USER,        
  password: process.env.DB_PASSWORD, 
  database: process.env.DB_NAME     
});

con.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }
  console.log("Connected to MySQL database!");
});

// Login API

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  try {
    console.log("Checking user in database for email:", email);

    const [results] = await new Promise((resolve, reject) => {
      con.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
        if (err) {
          console.error("Database Query Error:", err);
          reject(err);
        } else {
          resolve([results]);
        }
      });
    });

    if (results.length === 0) {
      console.log("No user found with this email");
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const user = results[0];
    console.log("User found:", user.email);
    console.log("Stored hash in DB:", user.password_hash);
    console.log("Entered password:", password);

    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
      console.log("Password not correct dumass");
      return res.status(401).json({ error: "Invalid credentials" });
    }

    console.log("Login successful!");

    const token = jwt.sign({ userId: user.id }, process.env.JWT_TOKEN, { expiresIn: "1h" });

    res.json({ token, user: { id: user.id, email: user.email } });

  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/", (req, res) => {
  res.send("Server is running!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
