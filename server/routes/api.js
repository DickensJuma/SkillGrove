const express = require('express');
const router = express.Router();
const passport = require('passport');

const { createLesson, editLesson, deleteLesson, getLessonsByCourse } = require('../controllers/lessons');
//controllers

const coursesController = require('../controllers/courses');
const usersController = require('../controllers/users');
const authController = require('../controllers/auth');
const categoriesController = require('../controllers/categories');
const { verifyUser, requireAuthentication } = require('../middleware/auth');

//  API routes
router.get('/courses', coursesController.getAllCourses);
 router.get('/courses/:id', coursesController.getCourseById);
router.post('/courses', requireAuthentication,coursesController.createCourse);
router.put('/courses/:id', coursesController.updateCourse);
 router.delete('/courses/:id', coursesController.deleteCourse);

router.post('/enroll/:courseId', coursesController.enrollCourse);
router.post('/unenroll/:courseId', coursesController.unenrollCourse);
router.get('/mycourses', coursesController.getMyCourses);
router.get('/mycourses/:courseId', coursesController.getMyCourseById);

router.get('/students', usersController.getAllStudents);
router.get('/instructors', usersController.getAllInstructors);


router.post('/courses/:courseId/lessons', createLesson);
router.put('/courses/:courseId/lessons/:lessonId', editLesson);
router.delete('/courses/:courseId/lessons/:lessonId', deleteLesson);
router.get('/courses/:courseId/lessons', getLessonsByCourse);

router.get('/categories', categoriesController.getAllCategories);
router.get('/categories/:id', categoriesController.getCategoryById);
router.post('/categories', categoriesController.createCategory);
router.put('/categories/:id', categoriesController.updateCategory);
router.delete('/categories/:id', categoriesController.deleteCategory);



 router.get('/users', usersController.getAllUsers);
 router.get('/users/:id', usersController.getUserById);
 router.post('/users', usersController.createUser);
 router.put('/users/:id', usersController.updateUser);
 router.delete('/users/:id', usersController.deleteUser);
 
 // User registration route
 router.post('/register', authController.registerUser);
 router.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));
 router.get('/auth/google/callback', (req, res) => {
    
    res.redirect('/');
    }
    );


// User login route
router.post('/login',verifyUser, authController.loginUser);

module.exports = router;
