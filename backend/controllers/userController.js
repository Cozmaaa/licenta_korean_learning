const User = require('../models/userModel');
const bcrypt = require('bcryptjs'); 

// Controller function for registering a new user
exports.registerUser = async (req, res) => {
    try {
        const { username, email, password, userType } = req.body;
        
        const newUser = new User({
            username,
            email,
            password,
            userType // This can be 'normal' or 'admin'. If not provided, defaults to 'normal'
        });

        await newUser.save(); // Save the new user to the database
        res.status(201).send('User created successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error creating the user');
    }
};


exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body; // Assuming users login with email and password

        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).send('User not found');
        }

        // Verify the password
        const isMatch = password==user.password
        if (!isMatch) {
            return res.status(401).send('Invalid credentials');
        }
        


        //TODO: Auth Cookie
        console.log("Logged in succesfully");
        res.status(200).send('Logged in successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error logging in the user');
    }
};