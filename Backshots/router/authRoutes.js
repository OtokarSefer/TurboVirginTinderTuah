const express = require('express');
const rateLimit = require('express-rate-limit');
const { createUser, loginUser, sendCaptcha, getUser, authenticateToken, changeData, getUsertoMatch, RejectionMatch, AcceptMatch, Matching, getMatches } = require('../dealingwithusers/dealusers'); 
const router = express.Router();

//  Stop login spam 
const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute window
    max: 8, // Limit each IP to 10 requests per windowMs
    message: 'Too many requests, please try again later',
  });

// POST /api/signup - Signup route
router.post('/signup', limiter, createUser);

// POST /api/login - Login route
router.post('/login', limiter, loginUser);

// CAPTCHA ROUTE
router.post('/captcha', limiter, sendCaptcha)

// Getting the user /getuser
router.get('/getUser', authenticateToken,  getUser)

// Some other routes in the future: 


// changeData one
router.patch('/Changeuser', authenticateToken, changeData)

// Matches router
router.get('/getMatches', authenticateToken, getUsertoMatch)

// Matching parts
router.post('/Accept', authenticateToken, AcceptMatch)

// Actual Match finalize route
router.patch('/Match', authenticateToken, Matching)


// MutualMatches route for the chatting
router.get('/MutualMatches', authenticateToken, getMatches)

module.exports = router;