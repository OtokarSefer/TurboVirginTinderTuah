const express = require('express');
const { createUser, loginUser, sendCaptcha } = require('../dealingwithusers/dealusers'); // Import both functions
const router = express.Router();

// POST /api/signup - Signup route
router.post('/signup', createUser);

// POST /api/login - Login route
router.post('/login', loginUser);

// CAPTCHA ROUTE
router.post('/captcha', sendCaptcha)

// Some other routes in the future: 

module.exports = router;