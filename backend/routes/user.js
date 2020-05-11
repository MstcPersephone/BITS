// Importing required modules.
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

// Defining the router constant.
const router = express.Router();

// The middleware to create a new user login
router.post("/create", (request, response, next) => {
  bcrypt.hash(request.body.password, 10).then(hash => {
    const user = new User({
      username: request.body.username,
      password: hash,
      isAdmin: request.body.isAdmin
    });
    user
      .save()
      .then(result => {
        response.status(201).json({
          message: "User created!",
          result: result
        });
      })
      .catch(err => {
        response.status(500).json({
          error: err
        });
      });
  });
});

// The middleware to login a user
router.post("/login", (request, response, next) => {
  let fetchedUser;
  // Find the username in the database
  User.findOne({ username: request.body.username })
    .then(user => {
      if (!user) {
        return response.status(401).json({
          message: "Username not found."
        });
      }
      fetchedUser = user;
      // Compare the user entered password with password in database
     return bcrypt.compare(request.body.password, user.password);
    })
    .then(result => {
      if(!result) {
        return response.status(401).json({
          message: "Password does not match."
      });
    }
    // Create the token used to login - expires in 2 hours
    const token = jwt.sign({ username: fetchedUser.username, userId: fetchedUser._id },
      'this_is_a_secret_but_its_no_secret_this_application_was_built_by_the_fine_people_of_team_persephone_Janet_Derek_Orion_and_Tegan',
      { expiresIn: "2h" }
      );
      response.status(200).json({
        token: token,
        expiresIn: 7200,
        isAdmin: fetchedUser.isAdmin
      });
    })
    .catch(err => {
      return response.status(401).json({
        message: "Authentication failed."
      });
    });
});

module.exports = router;
