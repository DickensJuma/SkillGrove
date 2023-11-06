const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const uniqueValidator = require("mongoose-unique-validator");

const instructorSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
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
    qualification: {
      type: String,
      required: true,
    },
    subjects: [
      {
        type: String,
        required: true,
      },
    ],
    experience: {
      type: String,
      required: true,
    },
    skills: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    coursesCreated: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Courses",
      },
    ],
    rejected: { type: Boolean, default: false },
    rejectedReason: { type: String, default: "" },
    isBlocked: { type: Boolean, default: false },
    blockedReason: { type: String, default: "" },

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
    profilePicture: {
      type: String,
    },
    role: {
      type: String,
      enum: ["instructor"],
      default: "instructor",
    },
  },
  {
    timestamps: true,
  }
);

let Instructor = mongoose.model("Instructor", instructorSchema);
module.exports = Instructor;
