const engine = require('./engine');
const Constants = require('../providers/constants');

const checkUploadAnswer = function (question) {

  // Arrays to hold extracted files (or single files if not zip)
  let correctFiles = [];
  let submittedFiles = [];

  // Flag that changes to false if a file compare returns false
  let isMatch = true;

  // Creates an empty temp directory and returns the path
  const correctAnswerPath = engine.makeDirectory();
  const submittedAnswerPath = engine.makeDirectory();

  // Temporary solution until up on the server (TODO: server)
  const isZip = question.correctAnswer[0].fileType === Constants.FileTypes.ZIP ? true : false
  console.log('is zip file', isZip);

  // Grabbing first file of each array for now (will update once on server)
  const correctAnswerFile = question.correctAnswer[0];
  const submittedAnswerFile = question.submittedAnswer[0];

  // Start of foreach loop to use once on server (TODO: server)
  // question.correctAnswer.forEach((a) => {

  // });

  // Move files to temp paths
  console.log('moving correct answer files to: ' + correctAnswerPath);
  engine.copyFile(correctAnswerPath, correctAnswerFile);

  // Move files to temp paths
  console.log('moving submitted answer files to: ' + submittedAnswerPath);
  engine.copyFile(submittedAnswerPath, submittedAnswerFile);

  // Unzip folder if zip file (TODO: Server)
  if (isZip) {
    console.log('unzipping files...');

    // Unzip the correct answer
    let fullPath = correctAnswerPath + correctAnswerFile.name;
    console.log('unzipping correct answer files from: ' + fullPath);
    engine.unzipFolder(fullPath, correctAnswerPath);

    // Unzip the submitted answer
    fullPath = submittedAnswerPath + submittedAnswerFile.name;
    console.log('unzipping submitted answer files to: ' + fullPath);
    engine.unzipFolder(fullPath, submittedAnswerPath);
  }

  // Read the correct answers and push the files to array for compare
  engine.readDirectory(correctAnswerPath).forEach((f) => {
    correctFiles.push(correctAnswerPath + f);
  });

  // Read the submitted answers and push the files to array for compare
  engine.readDirectory(submittedAnswerPath).forEach((f) => {
    submittedFiles.push(submittedAnswerPath + f);
  })

  // Loop through the correct files and compare them to the submitted files
  correctFiles.forEach((f, index) => {

    // Compare correct file to submitted file
    var result = engine.compareFiles(f, submittedFiles[index]);

    // If one file fails, the result is set to false and remains false
    if (!result) {
      isMatch = false;
    }
  });

  // Remove the temp directories now that compare is done
  // 20 second timeout is for demoing. (TODO: server)
  setTimeout(() => {
    engine.removeDirectory(correctAnswerPath);
    engine.removeDirectory(submittedAnswerPath);
  }, 20000);

  return isMatch;
}

module.exports = { checkUploadAnswer }
