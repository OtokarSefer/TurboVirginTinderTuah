const express = require('express');
const { createUser, loginUser, sendCaptcha, getUser, authenticateToken, changeData, getUsertoMatch } = require('../dealingwithusers/dealusers'); 
const router = express.Router();

// POST /api/signup - Signup route
router.post('/signup', createUser);

// POST /api/login - Login route
router.post('/login', loginUser);

// CAPTCHA ROUTE
router.post('/captcha', sendCaptcha)

// Getting the user /getuser
router.get('/getUser', authenticateToken,  getUser)

// Some other routes in the future: 

router.patch('/Changeuser', authenticateToken, changeData)

router.get('/getMatches', authenticateToken, getUsertoMatch)

module.exports = router;