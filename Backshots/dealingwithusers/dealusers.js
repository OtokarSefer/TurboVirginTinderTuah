require("dotenv").config();
const bcrypt = require('bcryptjs');
const con = require('../db/db'); 
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const { User } = require('../../models');


const captchas = {}

const createUser = async (req, res) => {
    const { email, password, name, captcha } = req.body;
  
    if (!email || !password || !name || !captcha) {
      return res.status(400).json({ error: "Please enter valid username, email, password, captcha, dumass" });
    }
  
    try {
      // Checking if the user already  exists in the database
      const existingUser = await User.findOne({where: {email}})
      
      if (existingUser) {
        return res.status(400).json({ error: "Email already in use." });
      }

      if (captchas[email] !== parseInt(captcha)) {
        return res.status(400).json("Wrong captcha, your bad");
      }
      

      delete captchas[email]

      // Encrypting the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      
      const user = await User.create({
        email,
        password: hashedPassword,
        name
      });
  
      res.status(201).json({ message: "User registered successfully!" });
  
    } catch (error) {
      console.error("Signup Error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
};


const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  try {
    console.log("Checking user in database for email:", email);

    const user = await User.findOne({where: {email}})

    if (!user) {
      console.log("No user found with this email");
      return res.status(401).json({ error: "Invalid credentials" });
    }

    console.log("User found:", user.email);
    console.log("Stored hash in DB:", user.password);
    console.log("Entered password:", password);

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      console.log("Password not correct dumass");
      return res.status(401).json({ error: "Invalid credentials" });
    }

    console.log(`Login successful! User's email: ${user.email}, User's name: ${user.name}`);

    const token = jwt.sign({ userId: user.id }, process.env.JWT_TOKEN, { expiresIn: "1h" });
   
   
    res.cookie("authToken", token, {
      httpOnly: true, 
      secure: true,  
      sameSite: "Strict",
      maxAge: 60 * 60 * 1000, 
    });
   
   
    res.json({ token, user: { id: user.id, email: user.email } });
    console.log(token)

  } catch (error) {
    console.error("Server Error:", error);    
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const sendCaptcha = async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ error: "Email is required" });

  const captcha = Math.floor(100000 + Math.random() * 900000);
  captchas[email] = captcha;

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    auth: {
      user: process.env.GNAME,
      pass: process.env.GPASS, 
    },
  });

  const mailOptions = {
    from: process.env.GNAME,
    to: email,
    subject: "Your CAPTCHA Code",
    text: `Your verification code is: ${captcha}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ message: "Captcha sent successfully!" });
  } catch (error) {
    console.error("Email error:", error);
    res.status(500).json({ error: "Failed to send captcha email." });
  }
}

const getUser = async (req, res) => {
  try {
    const userId = req.user.userId; 
    console.log("User ID from JWT:", userId); 

    if (!userId) {
      return res.status(400).json({ error: 'User ID is missing' });
    }

    const user = await User.findOne({ where: { id: userId } });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json({
      id: user.id,
      name: user.name,
      email: user.email,
      age: user.age,
      gender: user.gender,
      bio: user.bio,

    });
  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};



const authenticateToken = (req, res, next) => {
  const token = req.cookies.authToken || req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: "Authentication required" });
  }

  jwt.verify(token, process.env.JWT_TOKEN, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Invalid or expired token" });
    }   


    console.log("user", user)

    req.user = user;
    next();
  });
};

const changeData = async (req, res) => {
  const {name, gender, bio, age}  = req.body
  try {
    const userId = req.user.userId; 
    console.log("User ID from JWT:", userId); 

    if (!userId) {
      return res.status(400).json({ error: 'User ID is missing' });
    }

    const user = await User.findOne({ where: { id: userId } });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (name) user.name = name;
    if (gender) user.gender = gender;
    if (bio) user.bio = bio;
    if (age) user.age = age;
    console.log(name, gender, bio, age)

    await user.save();

    
  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}




module.exports = { createUser, loginUser,
   sendCaptcha, getUser,
    authenticateToken, changeData }