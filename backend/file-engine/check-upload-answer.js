const engine = require('./engine');
const Constants = require('../providers/constants');

const checkUploadAnswer = function (question) {
  // Arrays to hold extracted files
  let correctFiles = [];
  let submittedFiles = [];

  // flag that changes to false if a file compare returns false
  let isMatch = true;

  // creates an empty temp directory and returns the path
  const correctAnswerPath = engine.makeDirectory();
  const submittedAnswerPath = engine.makeDirectory();

  const isZip = question.correctAnswer[0].fileType === Constants.FileTypes.ZIP ? true : false
  console.log('is zip file', isZip);

  // Grabbing first file of each array for now
  const correctAnswerFile = question.correctAnswer[0];
  const submittedAnswerFile = question.submittedAnswer[0];

  // question.correctAnswer.forEach((a) => {

  // });

  // Move files to temp paths
  console.log('moving correct answer files to: ' + correctAnswerPath);
  engine.copyFile(correctAnswerPath, correctAnswerFile);

  // Move files to temp paths
  console.log('moving submitted answer files to: ' + submittedAnswerPath);
  engine.copyFile(submittedAnswerPath, submittedAnswerFile);

  // Unzip folder if zip file
  if (isZip) {
    console.log('unzipping files...');

    // Unzip both folders to the stored path in path.js
    let fullPath = correctAnswerPath + correctAnswerFile.name;
    console.log('unzipping correct answer files from: ' + fullPath);
    engine.unzipFolder(fullPath, correctAnswerPath);

    fullPath = submittedAnswerPath + submittedAnswerFile.name;
    console.log('unzipping submitted answer files to: ' + fullPath);
    engine.unzipFolder(fullPath, submittedAnswerPath);
  }

  // Read the correct answer and push the file to array for compare
  engine.readDirectory(correctAnswerPath).forEach((f) => {
    correctFiles.push(correctAnswerPath + f);
  });

  // Read the submitted answer and push the file to array for compare
  engine.readDirectory(submittedAnswerPath).forEach((f) => {
    submittedFiles.push(submittedAnswerPath + f);
  })

  // Loop through the correct files and compare them to the submitted files
  correctFiles.forEach((f, index) => {
    var result = engine.compareFiles(f, submittedFiles[index]);
    if (!result) {
      isMatch = false;
    }
  });

  // remove the temp directories now that compare is done
  setTimeout(() => {
    engine.removeDirectory(correctAnswerPath);
    engine.removeDirectory(submittedAnswerPath);
  }, 20000);

  return isMatch;
}

module.exports = { checkUploadAnswer }
