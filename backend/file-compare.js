const fs = require('fs');
const encoding = 'utf8';

// filePath will get passed through
// these are just mock paths for testing
const mockFirstFilePath = './src/styles.css';
const mockSecondFilePath = './src/index.html';

// ACT
const firstFile = readFileContents(mockFirstFilePath);
const secondFile = readFileContents(mockSecondFilePath);
compareFiles(firstFile, secondFile);


// FUNCTIONS //

// Reads a file and returns the contents as a string
function readFileContents(filePath) {
  return fs.readFileSync(filePath, encoding);
}

// Compares two files and returns the results
function compareFiles(firstFile, secondFile) {
  // Console log statements to show content compare is happening
  console.log('FIRST FILE');
  console.log(firstFile);
  console.log('SECOND FILE');
  console.log(secondFile);

  var result = firstFile === secondFile;
  console.log( result ? 'File contents match' : 'File contents do not match');
  return result;
}
