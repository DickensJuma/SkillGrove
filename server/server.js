const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv'); 


dotenv.config();

const app = express();
const port = process.env.PORT || 8081; 

// Middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// Connect to the MongoDB database
const dbUrl = process.env.MONGO_URL; // Use the MongoDB URI from .env file
mongoose
  .connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB connected successfully');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

// Define routes
app.get('/', (req, res) => {
  res.send('Welcome Home!');
}
);
const apiRoutes = require('./routes/api');
const KafkaConfig = require('./config/kafka');
app.use('/v1', apiRoutes);


const kafkaConfig = new KafkaConfig();
// kafkaConfig.consume("my-course-topic", (value) => {
//   console.log("📨 Receive message: ", value);
// });

var passport = require('passport');

var userProfile;
 
app.use(require('express-session')({ secret: 'my secrtesss', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, cb) {
  cb(null, user);
});
 
passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});


/*  Google AUTH  */
 
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const GOOGLE_CLIENT_ID = '126370943564-7h9vqu94lanjr8sesae0kpp58t6l0dqe.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = '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';

passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:8080/api/auth/google/callback",
     passReqToCallback   : true
},
function(request, accessToken, refreshToken, profile, done) {
  console.log(request,accessToken, refreshToken,profile);
    return done(err, user);
 
}
 
));



// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
