const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Route for user registration
router.post('/register', userController.registerUser);
router.post('/login',userController.loginUser)

module.exports = router;
