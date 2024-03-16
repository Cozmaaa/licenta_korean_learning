const User = require('../models/userModel');

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
