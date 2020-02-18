// Import unzip and file system packages
const unzipper = require('unzipper');
const fs = require('fs');
const path = require('./path');


// Unzips folder to temp/question
const unzipFolder = function (zipFilePath, answerType) {
  fs.createReadStream(zipFilePath).pipe(unzipper.Extract({
    path: answerType === 'submitted' ? path.submittedAnswerPath : path.correctAnswerPath
  }));
}

module.exports = { unzipFolder }
