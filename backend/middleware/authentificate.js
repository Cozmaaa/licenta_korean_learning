// middleware/authenticate.js
const Session = require("../models/sessionModel");
const User = require("../models/userModel");

const authenticate = async (req, res, next) => {
  try {
    const { session_token } = req.cookies;
    console.log(session_token);

    if (!session_token) {
      return res.status(401).json({ message: "No session token" });
    }

    // Find the session
    const session = await Session.findOne({
      sessionToken: session_token,
    }).populate("userId");
    if (!session || new Date() > session.expiresAt) {
      return res
        .status(401)
        .json({ message: "Invalid or expired session token" });
    }

    // Attach user to request object
    req.user = session.userId;
    next();
  } catch (error) {
    res.status(500).json({ message: "Authentication failed" });
  }
};

module.exports = authenticate;
