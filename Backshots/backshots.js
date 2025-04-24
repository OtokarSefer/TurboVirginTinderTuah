require("dotenv").config();
const express = require("express");
const cors = require("cors");
const authRoutes = require('./router/authRoutes');
const app = express();
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");



app.use(express.json());
app.use(cookieParser()); 
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ['GET', 'POST', 'PATCH'],
    credentials: true, 
  })
);


// PLACE EVERYTHING NEATLY IN FILES, to avoid confusion i guess

app.use('/api', authRoutes);


app.get("/", (req, res) => {
  res.send("Server is running!");
});

app.get("/auth/verify", (req, res) => {
  const token = req.cookies.authToken; 

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_TOKEN);
    return res.json({ authenticated: true, userId: decoded.userId });
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
});


app.post("/logout", (req, res) => {
  res.clearCookie("authToken");
  return res.json({ message: "Logged out successfully" });
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));