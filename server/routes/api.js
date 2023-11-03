const express = require('express');
const router = express.Router();
const passport = require('passport');

//controllers

const coursesController = require('../controllers/courses');
const usersController = require('../controllers/users');
const { verifyUser, requireAuthentication } = require('../middleware/auth');

//  API routes
router.get('/courses', coursesController.getAllCourses);
 router.get('/courses/:id', coursesController.getCourseById);
router.post('/courses', requireAuthentication,coursesController.createCourse);
router.put('/courses/:id', coursesController.updateCourse);
 router.delete('/courses/:id', coursesController.deleteCourse);


 router.get('/users', usersController.getAllUsers);
 router.get('/users/:id', usersController.getUserById);
 router.post('/users', usersController.createUser);
 router.put('/users/:id', usersController.updateUser);
 router.delete('/users/:id', usersController.deleteUser);
 
 // User registration route
 router.post('/register', usersController.registerUser);
 router.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));
 router.get('/auth/google/callback', (req, res) => {
    
    res.redirect('/');
    }
    );


// User login route
router.post('/login',verifyUser, usersController.loginUser);

module.exports = router;
