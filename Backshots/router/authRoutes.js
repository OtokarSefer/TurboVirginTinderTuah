const express = require('express');
const rateLimit = require('express-rate-limit');
const { createUser, loginUser, sendCaptcha, getUser, authenticateToken, changeData, getUsertoMatch, RejectionMatch, AcceptMatch } = require('../dealingwithusers/dealusers'); 
const router = express.Router();

//  Stop login spam 
const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute window
    max: 10, // Limit each IP to 10 requests per windowMs
    message: 'Too many requests, please try again later',
  });

// POST /api/signup - Signup route
router.post('/signup', limiter, createUser);

// POST /api/login - Login route
router.post('/login', limiter, loginUser);

// CAPTCHA ROUTE
router.post('/captcha', sendCaptcha)

// Getting the user /getuser
router.get('/getUser', authenticateToken,  getUser)

// Some other routes in the future: 


// changeData one
router.patch('/Changeuser', authenticateToken, changeData)

// Matches router
router.get('/getMatches', authenticateToken, getUsertoMatch)

// Matching parts
router.post('/Reject', authenticateToken, RejectionMatch)

router.post('/Accept', authenticateToken, AcceptMatch)

module.exports = router;