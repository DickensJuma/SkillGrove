const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const apiRoutes = require('./routes/api');


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Import and use your middleware
const authenticationMiddleware = require('./middleware/authentication');
app.use(authenticationMiddleware);

// Set up your routes
const apiRoutes = require('./routes/api');
app.use('/api', apiRoutes);

module.exports = app;
