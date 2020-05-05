const fs = require('fs');
const zip = require('adm-zip');
const guid = require('../providers/guidFactory');
const Constants = require('../providers/constants');

// Compares two files and returns the results
const compareFiles = function(firstPath, secondPath) {

  // Check to see if the paths are directories
  firstPathIsDirectory = fs.lstatSync(firstPath).isDirectory();
  secondPathIsDirectory = fs.lstatSync(secondPath).isDirectory();

  // If either path is a directory, drill down and call compareFiles again
  if (firstPathIsDirectory || secondPathIsDirectory) {

    // If the answer and submission paths don't match (by type: file or directory)
    if ((firstPathIsDirectory && !secondPathIsDirectory) || (!firstPathIsDirectory && secondPathIsDirectory)) {
      return false;
    }

    // Set up new arrays to hold a string of paths
    const correctPaths = [];
    const submittedPaths = [];


    readDirectory(firstPath).forEach((p) => {
      correctPaths.push(p);
    });

    readDirectory(secondPath).forEach((p) => {
      submittedPaths.push(p);
    });

    // Loop through the correct files and compare them to the submitted files
    correctPaths.forEach((p, index) => {

      // Compare correct file to submitted file
      var result = compareFiles(p, submittedPaths[index]);

      // If one file fails, the result is set to false and remains false
      if (!result) {
        return false;
      }
    });

  }

  // Read contents of first path
  console.log('first file', firstPath);
  const firstPathResults = readFileContents(firstPath);
  // console.log('CONTENTS', firstFileResults);

  // Read contents of second path
  console.log('second file', secondPath);
  const secondPathResults = readFileContents(secondPath);
  // console.log('CONTENTS', secondFileResults);

  // Compare the contents of the two files
  var result = firstPathResults === secondPathResults;
  console.log( result ? 'File contents match' : 'File contents do not match');
  return result;
}

// Makes a new temp directory
const makeDirectory = () => {

  // Create a folder with a GUID as a name
  const tempPath = 'backend/temp/' + guid.createGuid() + '/';
  fs.mkdirSync(tempPath, '777', {recursive: true});

  // Return the newly created path as a string to use with other functions
  return tempPath;
};

const copyFile = (tempFilePath, file) => {
  const newPath = tempFilePath + file.name;
  const fileString = file.content.split(',')[1];
  fs.writeFileSync(newPath, fileString, {encoding: 'base64'});
}

// Reads a directory
const readDirectory = (directory) => {
  return fs.readdirSync(directory);
}

// Reads a file and returns the contents as a string
const readFileContents = (filePath) => {
    return fs.readFileSync(filePath, Constants.Encoding.UTF_8);
}

// Removes a temp directory
const removeDirectory = (tempPath) => {
  console.log('Removing', tempPath);
  fs.rmdirSync(tempPath, { recursive: true });
}

// Unzips folder to temp directory
const unzipFolder = function (sourcePath, destinationPath) {
  // create zip object from zip file
  const z = new zip(sourcePath);

  // extract all files to the same folder
  z.extractAllTo(destinationPath);

  // delete the zipped file
  fs.unlinkSync(sourcePath);
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
