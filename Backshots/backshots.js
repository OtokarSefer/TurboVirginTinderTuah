require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const con = require("./db/db");
const app = express();

app.use(express.json());
app.use(cors());

// PLACE EVERYTHING NEATLY IN FILES, to avoid confusion i guess



// Signup

app.post("/api/signup", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  try {
    // Checking if the user already exists in the database
    const [existingUser] = await new Promise((resolve, reject) => {
      con.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
        if (err) reject(err);
        else resolve([results]);
      });
    });

    if (existingUser.length > 0) {
      return res.status(400).json({ error: "Email already in use." });
    }

    // Encrypting the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await new Promise((resolve, reject) => {
      con.query(
        "INSERT INTO users (email, password_hash, name) VALUES (?, ?, ?)",
        [email, hashedPassword, null],
        (err, results) => {
          if (err) reject(err);
          else resolve(results);
        }
      );
    });

    res.status(201).json({ message: "User registered successfully!" });

  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
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