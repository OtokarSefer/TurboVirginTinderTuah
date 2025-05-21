require("dotenv").config();
const bcrypt = require('bcryptjs');
const con = require('../db/db');
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const { User, Match } = require('../../models');
const { Op } = require('sequelize')



// What more to do? Fix changedata, Get fetching users working correctly,
//  implement the pending matches for users, and also the rejection,
// and actual matching to maybe try and make the chat log.

const captchas = {}
// Temporarily disable captcha for more accounts
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

  const captcha = 1;
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

// const sendCaptcha = async (req, res) => {
//   const { email } = req.body;

//   if (!email) return res.status(400).json({ error: "Email is required" });

//   const captcha = Math.floor(100000 + Math.random() * 900000);
//   captchas[email] = captcha;

//   const transporter = nodemailer.createTransport({
//     host: "smtp.gmail.com",
//     port: 465,
//     auth: {
//       user: process.env.GNAME,
//       pass: process.env.GPASS,
//     },
//   });

//   const mailOptions = {
//     from: process.env.GNAME,
//     to: email,
//     subject: "Your CAPTCHA Code",
//     text: `Your verification code is: ${captcha}`,
//   };

//   try {
//     await transporter.sendMail(mailOptions);
//     res.json({ message: "Captcha sent successfully!" });
//   } catch (error) {
//     console.error("Email error:", error);
//     res.status(500).json({ error: "Failed to send captcha email." });
//   }
// }



const getUser = async (req, res) => {
  try {
    const userId = req.user.userId; // From JWT
    if (!userId) {
      return res.status(400).json({ error: 'User ID is missing' });
    }

    const user = await User.findOne({
      where: { id: userId },
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
      ],
      include: [
        {
          model: User,
          as: 'MatchedByUsers', // Getting all of the matches, that are associated with given user
          attributes: ['id', 'name', 'age', 'bio', 'pic', 'gender']
        }
      ]
    });

    console.log(user)

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json({
      id: user.id,
      name: user.name,
      email: user.email,
      age: user.age,
      pic: user.pic,
      gender: user.gender,
      bio: user.bio,
      minAgeP: user.minAgeP,
      maxAgeP: user.maxAgeP,
      genderPref: user.genderPref,
      matches: user.MatchedByUsers // full matched user profiles
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
    const {name, gender, bio, age, minAgeP, maxAgeP, genderPref, pic}  = req.body
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
      if (pic) user.pic = pic;
      if (minAgeP) user.minAgeP = minAgeP;
      if (maxAgeP) user.maxAgeP = maxAgeP;
      if (genderPref) user.genderPref = genderPref;
      console.log(name, gender, bio, age, minAgeP, maxAgeP, genderPref, pic)

      await user.save();
      return res.status(200).json({ message: 'Profile updated', user: user.toJSON() });


    } catch (err) {
      console.error("Server error:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
  }


const AcceptMatch = async (req, res) => {
  const { userId: receiverId } = req.body;
  const senderId = req.user.userId;

  try {
    const existingRequest = await Match.findOne({
      where: {
        userId1: senderId,
        userId2: receiverId,
        status: 'pending',
      },
    });

    if (existingRequest) {
      return res.status(400).json({ message: 'Match request already sent!' });
    }

    const newRequest = await Match.create({
      userId1: senderId,
      userId2: receiverId,
      status: 'pending',
    });

    return res.status(200).json({
      message: 'Match request sent successfully!',
      matchRequestId: newRequest.id,
    });
  } catch (error) {
    console.error("Error creating match:", error);
    return res.status(500).json({ message: 'Error sending match request' });
  }
};


const Matching = async (req, res) => {
  const { userId: matched } = req.body;
  const accepterId = req.user.userId;

  console.log("Accepter ID:", accepterId);
  console.log("Match sender ID:", matched);

  try {
    const cmatch = await Match.findOne({
      where: { userId1: matched, userId2: accepterId },
      attributes: ['id', 'status'] 
    });

    if (!cmatch) {
      return res.status(404).json('Match not found');
    }

    console.log("This is the current match id!!!", cmatch.id);
    console.log("This is the current match status!!!", cmatch.status); 
    console.log("This is the current match status!!!", cmatch.userId1); 
    console.log("This is the current match status!!!", cmatch.userId2); 
    console.log("This is the current match status!!!", cmatch.createdAt);
    console.log("This is the current match status!!!", cmatch.updatedAt);  
    



    await Match.update(
      { status: 'accepted'}, 
      { where: {userId1: matched, userId2: accepterId}}
    )

    console.log("Match status updated to 'accepted'!");

    return res.status(200).json({ status: 'accepted' });

  } catch (err) {
    console.error('Error fetching match:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const Reject = async (req, res) => {
  const { userId: matched } = req.body;
  const accepterId = req.user.userId;

  console.log("Accepter ID:", accepterId);
  console.log("Matched User ID:", matched);

  try {
    const cmatch = await Match.findOne({
      where: { userId1: matched, userId2: accepterId },
      attributes: ['id', 'status'] 
    });

    if (!cmatch) {
      return res.status(404).json('Match not found');
    }

    console.log("This is the current match id!!!", cmatch.id);
    console.log("This is the current match status!!!", cmatch.status); 
    console.log("This is the current match status!!!", cmatch.userId1); 
    console.log("This is the current match status!!!", cmatch.userId2); 
    console.log("This is the current match status!!!", cmatch.createdAt);
    console.log("This is the current match status!!!", cmatch.updatedAt);  
    



    await Match.update(
      { status: 'rejected'}, 
      { where: {userId1: matched, userId2: accepterId}}
    )

    console.log("Match status updated to 'accepted'!");

    return res.status(200).json({ status: 'accepted' });

  } catch (err) {
    console.error('Error fetching match:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};


const getMatches = async (req, res) => {
    try {
    const userId = req.user.userId; // From JWT

    if (!userId) {
      return res.status(400).json({ error: 'User ID is missing' });
    }

    const user = await User.findOne({
      where: { id: userId },
      include: [
        {
          model: User,
          as: 'MatchedByUsers', 
          attributes: ['id', 'name', 'age', 'bio', 'pic', 'gender'],
          through: {
            model: Match, 
            where: { status: 'accepted' }, 
            attributes: [] 
          }
        }
      ]
    });


    console.log(user)

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json({
      id: user.id,
      name: user.name,
      email: user.email,
      age: user.age,
      pic: user.pic,
      gender: user.gender,
      bio: user.bio,
      minAgeP: user.minAgeP,
      maxAgeP: user.maxAgeP,
      genderPref: user.genderPref,
      matches: user.MatchedByUsers // full matched user profiles
    });
  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};







module.exports = { createUser, loginUser,
   sendCaptcha, getUser,
    authenticateToken, changeData, getUsertoMatch, AcceptMatch, Matching, getMatches }


    //  User management, User Auth, Loo need kontrollerid, et testimine oleks kergem!