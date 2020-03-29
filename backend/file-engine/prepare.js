const fs = require('fs');
const guid = require('../providers/guidFactory');

const makeDirectory = () => {
  const directory = fs.mkdirSync('../temp/' + guid.createGuid());
  return directory;
};

module.exports = {
  makeDirectory: makeDirectory
}
