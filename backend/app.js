const checkBoxModel = require("./models/question-types/checkbox");

// express.js package
const express = require("express");

// body-parser package
const bodyParser = require("body-parser");

// mongoose package
const mongoose = require('mongoose');

const app = express();

// connect to mongodb cluster
// second param is options list
// 02/18/2020: useNewUrlParser and useUnifiedTopology options are to avoid
// soon-to-be depecrated features of mongoDb client
mongoose.connect('mongodb+srv://expressApp:Ohi6uDbGMZLBt56X@cluster0-bomls.mongodb.net/test?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
  console.log('Successfully connected to the database'),
  (error) => {
    console.log(error.reason)
  }
});

// middleware for parsing json data on requests
app.use(bodyParser.json());

// CORS Headers to allow cross communication between angular and backend
app.use((request, response, next) => {
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  response.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, OPTIONS"
  );
  next();
});

// setup for question api
app.get("/api/questions", (request, response, next) => {
  const questions = [
    {
      id: "123",
      questionText: "How are you?",
      name: "Essay-Test",
      questionType: "ESSAY",
      hasAttachments: false,
      attachments: null,
      isAnswered: false,
      duration: 0,
      answer: ""
    },
    {
      id: "987",
      name: "Multi-Test",
      questionText: "Choose one making you better feeling:",
      options: [{
        id: 6,
        questionId: "987",
        name: "Correct",
        isAnswer: true,
        isSelected: false
      },
      {
        id: 7,
        questionId: "987",
        name: "Try again",
        isAnswer: false,
        isSelected: false
      },
      {
        id: 8,
        questionId: "987",
        name: "Nope",
        isAnswer: false,
        isSelected: false
      }],
      hasAttachments: false,
      attachments: null,
      isAnswered: false,
      duration: 0
    },
    {
      id: "456",
      questionText: "Select the primary colors:",
      name: "Checkbox-Test",
      questionType: "CHECKBOX",
      options: [{
        id: 1,
        questionId: "456",
        name: "blue",
        isAnswer: true,
        isSelected: false
      },
      {
        id: 2,
        questionId: "456",
        name: "red",
        isAnswer: true,
        isSelected: false
      },
      {
        id: 3,
        questionId: "456",
        name: "black",
        isAnswer: false,
        isSelected: false
      },
      {
        id: 4,
        questionId: "456",
        name: "purple",
        isAnswer: false,
        isSelected: false
      }
    ],
      hasAttachments: false,
      attachments: null,
      isAnswered: false,
      duration: 0
    },
    {
      id: "789",
      name: "TF-Test",
      questionText: "Earth is bigger than the sun.",
      questionType: "True_False",
      hasAttachments: false,
      attachments: null,
      isAnswered: false,
      duration: 0,
      answer: false
    }
  ];
  response.status(200).json({
    message: 'Questions fetched successfully!',
    questions: questions
  });
});

app.post("/api/questions/save", (request, response, next) => {
  const question = request.body;
  const questionModel = new checkBoxModel({
    questionText: question.questionText,
    questionType: question.questionType,
    options: question.options,
    hasAttachments: question.hasAttachments,
    attachments: question.attachments,
    isAnswered: question.isAnswered,
    duration: question.duration,
    createdOn: Date.now()
  });
  console.log('Checkbox Question Created');
  questionModel.save().then(() => {
    message: "Question Successfully Saved!"
  });
});

// Exports the contstants and all of the middlewares attached to it.
module.exports = app;
