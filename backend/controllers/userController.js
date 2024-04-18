const User = require("../models/userModel");
const uuid = require("uuid");
const Session = require("../models/sessionModel");
const cookieParser = require("cookie-parser");

// Controller function for registering a new user
exports.registerUser = async (req, res) => {
  try {
    const { username, email, password, userType } = req.body;

    const newUser = new User({
      username,
      email,
      password,
      userType, // This can be 'normal' or 'admin'. If not provided, defaults to 'normal'
    });

    await newUser.save(); // Save the new user to the database
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error creating the user");
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body; // Assuming users login with email and password

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send("User not found");
    }

    // Verify the password
    const isMatch = password == user.password;
    if (!isMatch) {
      return res.status(401).send("Invalid credentials");
    }

    // Generate a unique session token using UUID
    const sessionToken = uuid.v4();

    // Set an expiration date for the session (e.g., 1 year from now)
    const expiresAt = new Date().getTime() + 365 * 24 * 60 * 60 * 1000; // 1 year in milliseconds

    // Create and store the session in MongoDB
    const session = new Session({
      sessionToken,
      userId: user._id,
      expiresAt: new Date(expiresAt),
    });
    await session.save();

    // Send the session token to the client as a cookie
    res.cookie("session_token", sessionToken, {
      maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year
      httpOnly: true,
      secure: true,
    });

    res.status(200).json({ message: "Logged in successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error logging in the user");
  }
};

exports.getUserInfo = async (req, res) => {
  try {
    const { username } = req.body;

    // Find the user by username
    const user = await User.findOne(
      { username },
      "username userType knowsHangeul -_id"
    );
    // The second argument to findOne is a projection. This specifies which fields to include or exclude in the returned document.
    // In this case, we're including the username and userType fields, and excluding the _id field.
    // The password and email fields are not included in the projection, so they will not be returned.

    if (!user) {
      return res.status(404).send("User not found");
    }

    console.log(user);
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error getting user information");
  }
};

exports.setKnowsHangeul = async (req, res) => {
  try {
    const { username, knowsHangeul } = req.body;

    // Find the user by username
    const user = await User.findOneAndUpdate(
      { username },
      { knowsHangeul },
      { new: true }
    );

    if (!user) {
      return res.status(404).send("User not found");
    }
  } catch (error) {
    console.error(error);
  }
};

exports.setLastHangeulLetter = async (req, res) => {
  const { userId, lastLetter } = req.body;

  try {
    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update the lastHangeulLetter field
    user.lastHangeulLetter = lastLetter;
    await user.save();

    return res
      .status(200)
      .json({ message: "Last Hangeul letter updated successfully" });
  } catch (error) {
    console.error("Error setting last Hangeul letter:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.getLastHangeulLetter = async (req, res) => {
  const { userId } = req.body;

  try {
    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Get the lastHangeulLetter field from the user document
    const lastHangeulLetter = user.lastHangeulLetter;

    return res.status(200).json({ lastHangeulLetter });
  } catch (error) {
    console.error("Error getting last Hangeul letter:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.addWordToSavedWords = async (req, res) => {
  try {
    const { userId, wordId } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isWordSaved = user.savedWords.includes(wordId);
    if (isWordSaved) {
      return res
        .status(400)
        .json({ error: "The word is already in the user's saved words list" });
    }

    user.savedWords.push(wordId);

    const updatedUser = await user.save();

    await updatedUser.populate("savedWords");

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error adding word to saved words:", error);
    res.status(500).json({
      error: "An error occurred while adding the word to saved words",
    });
  }
};

exports.getSavedWords = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log(userId);

    const user = await User.findById(userId).populate("savedWords");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user.savedWords);
  } catch (error) {
    console.error("Error retrieving saved words:", error);
    res
      .status(500)
      .json({ error: "An error occurred while retrieving saved words" });
  }
};
