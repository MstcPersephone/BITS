const fs = require('fs');
const unzipper = require('unzipper');
const guid = require('../providers/guidFactory');
const Constants = require('../providers/constants');

// Compares two files and returns the results
const compareFiles = function(firstFile, secondFile) {
  // Read contents of first file
  console.log('first file', firstFile);
  const firstFileResults = readFileContents(firstFile);
  console.log('CONTENTS', firstFileResults);

  // Read contents of second file
  console.log('second file', secondFile);
  const secondFileResults = readFileContents(secondFile);
  console.log('CONTENTS', secondFileResults);

  // Compare the contents of the two files
  var result = firstFileResults === secondFileResults;
  console.log( result ? 'File contents match' : 'File contents do not match');
  return result;
}

// Makes a new temp directory
const makeDirectory = () => {
  const tempPath = 'backend/temp/' + guid.createGuid() + '/';
  fs.mkdirSync(tempPath, {recursive: true});
  return tempPath;
};

// // Copies files from question object to temp folders
const copyFile = (tempFilePath, file) => {
  const newPath = tempFilePath + file.name;
  fs.writeFileSync(newPath, Buffer.from(file.content, 'base64'));
}

const readDirectory = (directory) => {
  return fs.readdirSync(directory);
}

// Reads a file and returns the contents as a string
const readFileContents = (filePath) => {
  return fs.readFileSync(filePath, Constants.Encoding.UTF_8);
}

// Removes a temp directory
const removeDirectory = (tempPath) => {
  fs.rmdirSync(tempPath, { recursive: true });
}

// Unzips folder to temp directory
const unzipFolder = function (sourcePath, destinationPath) {
  fs.createReadStream(sourcePath).on('error', function(error) {
    console.log('Error', error.message);
  }).pipe(unzipper.Extract({
    path: destinationPath
  }))
}

module.exports = {
  copyFile: copyFile,
  compareFiles: compareFiles,
  makeDirectory: makeDirectory,
  readDirectory: readDirectory,
  readFileContents: readFileContents,
  removeDirectory: removeDirectory,
  unzipFolder: unzipFolder
}
