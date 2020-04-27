const fs = require('fs');
const zip = require('adm-zip');
const guid = require('../providers/guidFactory');
const Constants = require('../providers/constants');

// Compares two files and returns the results
const compareFiles = function(firstFile, secondFile) {

  // Read contents of first file
  console.log('first file', firstFile);
  const firstFileResults = readFileContents(firstFile);
  // console.log('CONTENTS', firstFileResults);

  // Read contents of second file
  console.log('second file', secondFile);
  const secondFileResults = readFileContents(secondFile);
  // console.log('CONTENTS', secondFileResults);

  // Compare the contents of the two files
  var result = firstFileResults === secondFileResults;
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
  const uint8Array = Uint8Array.from(file.content);
  let readResult = fs.readFileSync(uint8Array);
  // fs.writeFileSync(newPath, readResult);
  // fs.writeFileSync(newPath, '777', Buffer.from(file.content, 'base64'));
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
  fs.rmdirSync(tempPath, { recursive: true });
}

// Unzips folder to temp directory
const unzipFolder = function (sourcePath, destinationPath) {
  // const rs = fs.createReadStream(sourcePath).pipe(zip.Extract({
  //   path: destinationPath
  // }));
  // rs.on('error', (error) => {
  //   console.log('ERROR', error.message);
  // })
  console.log('SOURCE_PATH: ', sourcePath);
  console.log('DESTINATION_PATH: ', destinationPath);
  // const zippedFile = new zip(sourcePath);
  // console.log('ZIPPED FILE', zippedFile);
  // console.log('READ_AS_TEXT', zippedFile.readAsTextAsync(sourcePath));
  // zippedFile.extractAllToAsync(destinationPath);
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
