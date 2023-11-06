const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const logger = require('../logger');
const Instructor = require('../models/Instructor');



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
      logger.error('error', 'Error fetching user: ', error);
      res.status(500).json({ success: false, message: 'Error fetching user', error: error.message });
    });
};

// Create a new user

exports.createUser = (req, res) => {
 
  const { username, email, password, firstName, lastName, role } = req.body;

  if(role === 'instructor'){
    let { qualification, subjects, experience, skills } = req.body;
    if(!qualification || !experience || !skills){
      return res.status(400).json({ success: false, message: 'Please fill all fields' });
    }
// Check if the username or email is already in use
               let excistingInstructor = Instructor.findOne({ $or: [{ username }, { email }] })
                if(excistingInstructor){
                  return res.status(400).json({ success: false, message: 'Username or email already in use' });
                }
                  // Create a new user if not already in use
              bcrypt.hash(password, 10, (hashError, hashedPassword) => {
              if (hashError) {
                return res.status(500).json({ success: false, message: 'Password hashing failed' });
              }

                const newInstructor = new Instructor({
                  username,
                  firstName,
                  lastName,
                  password: hashedPassword,
                  email,
                  qualification,
                  subjects,
                  experience,
                  skills,
                });
                newInstructor
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
  }

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
      logger.error('error', 'Error creating user: ', error);
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
      logger.error('error', 'Error updating user: ', error);
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
      logger.error('error', 'Error deleting user: ', error);
      res.status(500).json({ success: false, message: 'Error deleting user', error: error.message });
    });
};

// get all instructors
exports.getAllInstructors = (req, res) => {
  User.find({ role: 'instructor' })
    .then((users) => {
      res.json({ success: true, users });
    })
    .catch((error) => {
      logger.error('error', 'Error fetching instructors: ', error);
      res.status(500).json({ success: false, message: 'Error fetching instructors', error: error.message });
    });
};

// get all students
exports.getAllStudents = (req, res) => {
  User.find({ role: 'student' })
    .then((users) => {
      res.json({ success: true, users });
    })
    .catch((error) => {
      logger.error('error', 'Error fetching students: ', error);
      res.status(500).json({ success: false, message: 'Error fetching students', error: error.message });
    });
};
