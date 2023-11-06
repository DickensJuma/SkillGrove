const mongoose = require("mongoose");

const lessonSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: Array,
      default: [],
    },
    position: {
      type: Number,
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
    content: [
      {
        title: { type: String }, // Title of the content within the lesson
        url:{ type: String }, // URL or reference to the content (e.g., video URL)
        type: { type: String }, // Type of content (e.g., "video", "document", "audio")
      },
    ],
    
  },
  {
    timestamps: true,
  }
);

let Lesson =mongoose.model("Lesson", lessonSchema);
module.exports = Lesson;

//example of lesson object
// {
//   "title": "Introduction to HTML",
//   "content": [
//     {
//       "title": "Introduction to HTML",
//       "url": "https://www.youtube.com/watch?v=UB1O30fR-EE",
//       "type": "video"
//     },
//     {
//       "title": "What is HTML?",
//       "url": "https://www.youtube.com/watch?v=9gTw2EDkaDQ",
//       "type": "video"
//     },
//     {
//       "title": "HTML Basics",
//       "url": "https://www.youtube.com/watch?v=UB1O30fR-EE",
//       "type": "video"
//     }
//   ],
//   "position": 1
// }
// Compare this snippet from server/models/User.js:
