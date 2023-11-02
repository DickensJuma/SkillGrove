const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
const User = require('../models/User');
const bcrypt = require('bcrypt');

// User registration
exports.registerUser = (req, res) => {
  console.log("req", req);
  const { username, email, password , profile} = req.body;
  if(!profile){

  // Check if the username or email is already in use
  User.findOne({ $or: [{ username }, { email }] })
    .then((existingUser) => {
      if (existingUser) {
        return res.status(400).json({ success: false, message: 'Username or email already in use' });
      }

      // Create a new user
      bcrypt.hash(password, 10, (hashError, hashedPassword) => {
        if (hashError) {
          return res.status(500).json({ success: false, message: 'Password hashing failed' });
        }

        const newUser = new User({ username, email, password: hashedPassword });
        newUser
          .save()
          .then((user) => {
            // Generate a JWT token for the registered user
            const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '24h' });
            res.json({ success: true, message: 'User registered', token });
          })
          .catch((error) => {
            res.status(400).json({ success: false, message: 'Registration failed', error: error.message });
          });
      });
    })
    .catch((error) => {
      res.status(500).json({ success: false, message: 'User check failed', error: error.message });
    });
  }
  // create google user
  return res.json({ success: true, message: 'User registered', profile });


};

// User login
exports.loginUser = (req, res) => {
  const { username, password } = req.body;

  // Find the user by username
  User.findOne({ username })
    .then((user) => {
      if (!user) {
        return res.status(401).json({ success: false, message: 'Authentication failed. User not found.' });
      }

      // Check the password
      bcrypt.compare(password, user.password, (compareError, isMatch) => {
        if (compareError) {
          return res.status(500).json({ success: false, message: 'Authentication failed', error: compareError.message });
        }

        if (!isMatch) {
          return res.status(401).json({ success: false, message: 'Authentication failed. Wrong password.' });
        }

        // Generate a JWT token for the authenticated user
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '24h' });
        res.json({ success: true, message: 'Authentication successful', token });
      });
    })
    .catch((error) => {
      res.status(500).json({ success: false, message: 'Authentication failed', error: error.message });
    });
};


// Get all users
exports.getAllUsers = (req, res) => {
  User.find()
    .then((users) => {
      res.json({ success: true, users });
    })
    .catch((error) => {
      res.status(500).json({ success: false, message: 'Error fetching users', error: error.message });
    });
};

// Get a user by ID
exports.getUserById = (req, res) => {
  const userId = req.params.id;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        res.status(404).json({ success: false, message: 'User not found' });
      } else {
        res.json({ success: true, user });
      }
    })
    .catch((error) => {
      res.status(500).json({ success: false, message: 'Error fetching user', error: error.message });
    });
};

// Create a new user

exports.createUser = (req, res) => {
 
  const { username, email, password, firstName, lastName } = req.body;

  // Check if the username or email is already in use
  User.findOne({ $or: [{ username }, { email }] })
    .then((existingUser) => {
      if (existingUser) {
        return res.status(400).json({ success: false, message: 'Username or email already in use' });
      }

      // Create a new user if not already in use
      bcrypt.hash(password, 10, (hashError, hashedPassword) => {
        if (hashError) {
          return res.status(500).json({ success: false, message: 'Password hashing failed' });
        }

        const newUser = new User({
          username,
          email,
          password: hashedPassword,
          firstName,
          lastName,
        });

        newUser
          .save()
          .then((user) => {
            // Generate a JWT token for the registered user
            const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '24h' });
            res.json({ success: true, message: 'User registered', token });
          })
          .catch((error) => {
            res.status(400).json({ success: false, message: 'Registration failed', error: error.message });
          });
      });
    })
    .catch((error) => {
      res.status(500).json({ success: false, message: 'User check failed', error: error.message });
    });
};

// Update a user by ID
exports.updateUser = (req, res) => {
  const userId = req.params.id;
  const updatedUserData = req.body;

  User.findByIdAndUpdate(userId, updatedUserData, { new: true })
    .then((user) => {
      if (!user) {
        res.status(404).json({ success: false, message: 'User not found' });
      } else {
        res.json({ success: true, message: 'User updated', user });
      }
    })
    .catch((error) => {
      res.status(500).json({ success: false, message: 'Error updating user', error: error.message });
    });
};

// Delete a user by ID
exports.deleteUser = (req, res) => {
  const userId = req.params.id;

  User.findByIdAndRemove(userId)
    .then((user) => {
      if (!user) {
        res.status(404).json({ success: false, message: 'User not found' });
      } else {
        res.json({ success: true, message: 'User deleted' });
      }
    })
    .catch((error) => {
      res.status(500).json({ success: false, message: 'Error deleting user', error: error.message });
    });
};

