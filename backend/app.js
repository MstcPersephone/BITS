const checkBoxModel = require("./models/question-types/checkbox");
const multipleChoiceModel = require("./models/question-types/multiple-choice");
const trueFalseModel = require("./models/question-types/true-false");
const shortAnswerModel = require("./models/question-types/short-answer");

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
    console.log(error.reason);
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

// Get all questions
app.get("/api/questions", (request, response, next) => {

  find('questions', {questionType: {$exists: true}}, function (error, questions) {
    response.status(200).json({
      message: 'Question saved successfully!',
      questions: questions
      });
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

app.post("/api/questions/save", (request, response, next) => {
  // Requestion.body is the question that is passed through.
  const question = request.body;
  let questionObjectToSave;

  // Generate unique id for question.
  const questionId = mongoose.Types.ObjectId();

  // Swtich to internal function that creates object to save.
  // TODO: Refactor these internal functions to their own file.
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

    case "True/False":
      questionObjectToSave = createTrueFalse(question, questionId);
      break;
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

// Finds documents in a given collection.
// Used for when we can't target a specific model.
function find (name, query, callBack) {
  mongoose.connection.db.collection(name, function (err, collection) {
     collection.find(query).toArray(callBack);
 });
}

// Exports the contstants and all of the middlewares attached to it.
module.exports = app;
