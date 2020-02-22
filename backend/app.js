const checkBoxModel = require("./models/question-types/checkbox");
const trueFalseModel = require("./models/question-types/true-false");

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
  console.log('Connected to the database successfully'),
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
      questionType: "ESSAY",
      hasAttachments: false,
      attachments: null,
      isAnswered: false,
      duration: 0,
      answer: ""
    },
    {
      id: "987",
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
  // Requestion.body is the question that is passed through.
  const question = request.body;
  let questionObjectToSave;

  // Generate unique id for question.
  const questionId = mongoose.Types.ObjectId();

  switch (question.questionType) {
    case "Checkbox":
    case "MultipleChoice":
      questionObjectToSave = createCheckbox(question, questionId);
      break;

    case "True/False":
      questionObjectToSave = createTrueFalse(question, questionId);
      break;
  }

  questionObjectToSave.save().then(() => {
    // Log success message and saved object.
    console.log(question.questionType + ' Question Created Successfully');
    console.log(questionObjectToSave);

    // Send success message back to front end.
    // Will probably use for logging later.
    response.status(200).json({
      message: 'Question saved successfully!',
      question: question
    });
  }, error => {
    console.log(error.message);
    response.status(400).json({
      message: error.message,
      question: question
    })
  });
});

// Creates a Checkbox question object for saving to the database.
function createCheckbox(question, questionId) {
  const optionId = mongoose.Types.ObjectId();
  question.options.forEach((x) => {
    x.questionId = questionId,
    x.id = optionId
  });

  // Create Checkbox Model to save to the database.
  const questionModel = new checkBoxModel({
    id: questionId,
    questionText: question.questionText,
    questionType: question.questionType,
    options: question.options,
    hasAttachments: question.hasAttachments,
    attachments: question.attachments,
    isAnswered: question.isAnswered,
    duration: question.duration,
    createdOn: Date.now()
  });

  return questionModel;
}

// Create True/False Model to save to the database.
function createTrueFalse(question, questionId) {
  const questionModel = new trueFalseModel({
    id: questionId,
    questionText: question.questionText,
    questionType: question.questionTYpe,
    hasAttachments: question.hasAttachments,
    attachments: question.attachments,
    isAnswered: question.isAnswered,
    answer: question.answer,
    duration: question.duration,
    createdOn: Date.now()
  });

  return questionModel;
}

// Exports the contstants and all of the middlewares attached to it.
module.exports = app;
