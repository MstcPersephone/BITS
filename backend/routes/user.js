const express = require("express");
const bcrypt = require("bcrypt");

const User = require("../models/user");

const router = express.Router();

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

module.exports = router;
