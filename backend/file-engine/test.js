const checker = require('./check-upload-answer');
const path = require('./path');

var result = checker.checkUploadAnswer(path.correctAnswerZipPath, path.mockZipFilePath);
console.log(result ? 'Correct: All files matched' : 'Incorrect: Not all files match');
