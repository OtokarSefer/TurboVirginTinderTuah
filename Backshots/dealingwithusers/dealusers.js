require("dotenv").config();
const bcrypt = require('bcryptjs');
const con = require('../db/db'); 
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const { User, PendingUser } = require('../../models');
const { Op } = require('sequelize')



// What more to do? Fix changedata, Get fetching users working correctly,
//  implement the pending matches for users, and also the rejection, 
// and actual matching to maybe try and make the chat log.

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
        name,
        pic: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg'
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
    const userId = req.user.userId; // User ID from JWT
    console.log("User ID from JWT:", userId);

    if (!userId) {
      return res.status(400).json({ error: 'User ID is missing' });
    }

    const user = await User.findOne({ where: { id: userId },
      attributes: [
        'id',
        'name',
        'email',
        'age',
        'pic',
        'gender',
        'bio',
        'minAgeP',
        'maxAgeP',
        'genderPref'
      ]
    });


    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    console.log("User pic from database:", user);
    return res.status(200).json({
      id: user.id,
      name: user.name,
      email: user.email,
      age: user.age,
      pic: user.get('pic'),
      gender: user.gender,
      bio: user.bio,
      minAgeP: user.minAgeP,
      maxAgeP: user.maxAgeP,
      genderPref: user.genderPref,
    });
  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};



const getUsertoMatch = async (req, res) => {
  try {
    const userId = req.user.userId;   
    console.log("User ID from JWT:", userId); 

    if (!userId) {
      return res.status(400).json({ error: 'User ID is missing' });
    }
    const user = await User.findOne({ where: { id: userId }});

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { minAgeP, maxAgeP, genderPref } = user;

    if (minAgeP == null || maxAgeP == null || !genderPref) {
      return res.status(400).json({ error: 'User preferences are missing or incomplete.' });
    }

    const potentialMatches = await User.findAll({
      where: {
        id: {
          [Op.ne]: userId,
        },
        age: {
          [Op.between]: [user.minAgeP, user.maxAgeP],
        },
        [Op.or]: [
          { gender: genderPref },
          { gender: 'Any' }
        ],
        minAgeP: {
          [Op.lte]: user.age,
        },
        maxAgeP: {
          [Op.gte]: user.age,
        },
        [Op.or]: [
          { genderPref: user.gender },
          { genderPref: 'Any' }
        ]
      },
      attributes: [
        'id',
        'name',
        'email',
        'age',
        'pic',
        'gender',
        'bio',
      ]
    });
    
    
    console.log("Potential Matches:", potentialMatches);

    const formattedMatches = potentialMatches.map(match => ({
      id: match.id,
      name: match.name,
      email: match.email,
      age: match.age,
      pic: match.get('pic'),
      gender: match.gender,
      bio: match.bio,
    }));
    console.log("req.user:", req.user); // should show { userId: ... }
    console.log(formattedMatches[0]?.pic);

    console.log("Formatted Matches: !!!!!!!!!", formattedMatches);

    return res.status(200).json({
      matches: formattedMatches,
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
    const {name, gender, bio, age, minAgeP, maxAgeP, genderPref}  = req.body
    console.log(req.body)
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
      if (minAgeP) user.minAgeP = minAgeP;
      if (maxAgeP) user.maxAgeP = maxAgeP;
      if (genderPref) user.genderPref = genderPref;
      console.log(name, gender, bio, age, minAgeP, maxAgeP, genderPref)

      await user.save();
      return res.status(200).json({ message: 'Profile updated', user: user.toJSON() });

      
    } catch (err) {
      console.error("Server error:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

const RejectionMatch = async (req, res) => {
// I need to add getting req from frontend and then sending the result tro db

  const { userId } = req.body;
  const currentUserId = req.user.userId;
  console.log("Current User ID (REJECT PART):", currentUserId);
  console.log("User ID to reject:", userId);







}



const AcceptMatch = async (req, res) => {
  
  const { userId: receiverId } = req.body;
  const senderId = req.user.userId; 

  console.log("REQ BODY THING (2nd ONE IS userid): ", req.body, req.user.userId)

  console.log(senderId, receiverId)

  try {

    const existingRequest = await PendingUser.findOne({
      where: {
        senderId,
        receiverId,
        status: 'pending',
      },
    });

    if (existingRequest) {
      return res.status(400).json({ message: 'Match request already sent!' });
    }

    const newRequest = await PendingUser.create({
      senderId,
      receiverId,
      status: 'pending',
    });

    return res.status(200).json({
      message: 'Match request sent successfully!',
      matchRequestId: newRequest.id,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error sending match request' });
  }
};




const pendingrequest = async (req, res) => {
  const { userId } = req.body;
  const currentUserId = req.user.userId;
  console.log("Current User ID (ACCEPT PART):", currentUserId);
  console.log("Accepted user with the Id:", userId);
}



module.exports = { createUser, loginUser,
   sendCaptcha, getUser,
    authenticateToken, changeData, getUsertoMatch, RejectionMatch, AcceptMatch }