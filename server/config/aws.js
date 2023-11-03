const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');

// Initialize AWS S3 instance
const s3 = new AWS.S3({
  accessKeyId: 'YOUR_ACCESS_KEY',
  secretAccessKey: 'YOUR_SECRET_KEY',
});

// Specify your S3 bucket name
const bucketName = 'skillgrove';

// Function to upload a file to S3
async function uploadFileToS3(filePath) {
  // Extract the file name from the file path
  const fileName = path.basename(filePath);

  // Create a ReadableStream from the file
  const fileStream = fs.createReadStream(filePath);

  // Set S3 upload parameters
  const uploadParams = {
    Bucket: bucketName,
    Key: fileName,
    Body: fileStream,
  };

  s3.upload(uploadParams, (err, data) => {
    if (err) {
      console.error('Error uploading file:', err);
    } else {
      console.log('File uploaded successfully. S3 URL:', data.Location);
    }
  });
}

module.exports = { uploadFileToS3 };


// Example usage
// const fileToUpload = 'path/to/your/file.pdf'; // Replace with the path to your file
// uploadFileToS3(fileToUpload);
