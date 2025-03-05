const express = require("express");
const cors = require("cors");
const authRoutes = require('./router/authRoutes');
const app = express();

app.use(express.json());
app.use(cors());

// PLACE EVERYTHING NEATLY IN FILES, to avoid confusion i guess

app.use('/api', authRoutes);

app.get("/", (req, res) => {
  res.send("Server is running!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));