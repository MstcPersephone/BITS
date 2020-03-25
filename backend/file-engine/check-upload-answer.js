const fc = require('./file-compare');
const unzip =  require('./unzip');
const fs = require('fs');
const path = require('./path');

// answerType parameters
const submitted = 'submitted';
const correct = 'correct';

// Arrays to hold extracted files
let correctFiles = [];
let submittedFiles = [];

// flag that changes to false if a file compare returns false
let isMatch = true;

const checkUploadAnswer = function (correctAnswerPath, submittedAnswerPath, isZip) {
  if (isZip) {
    // Unzip both folders to the stored path in path.js
    unzip.unzipFolder(correctAnswerPath, correct);
    unzip.unzipFolder(submittedAnswerPath, submitted);
  }

  // Read the correct answer and push the file to array for compare
  fs.readdir(path.correctAnswerPath + '/mockZipContents', function (error, files) {
    if (error) {
      console.error("Could not list the directory.", err);
      process.exit(1);
    }

    files.forEach(function (file, index) {
      correctFiles.push(file);
      console.log(file + " added for compare.");
    });
  });

  // Read the submitted answer and push the file to array for compare
  // Calls compareFiles from file-compare.js once asynchronous file reading gets success callback
  fs.readdir(path.submittedAnswerPath + '/mockZipContents', function (error, files) {
    if (error) {
      console.error("Could not list the directory.", err);
      process.exit(1);
    }

    files.forEach(function (file, index) {
      submittedFiles.push(file);
      console.log(file + " added for compare.");
    });

    correctFiles.forEach(function (file, index) {
      var result = fc.compareFiles(file, submittedFiles[index]);
      if (!result) {
        isMatch = false;
      }
    });
  });

  return isMatch;
}

module.exports = { checkUploadAnswer }
