const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv'); 


dotenv.config();

const app = express();
const port = process.env.PORT || 6000; 

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
const apiRoutes = require('./routes/api');
const KafkaConfig = require('./config/kafka');
app.use('/api', apiRoutes);

const kafkaConfig = new KafkaConfig();
// kafkaConfig.consume("my-course-topic", (value) => {
//   console.log("📨 Receive message: ", value);
// });

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
