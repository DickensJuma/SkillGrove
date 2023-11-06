const Lesson = require('../models/Lesson'); 
const Course = require('../models/Course'); 
const logger = require('../logger');

exports.createLesson = async (req, res) => {
  const courseId = req.params.courseId; // Get the course ID from the route parameters

  try {
    // Check if the course exists and is owned by the instructor (Add proper authorization checks)
    const course = await Course.findById({_id: courseId});
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Create a new lesson associated with the course
    const { title, content, position } = req.body;

    const lesson = new Lesson({
      title,
      content,
      position,
      course: courseId,
    });

    await lesson.save();

    //uodate course
    course.lessons.push(lesson._id)
    await course.save()

    return res.status(201).json({ message: 'Lesson created successfully', lesson });
  } catch (error) {
    logger.error('Error creating lesson: ', error);
    return res.status(500).json({ error: 'An error occurred while creating the lesson' });
  }
};

exports.editLesson = async (req, res) => {
  const lessonId = req.params.lessonId; // Get the lesson ID from the route parameters

  try {
    // Check if the lesson exists (Add proper authorization checks)
    const lesson = await Lesson.findById({_id:lessonId});
    if (!lesson) {
      return res.status(404).json({ error: 'Lesson not found' });
    }

    // Update the lesson with the provided data
    const { title, content, position } = req.body;

    lesson.title = title;
    lesson.content = content;
    lesson.position = position;

    await lesson.save();

    return res.status(200).json({ message: 'Lesson updated successfully', lesson });
  } catch (error) {
    return res.status(500).json({ error: 'An error occurred while updating the lesson' });
  }
};

exports.deleteLesson = async (req, res) => {
  const lessonId = req.params.lessonId; // Get the lesson ID from the route parameters

  try {
    // Check if the lesson exists (Add proper authorization checks)
    const lesson = await Lesson.findById({_id:lessonId});
    if (!lesson) {
      return res.status(404).json({ error: 'Lesson not found' });
    }

    // Delete the lesson
    await lesson.remove();

    return res.status(200).json({ message: 'Lesson deleted successfully' });
  } catch (error) {
    logger.error('Error deleting lesson: ', error);
    return res.status(500).json({ error: 'An error occurred while deleting the lesson' });
  }
};

exports.getLessonsByCourse = async (req, res) => {
  const courseId = req.params.courseId; // Get the course ID from the route parameters

  try {
    // Check if the course exists
    const lessons = await Lesson.find({course: courseId})

    if (!lessons) {
      return res.status(404).json({ error: 'Course not found' });
    }
  

    return res.status(200).json({ lessons });
  } catch (error) {
    logger.error('Error fetching lessons: ', error);
    return res.status(500).json({ error: 'An error occurred while fetching lessons' });
  }
};
