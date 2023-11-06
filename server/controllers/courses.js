const { uploadFileToS3 } = require('../config/aws');
const { default: KafkaConfig } = require('../config/kafka');
const logger = require('../logger');
const Category = require('../models/Category');
const Course = require('../models/Course');
const Instructor = require('../models/Instructor');
const User = require('../models/User');


  // const s3FileUrl = await uploadFileToS3(file);

  // const courseContent =[]
  // courseContent.push(s3FileUrl)



// Get a paginated list of courses with filtering and sorting
exports.getAllCourses = (req, res) => {
  const { title, instructor, category, sortBy, page, perPage } = req.query;
  const filter = {};

  if (title) {
      filter.title = { $regex: title, $options: 'i' }; // Case-insensitive title search
  }

  if (instructor) {
      filter.instructor = { $regex: instructor, $options: 'i' }; // Case-insensitive instructor search
  }

  if (category) {
      filter.category = { $regex: category, $options: 'i' }; // Case-insensitive category search
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
      .populate('instructor') // Populate the instructor information
      .populate('categories') // Populate the category information
      .then((courses) => {
          res.json({ success: true, courses });
      })
      .catch((error) => {
          logger.log('error', 'Error fetching courses: ', error);
          res.status(500).json({ success: false, message: 'Error fetching courses', error: error.message });
      });
};



// Create a new course
exports.createCourse = async (req, res) => {
  const {  title, description, category, content, price, duration, slug, featuredImage , featuredImageAlt, url, tags} = req.body;
  console.log( req.body)


  const instructor_id = req.user._id
  let instructor = await Instructor.findById(instructor_id)
  if(!instructor){
    return res.status(400).json({ success: false, message: 'Instructor not found' });
  }

  const newCourse = new Course({
    title,
    description,
    category,
    instructor: instructor_id,
    content,
    duration,
    price,
    slug,
    featuredImage,
    featuredImageAlt,
    url,
    tags
  });

  newCourse
    .save()
    .then((course) => {
      res.json({ success: true, message: 'Course created', course });
    })
    .catch((error) => {
      logger.log('error', 'Error creating course: ', error);
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
        logger.log('error', 'Error fetching course: ', error);
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
        logger.log('error', 'Error updating course: ', error);
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
        logger.log('error', 'Error deleting course: ', error);
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
    logger.log("error", "Error sending message: ", error);
    res.status(500).json({
      status: "Error!",
      message: "Error sending message!",
    });
  
  

  }
};


// Enroll in a course
exports.enrollCourse = async (req, res) => {
  const { courseId } = req.params; 
  const studentId = req.user._id; 

  try {
    // Check if the course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    // Check if the user is already enrolled in the course
    if (course.students.includes(studentId)) {
      return res.status(400).json({ success: false, message: 'Already enrolled in the course' });
    }

    // Enroll the student in the course
    course.students.push(studentId);
    await course.save();

    // Add the course to the user's enrolled courses
    const user = await User.findById(studentId);
    user.coursesEnrolled.push(courseId);
    await user.save();

    res.json({ success: true, message: 'Enrolled in the course', course });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Enrollment failed', error: error.message });
  }
};


// Unenroll from a course
exports.unenrollCourse = async (req, res) => {
  const { courseId } = req.params; 
  const studentId = req.user._id; 

  try {
    // Check if the course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    // Check if the user is enrolled in the course
    if (!course.students.includes(studentId)) {
      return res.status(400).json({ success: false, message: 'Not enrolled in the course' });
    }

    // Unenroll the student from the course
    course.students.pull(studentId);
    await course.save();

    // Remove the course from the user's enrolled courses
    const user = await User.findById(studentId);
    user.coursesEnrolled.pull(courseId);
    user.recentCourses.push(courseId);
    await user.save();

    res.json({ success: true, message: 'Unenrolled from the course', course });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Unenrollment failed', error: error.message });
  }
};


// my courses
exports.getMyCourses = async (req, res) => {
  const studentId = req.user._id; 

  try {
    // Get the user's enrolled courses
    const user = await User.findById(studentId).populate('coursesEnrolled');
    res.json({ success: true, courses: user.coursesEnrolled });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching courses', error: error.message });
  }
};


// Get a single course by ID
exports.getMyCourseById = async (req, res) => {
  const { courseId } = req.params; 
  const studentId = req.user._id; 

  try {
    // Get the user's enrolled courses
    const user = await User.findById(studentId).populate('coursesEnrolled');
    const course = user.coursesEnrolled.find((course) => course._id.toString() === courseId);

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    res.json({ success: true, course });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching course', error: error.message });
  }
};