const fs = require("fs");
// Using bson to convert arrayBuffer to binary data
const bson = require('bson');

const checkBoxModel = require("./models/question-types/checkbox");
const multipleChoiceModel = require("./models/question-types/multiple-choice");
const trueFalseModel = require("./models/question-types/true-false");
const shortAnswerModel = require("./models/question-types/short-answer");
const uploadAnswerModel = require("./models/question-types/upload");

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
mongoose.connect('mongodb+srv://expressApp:Ohi6uDbGMZLBt56X@cluster0-bomls.mongodb.net/test?retryWrites=true&w=majority',
{ useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
  console.log('Connected to the database successfully'),
  (error) => {
    console.log(error.reason);
  }
});

// middleware for parsing json data and urlencoded data on requests
app.use(bodyParser.json({limit: '16mb', extended: true}))
app.use(bodyParser.urlencoded({limit: '16mb', extended: true}))

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

// Get all questions
app.get("/api/questions", (request, response, next) => {

  find('questions', {questionType: {$exists: true}}, function (error, questions) {
    response.status(200).json({
      message: 'Question Fetched Successfully!',
      questions: questions
      });
    console.log("Questions Fetched Successfully.")
    console.log(questions);
  }, error => {
    console.log(error.message);
      response.status(400).json({
        message: error.message,
        questions: questions
      })
  });
});

// Get only questions of a certain type
app.get("/api/questions/:questionType", (request, response, next) => {
  checkBoxModel.find({questionType: request.params.questionType}).then((questions, error) =>{
    response.status(200).json({
      message: request.params.questionType + ' Questions fetched successfully!',
      questions: questions
      });
  },
  error => {
    console.log(error.message);
      response.status(400).json({
        message: error.message,
        questions: null
      })
  })
});

// Get a single question by an id from the questions collection.
app.get("/api/question/:id", (request, response, next) => {
  checkBoxModel.find({_id: request.params.id}).then((question, error) =>{
    response.status(200).json({
      message: request.params.id + ' Question fetched successfully!',
      question: question
      });
      // TODO: [PER-98] Remove the console logs in getting a question by ID before pushing to production.
    console.log(message);
    console.log(question);
  },
  error => {
    console.log(error.message);
      response.status(400).json({
        message: error.message,
        question: null
      })
  })
});

app.post("/api/questions/save", (request, response, next) => {
  // Requestion.body is the question that is passed through.
  const question = request.body;
  let questionObjectToSave;

  // Generate Ids for attachments
  if (question.hasAttachments) {
    question.attachments.forEach((a) => {
      console.log(a.content);
      a.id = mongoose.Types.ObjectId();
      console.log(a.content);
    });
  }

  // Generate unique id for question.
  const questionId = mongoose.Types.ObjectId();

  // Swtich to internal function that creates object to save.
  // TODO: [PER-59] Refactor these internal functions to their own file.
  switch (question.questionType) {
    case "Checkbox":
      questionObjectToSave = createMultipleChoice(question, questionId);
      break;

    case "Multiple Choice":
      questionObjectToSave = createCheckbox(question, questionId);
      break;

    case "Short Answer":
      questionObjectToSave = createShortAnswer(question, questionId);
      break;

    case "True False":
      questionObjectToSave = createTrueFalse(question, questionId);
      break;

    case "Upload":
      questionObjectToSave = createUpload(question, questionId);
  }

  // Saves the object to the database.
  // Returns either 200 success or 400 error
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
  },
    error => {
      console.log(error.message);
      response.status(400).json({
        message: error.message,
        question: question
      })
  });
});

// Creates a Checkbox question object for saving to the database.
function createCheckbox(question, questionId) {

  // Generates an id for each option
  // Assigns question id to each option
  question.options.forEach((x) => {
    x.id = mongoose.Types.ObjectId(),
    x.questionId = questionId
  });

  // Create Checkbox Model.
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

// Creates a Multiple Choice question object for saving to the database.
function createMultipleChoice(question, questionId) {

  // Generates an id for each option
  // Assigns question id to each option
  question.options.forEach((x) => {
    x.id = mongoose.Types.ObjectId(),
    x.questionId = questionId
  });

  // Create Multiple Choice Model.
  const questionModel = new multipleChoiceModel({
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

function createShortAnswer(question, questionId) {

  // Generates an id for each match option
  // Assigns question id to each match option
  question.matches.forEach((x) => {
    x.id = mongoose.Types.ObjectId(),
    x.questionId = questionId
  });
  // Create Short Answer Model
  const questionModel = new shortAnswerModel({
    id: questionId,
    questionText: question.questionText,
    questionType: question.questionType,
    hasAttachments: question.hasAttachments,
    attachments: question.attachments,
    isAnswered: question.isAnswered,
    answer: question.answer,
    matches: question.matches,
    duration: question.duration,
    createdOn: Date.now()
  });

  return questionModel;
}

// Creates a True/False object for saving to the database.
function createTrueFalse(question, questionId) {

  // Create True/False Model
  const questionModel = new trueFalseModel({
    id: questionId,
    questionText: question.questionText,
    questionType: question.questionType,
    hasAttachments: question.hasAttachments,
    attachments: question.attachments,
    isAnswered: question.isAnswered,
    answer: question.answer,
    duration: question.duration,
    createdOn: Date.now()
  });

  return questionModel;
}

function createUpload(question, questionId) {

  // Create Upload Model
  const uploadModel = new uploadAnswerModel({
    id: questionId,
    questionText: question.questionText,
    questionType: question.questionType,
    hasAttachments: question.hasAttachments,
    attachments: question.attachments,
    isAnswered: question.isAnswered,
    correctAnswer: question.correctAnswer,
    submittedAnswer: question.submittedAnswer,
    duration: question.duration,
    createdOn: Date.now()
  });

  return uploadModel;
}

// Finds documents in a given collection.
// Used for when we can't target a specific model.
function find (name, query, callBack) {
  mongoose.connection.db.collection(name, function (err, collection) {
     collection.find(query).toArray(callBack);
 });
}

function toBuffer(arrayBuffer) {
  var buf = Buffer.alloc(arrayBuffer.byteLength);
  var view = new Uint8Array(arrayBuffer);
  for (var i = 0; i < buf.length; ++i) {
      buf[i] = view[i];
  }
  return buf;
}

// Exports the contstants and all of the middlewares attached to it.
module.exports = app;
