const express = require('express');
const { createUser, loginUser, sendCaptcha, getUser } = require('../dealingwithusers/dealusers'); // Import both functions
const router = express.Router();

// POST /api/signup - Signup route
router.post('/signup', createUser);

// POST /api/login - Login route
router.post('/login', loginUser);

// CAPTCHA ROUTE
router.post('/captcha', sendCaptcha)

// Getting the user /getuser
router.get('/getUser', getUser)

// Some other routes in the future: 

module.exports = router;