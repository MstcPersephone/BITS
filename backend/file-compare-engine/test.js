const checker = require('./check-upload-answer');
console.log(checker.checkUploadAnswer() ? 'Correct: All files matched' : 'Incorrect: Not all files match');
