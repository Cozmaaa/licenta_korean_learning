const express = require("express");
const router = express.Router();
const Session = require("../models/sessionModel");

// Logout endpoint
exports.logout = async (req, res) => {
  try {
    // Assuming the session token is sent in a cookie named 'session_token'
    const sessionToken = req.cookies.session_token;

    if (!sessionToken) {
      return res.status(400).send("No session token provided");
    }

    // Find and remove the session from the database
    const result = await Session.deleteOne({ sessionToken });

    if (result.deletedCount === 0) {
      // No session was found with the provided token
      return res.status(404).send("Session not found");
    }

    // Clear the session cookie
    res.clearCookie("session_token", {
      httpOnly: true,
      secure: false,
    });

    res.send("Logged out successfully");
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).send("Error logging out");
  }
};

// Function to check if the cookie exists in the database
exports.checkSession = async (req, res) => {
  try {
    // Assuming the session token is sent in a cookie named 'session_token'
    const sessionToken = req.cookies.session_token;

    if (!sessionToken) {
      return res.status(400).send("No session token provided");
    }

    // Find the session in the database
    const session = await Session.findOne({ sessionToken });

    if (!session) {
      // No session was found with the provided token
      return res.status(404).send("Session not found");
    }

    res.status(200).send("Session exists");
  } catch (error) {
    console.error("Check session error:", error);
    res.status(500).send("Error checking session");
  }
};

exports.getUserIdFromCookie = async (req, res) => {
  try {
    const session_token = req.cookies.session_token;

    if (!session_token) {
      return res.status(400).send("No session token provided");
    }

    const session = await Session.findOne({ sessionToken: session_token });

    if (!session) {
      return res.status(404).send("Session not found");
    }

    res.status(200).send(session.userId);
  } catch (error) {
    console.log(error);
  }
};
