const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  phoneNumber: {
    type: String,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6, // Adjust as needed
  },
  firstName: {
    type: String,
    trim: true,
  },
  lastName: {
    type: String,
    trim: true,
  },
  title: {
    type: String,
    trim: true,
  },
  slug: {
    type: String,
    trim: true,
  },
  linkedinUrl: {
    type: String,
    trim: true,
  },
  facebookUrl: {
    type: String,
    trim: true,
  },
  pinterestUrl: {
    type: String,
    trim: true,
  },
  instagramUrl: {
    type: String,
    trim: true,
  },
  twitterHandle: {
    type: String,
    trim: true,
  },
  bio: {
    type: String,
    trim: true,
  },

  dateOfBirth: {
    type: Date,
  },
  profilePicture: {
    type: String, 
  },
  role: {
    type: String,
    enum: ['student', 'admin'], 
    default: 'student',
  },
  members:{
    type: Array,
    default: [],
  },
  coursesEnrolled: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
    },
  ],
  recentCourses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
    },
  ],
  isBlocked: {
    type: Boolean,
    default: false,
  },
  blockedReason: {
    type: String,

  }
  // Add more fields for user preferences, settings, etc.
});

// Use the uniqueValidator plugin for unique field validation
userSchema.plugin(uniqueValidator, { message: 'This {PATH} is already taken.' });

// Hash the password before saving it to the database
// userSchema.pre('save', async function (next) {
//   if (!this.isModified('password')) return next();

//   try {
//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt);
//     next();
//   } catch (error) {
//     next(error);
//   }
// });

// // Method to validate user's password
// userSchema.methods.isValidPassword = async function (password) {
//   try {
//     return await bcrypt.compare(password, this.password);
//   } catch (error) {
//     throw error;
//   }
// };

const User = mongoose.model('User', userSchema);

module.exports = User;

