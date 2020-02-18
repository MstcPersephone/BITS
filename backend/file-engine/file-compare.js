const fs = require('fs');
const path = require('path');
const encoding = 'utf8';


// Reads a file and returns the contents as a string
const readFileContents = function(filePath) {
  return fs.readFileSync(filePath, encoding);
}

// Compares two files and returns the results
const compareFiles = function(firstFile, secondFile) {
  // Console log statements to show content compare is happening
  console.log('FIRST FILE');
  console.log(firstFile);
  console.log('SECOND FILE');
  console.log(secondFile);

  var result = firstFile === secondFile;
  console.log( result ? 'File contents match' : 'File contents do not match');
  return result;
}

// ACT
// const firstFile = readFileContents(mockFirstFilePath);
// const secondFile = readFileContents(mockSecondFilePath);
// compareFiles(firstFile, secondFile);


// FUNCTIONS //

module.exports = { compareFiles, readFileContents }
