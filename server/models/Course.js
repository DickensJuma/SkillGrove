const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  about: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true,
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Instructor",
    required: true,
  },
  lessons: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lesson",
    },
  ],
  categories: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
  ],
  content: [
    {
      title:  { type: String },// Title of the content within the course
      url:  { type: String }, // URL or reference to the content (e.g., video URL)
      type:  { type: String }, // Type of content (e.g., "video", "document", "audio")
    },
  ],
  duration: {
    type: String,
  },
  price: {
    type: String,
  },
  isPaid: {
    type: Boolean,
    required: true
  },
  status: {
    type: String,
    enum: ["published", "draft"],
    default: "draft",
  },
  published: {
    type: Date,
  },
  summary: {
    type: String,
  },
  slug: {
    type: String,
  },
  featuredImage: {
    type: String,
  },
  featuredImageAlt: {
    type: String,
  },
  url: {
    type: String,
  },
  tags: [
    {
      type: String,
    },
  ],
  level: {
    type: String,
    required: true
  },
  body: {
    type: String,
  },
  students: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  completionStatus: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  isVerified: {
    type: Boolean,
    default: false
  },

},

);

const Course = mongoose.model("Course", courseSchema);

module.exports = Course;


//example of course object
// {
//   "title": "Learn HTML",
//   "description": "Learn the basics of HTML",
//   "lessons": [],
//   "categories": [
//     "65478e46db5150049e45286f",
// ],
//   "content": [
//     {  
//       "title": "Introduction to HTML",
//       "url": "https://www.youtube.com/watch?v=UB1O30fR-EE",
//       "type": "video"
//     }
//   ],
//   "duration": "1 hour",
//   "price": "0",
//   "status": "published",
//   "published": "2020-10-31T00:00:00.000Z",
//   "summary": "Learn the basics of HTML",
//   "slug": "learn-html",
//   "featuredImage": "https://res.cloudinary.com/dg3gyk0gu/image/upload/v1604112847/learn-html.jpg",
//   "featuredImageAlt": "Learn HTML",
//   "url": "https://www.youtube.com/watch?v=UB1O30fR-EE",
//   "tags": [
//     "HTML",
//     "Web Development"
//   ],
//   "body": "Learn the basics of HTML"
// }
