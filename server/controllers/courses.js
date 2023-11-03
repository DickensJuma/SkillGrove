const { uploadFileToS3 } = require('../config/aws');
const { default: KafkaConfig } = require('../config/kafka');
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
exports.createCourse = async (req, res) => {
  const { title, description, file ,  duration,price, category} = req.body;
  console.log( req.body)

  const instructor = req.user._id
  

  const s3FileUrl = await uploadFileToS3(file);

  const courseContent =[]
  courseContent.push(s3FileUrl)

  const newCourse = new Course({
    title,
    description,
    instructor,
    content: courseContent,
    duration,
    price,
    category
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


 

exports.sendMessageToKafka = async (req, res) => {
  try {
    const { message } = req.body;
    const kafkaConfig = new KafkaConfig();
    const messages = [{ key: "key1", value: message }];
    kafkaConfig.produce("my-course-topic", messages);

    res.status(200).json({
      status: "Ok!",
      message: "Message successfully send!",
    });
  } catch (error) {
    console.log(error);
  }
};