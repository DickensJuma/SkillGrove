const Course = require('../models/Course');



// Get a paginated list of courses with filtering and sorting
exports.getAllCourses = (req, res) => {
    const { title, instructor, sortBy, page, perPage } = req.query;
    const filter = {};
  
    if (title) {
      filter.title = { $regex: title, $options: 'i' }; // Case-insensitive title search
    }
  
    if (instructor) {
      filter.instructor = { $regex: instructor, $options: 'i' }; // Case-insensitive instructor search
    }
  
    const sortOptions = {};
  
    if (sortBy) {
      if (sortBy === 'title') {
        sortOptions.title = 1; // Sort by title in ascending order
      } else if (sortBy === '-title') {
        sortOptions.title = -1; // Sort by title in descending order
      } // Add more sorting options as needed
    }
  
    const currentPage = parseInt(page) || 1;
    const itemsPerPage = parseInt(perPage) || 10; // Adjust as needed
  
    Course.find(filter)
      .sort(sortOptions)
      .skip((currentPage - 1) * itemsPerPage)
      .limit(itemsPerPage)
      .then((courses) => {
        res.json({ success: true, courses });
      })
      .catch((error) => {
        res.status(500).json({ success: false, message: 'Error fetching courses', error: error.message });
      });
  };
  



// Create a new course
exports.createCourse = (req, res) => {
  const { title, description, instructor, content } = req.body;

  const newCourse = new Course({
    title,
    description,
    instructor,
    content,
  });

  newCourse
    .save()
    .then((course) => {
      res.json({ success: true, message: 'Course created', course });
    })
    .catch((error) => {
      res.status(400).json({ success: false, message: 'Course creation failed', error: error.message });
    });
};


// Get a single course by ID
exports.getCourseById = (req, res) => {
    const courseId = req.params.id;
  
    Course.findById(courseId)
      .then((course) => {
        if (!course) {
          res.status(404).json({ success: false, message: 'Course not found' });
        } else {
          res.json({ success: true, course });
        }
      })
      .catch((error) => {
        res.status(500).json({ success: false, message: 'Error fetching course', error: error.message });
      });
  };

  // Update a course by ID
exports.updateCourse = (req, res) => {
    const courseId = req.params.id;
    const updatedCourseData = req.body;
  
    Course.findByIdAndUpdate(courseId, updatedCourseData, { new: true })
      .then((course) => {
        if (!course) {
          res.status(404).json({ success: false, message: 'Course not found' });
        } else {
          res.json({ success: true, message: 'Course updated', course });
        }
      })
      .catch((error) => {
        res.status(500).json({ success: false, message: 'Error updating course', error: error.message });
      });
  };
  
  // Delete a course by ID
  exports.deleteCourse = (req, res) => {
    const courseId = req.params.id;
  
    Course.findByIdAndRemove(courseId)
      .then((course) => {
        if (!course) {
          res.status(404).json({ success: false, message: 'Course not found' });
        } else {
          res.json({ success: true, message: 'Course deleted' });
        }
      })
      .catch((error) => {
        res.status(500).json({ success: false, message: 'Error deleting course', error: error.message });
      });
  };