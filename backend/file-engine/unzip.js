// Import unzip and file system packages
const unzipper = require('unzipper');
const fs = require('fs');


// Unzips folder to temp/question
const unzipFolder = function (sourcePath, destinationPath) {
  fs.createReadStream(sourcePath).pipe(unzipper.Extract({
    path: destinationPath
  }));
}

module.exports = { unzipFolder }
