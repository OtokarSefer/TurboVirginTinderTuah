// authRoutes.js
const express = require('express');
const { createUser, loginUser } = require('../dealingwithusers/dealusers'); // Import both functions
const router = express.Router();

// POST /api/signup - Signup route
router.post('/signup', createUser);

// POST /api/login - Login route
router.post('/login', loginUser);


// Some other routes in the future:

module.exports = router;