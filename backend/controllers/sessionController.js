const express = require('express');
const router = express.Router();
const Session = require('../models/sessionModel'); 

// Logout endpoint
exports.logout = async (req, res) => {
  try {
    // Assuming the session token is sent in a cookie named 'session_token'
    const sessionToken = req.cookies.session_token;

    if (!sessionToken) {
      return res.status(400).send('No session token provided');
    }

    // Find and remove the session from the database
    const result = await Session.deleteOne({ sessionToken });

    if (result.deletedCount === 0) {
      // No session was found with the provided token
      return res.status(404).send('Session not found');
    }

    // Clear the session cookie
    res.clearCookie('session_token', { 
      httpOnly: true, 
      secure: false
    });

    res.send('Logged out successfully');
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).send('Error logging out');
  }
};


