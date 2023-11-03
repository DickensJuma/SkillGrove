const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  instructor: {
    type:  mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  content: {
    type: Array,
    default: [],
  },

  duration: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
});

const Course = mongoose.model("Course", courseSchema);

module.exports = Course;
