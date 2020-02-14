// express.js package
const express = require('express');

const app = express();

// Test response. Need to remove once we start adding real requests.
app.use((request, response, next) => {
  response.send('Message sending!')
});

// Exports the contstants and all of the middlewares attached to it.
module.exports = app;
