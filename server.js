// TO START THE SERVER (DEVELOPMENT)
// enter the following into new terminal window
// npm run start:server


// INTERNAL FUNCTIONS

// Accepts the port value, parses it, then determins if it is a pipe or a port
// We may use pipes for data later on, so adding the logic now to handle it
const normalizePort = val => {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
};

// Does basic error logging in regards to the server running
const onError = error => {
  if (error.syscall !== "listen") {
    throw error;
  }
  const bind = typeof port === "string" ? "pipe " + port : "port " + port;
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
};

// Logs a listening event
const onListening = () => {
  const addr = server.address();
  const bind = typeof port === "string" ? "pipe " + port : "port " + port;
  debug("Listening on " + bind);
};

// START OF SERVER

// This is a default Node.js package.
const http = require('http');

// This is our express app (RESTful API)
const app = require('./backend/app');

// Debug features for development (and to run nodemon in development)
const debug = require('debug')('node-angular');

// process.env.PORT is an environment variable
// these can be dynamically injected at runtime
// we should look back at this once we deploy on the vm
const port = normalizePort(process.env.PORT || 3000);

app.set('port', port)

// Create the server and passend the server logic
const server = http.createServer(app)

// Turns on basic server error handling
// Logs listening event
// Starts the server
server.on("error", onError);
server.on("listening", onListening);
server.listen(port);
