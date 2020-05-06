const engine = require('./engine');
const Constants = require('../providers/constants');

const checkUploadAnswer = function (question) {

  let isMatch = true;

  // Loop through correct answer files and run the check on each submitted file
  question.correctAnswer.forEach((correctAnswer, i) => {
    // Make sure a submitted answer exists to check against a correct answer
    if (question.submittedAnswer[i] !== null && question.submittedAnswer[i] !== undefined) {
      // Compare the file (handle unzipping if needed) and return result
      const runCheckResult = runCheck(correctAnswer, question.submittedAnswer[i]);
      console.log("Run Check Result", runCheckResult);

      if (!runCheckResult) {
        // If there was a mismatch, stop comparing and return
        isMatch = false;
      }
      // If there is not an submitted answer to match correct for comparison, return
    } else {
      isMatch = false;
    }
  });

  return isMatch;
}

function runCheck(correctAnswer, submittedAnswer) {

  // Arrays to hold extracted files (or single files if not zip)
  let correctPaths = [];
  let submittedPaths = [];

  // Flag that changes to false if a file compare returns false
  let isMatch = true;

  // Creates an empty temp directory and returns the path
  const correctAnswerPath = engine.makeDirectory();
  const submittedAnswerPath = engine.makeDirectory();

  // Determines whether either file is a zip
  correctAnswerIsZip = correctAnswer.fileType === Constants.FileTypes.ZIP;
  submittedAnswerIsZip = submittedAnswer.fileType === Constants.FileTypes.ZIP;

  // If only one of the two files is a zip file, they obviously don't match and submission is wrong
  if ((correctAnswerIsZip && !submittedAnswerIsZip) || (!correctAnswerIsZip && submittedAnswerIsZip)) {
    return false;
  }

  // Check if unzip logic is needed
  const isZip = correctAnswerIsZip && submittedAnswerIsZip ? true : false;

  console.log('is zip file', isZip);

  // Move files to temp paths
  console.log('moving correct answer files to: ' + correctAnswerPath);
  engine.copyFile(correctAnswerPath, correctAnswer);

  // Move files to temp paths
  console.log('moving submitted answer files to: ' + submittedAnswerPath);
  engine.copyFile(submittedAnswerPath, submittedAnswer);

  if (isZip) {
    console.log('unzipping files...');

    // Unzip the correct answer
    let fullPath = correctAnswerPath + correctAnswer.name;
    console.log('unzipping correct answer files from: ' + fullPath);
    engine.unzipFolder(fullPath, correctAnswerPath);

    // Unzip the submitted answer
    fullPath = submittedAnswerPath + submittedAnswer.name;
    console.log('unzipping submitted answer files to: ' + fullPath);
    engine.unzipFolder(fullPath, submittedAnswerPath);
  }

  // Read the correct answers and push the files to array for compare
  engine.readDirectory(correctAnswerPath).forEach((p) => {
    correctPaths.push(correctAnswerPath + p);
  });

  // Read the submitted answers and push the files to array for compare
  engine.readDirectory(submittedAnswerPath).forEach((p) => {
    submittedPaths.push(submittedAnswerPath + p);
  })

  // Loop through the correct files and compare them to the submitted files
  correctPaths.forEach((p, index) => {

    // Compare correct file to submitted file
    var result = engine.compareFiles(p, submittedPaths[index]);

    // If one file fails, the result is set to false and remains false
    if (!result) {
      isMatch = false;
    }
  });

  // Remove the temp directories now that compare is done
  // setTimeout to make sure compare cleanup is done first
  setTimeout(() => {
    engine.removeDirectory(correctAnswerPath);
    engine.removeDirectory(submittedAnswerPath);
  }, 2000);

  return isMatch;
}

module.exports = { checkUploadAnswer }
