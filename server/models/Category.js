const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    slug: [{
      type: String,
    }],
    icon: {
      type: String,
    },
    description: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

let Category = mongoose.model("Category", categorySchema);
module.exports = Category;

//example of category object
// {
//   "name": "Web Development",
//   "slug": "web-development",
//   "icon": "fas fa-laptop-code",
//   "description": "Learn how to build websites and web applications for the internet."
//}