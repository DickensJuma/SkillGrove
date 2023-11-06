const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const logger = require('../logger');

// User registration
exports.registerUser = (req, res) => {
 
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
        logger.error('error', 'Error registering user: ', error);
        res.status(500).json({ success: false, message: 'User check failed', error: error.message });
      });
    }
    // create google user
    return res.json({ success: true, message: 'User registered', profile });
  
  
  };
  
  // User login
  exports.loginUser = (req, res) => {
    const { email, password } = req.body;
  
    // Find the user by username
    User.findOne({ email })
      .then((user) => {
        if (!user) {
          logger.error('error', 'Error authenticating user: ', 'User not found');
          return res.status(401).json({ success: false, message: 'Authentication failed. User not found.' });
        }
  
        // Check the password
        bcrypt.compare(password, user.password, (compareError, isMatch) => {
          if (compareError) {
            logger.error('error', 'Error authenticating user: ', compareError);
            return res.status(500).json({ success: false, message: 'Authentication failed', error: compareError.message });
          }
  
          if (!isMatch) {
            logger.error('error', 'Error authenticating user: ', 'Wrong password');
            return res.status(401).json({ success: false, message: 'Authentication failed. Wrong password.' });
          }
  
          // Generate a JWT token for the authenticated user
          const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '24h' });
          res.json({ success: true, message: 'Authentication successful', token });
        });
      })
      .catch((error) => {
        logger.error('error', 'Error authenticating user: ', error);
        res.status(500).json({ success: false, message: 'Authentication failed', error: error.message });
      });
  };
  