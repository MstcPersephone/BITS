const checker = require('./check-upload-answer');
var result = checker.checkUploadAnswer();
console.log(result ? 'Correct: All files matched' : 'Incorrect: Not all files match');
