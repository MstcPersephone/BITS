// Import Node.js File System
const fs = require("fs");

// Import questionType mongoose objects for working with questions collection.
const questionCollection = require("./models/question");
const checkBoxModel = require("./models/question-types/checkbox");
const multipleChoiceModel = require("./models/question-types/multiple-choice");
const trueFalseModel = require("./models/question-types/true-false");
const shortAnswerModel = require("./models/question-types/short-answer");
const uploadAnswerModel = require("./models/question-types/upload");
const categoryModel = require("./models/shared/category");
const questionFactory = require("./providers/questionFactory");

// Import Express.js package to build API endpoints
const express = require("express");

// Import body-parser package to parse request body as JSON.
const bodyParser = require("body-parser");

// Import Mongoose package to connect to MongoDb and work with Mongoose models.
const mongoose = require('mongoose');

// Create the API app
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

// Middleware for parsing json data and urlencoded data on requests
// The file size is the maximum size of a request that can come through
// MongoDb supports files up to 16mb, which is where limit is coming from
app.use(bodyParser.json({ limit: '16mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '16mb', extended: true }))

// CORS Headers to allow cross communication between angular and backend
app.use((request, response, next) => {
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  response.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, DELETE, PATCH, OPTIONS"
  );
  next();
});

app.post("/api/question/update/", (request, response, next) => {
  console.log(request.body.points);
  const requestedUpdate = request.body;
  console.log(requestedUpdate._id);
  const questionToUpdate = questionFactory.createQuestionTypeFactory(requestedUpdate);
  questionToUpdate.categories = requestedUpdate.categories;
  questionToUpdate.points = requestedUpdate.points;
  const update = questionFactory.editQuestionFactory(requestedUpdate);
  mongoose.connection.db.collection('questions').updateOne({ _id: mongoose.Types.ObjectId(requestedUpdate._id.toString()) }, { $set: update }, { upsert: true }, function (error, updatedQuestion) {

    // Send a successful response message and an array of categories to work with.
    response.status(200).json({
      message: 'updatedQuestion Fetched Successfully!',
      updatedQuestion: updatedQuestion
    });

    // Logs message and questions array to the backend for debugging.
    console.log("updatedQuestion Fetched Successfully.")
    console.log(updatedQuestion);
  }, error => {
    // Logs error message.
    // Sends an error status back to requestor.
    // Includes what was pulled for a categories array (if anything)
    console.log(error.message);
    response.status(400).json({
      message: error.message,
      updatedQuestion: updatedQuestion
    })
  });
});

// Gets a list of questions that make up an assessment
app.post("/api/assessment/questions/", (request, response, next) => {
  const questionIds = request.body.questionIds;
  console.log(questionIds);
  const objectIds = [];
  // Turns the string ids into ObjectIds
  questionIds.forEach((qId) => { objectIds.push(mongoose.Types.ObjectId(qId)) })
  console.log(objectIds);

  // Performs the search
  questionCollection.find({ _id: objectIds }, (error, questions) => {
    if (error) {
      console.log(error.message);
    }
    else {
      console.log(questions);
      // Send a successful response message and an array of questions to work with.
      response.status(200).json({
        message: 'Question Fetched Successfully!',
        questions: questions
      });
    }
  });
});

// ******************************************************** //
// ***************Get all categories by ID***************** //
// ******************************************************** //
app.get("/api/categories", (request, response, next) => {

  // Finds all categories by ID
  find('categories', { _id: { $exists: true } }, function (error, categories) {

    // Send a successful response message and an array of categories to work with.
    response.status(200).json({
      message: 'Categories Fetched Successfully!',
      categories: categories
    });

    // Logs message and questions array to the backend for debugging.
    console.log("Categories Fetched Successfully.")
    console.log(categories);
  }, error => {
    // Logs error message.
    // Sends an error status back to requestor.
    // Includes what was pulled for a categories array (if anything)
    console.log(error.message);
    response.status(400).json({
      message: error.message,
      categories: categories
    })
  });
});

// ******************************************************** //
// *****Get all questions if they have a question type***** //
// ******************************************************** //
app.get("/api/questions", (request, response, next) => {
  // Create the shell of the array that will be returned
  const organizedQuestions = {};
  let allQuestions = null;
  let allCategories = null;

  // Search the questions collection where:
  // questionType is a property on the object
  find('questions', { questionType: { $exists: true } }, function (error, questions) {
    if (error) {
      throw error;
    }
    // Assign questions to function-level variable
    allQuestions = questions;

    // Fetch all categories
    find('categories', { _id: { $exists: true } }, function (error, categories) {
      if (error) {
        throw error;
      }

      // Assign categories to function-level variable
      allCategories = categories;

      // Loop through categories to create separate arrays
      allCategories.forEach((c) => {
        // push new object
        // property is category name
        // value is array to hold questions
        organizedQuestions[c.name] = [];
      });

      // for each question, loop through its categories
      // push to each category array that it belongs to
      allQuestions.forEach((q) => {
        if (q.categories !== undefined && q.categories.length > 0) {
          // for each category attached to the question
          q.categories.forEach((c) => {
            // Find the proper category array and push the question
            organizedQuestions[c.name].push(q);
          });
        }
      });

      // Send back success message.
      response.status(200).json({
        message: 'Question Fetched Successfully!',
        questions: organizedQuestions
      });
    });
  });
});

// Get only questions of a certain type
app.get("/api/questions/:questionType", (request, response, next) => {
  questionCollection.find({ questionType: request.params.questionType }).then((questions, error) => {
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
  questionCollection.find({ _id: request.params.id }).then((question, error) => {
    response.status(200).json({
      message: request.params.id + ' Question fetched successfully!',
      question: question
    });
    // TODO: [PER-98] Remove the console logs in getting a question by ID before pushing to production.
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

// ******************************************************* //
// ******CATEGORY saved to the categories collection******* //
// ******************************************************* //
app.post("/api/categories/save", (request, response, next) => {

  // Request.body is the category that is passed through.
  const category = request.body;

  // Generate unique Id for category.
  const categoryId = mongoose.Types.ObjectId();

  category._id = categoryId;

  // category mapped object from front to back end.
  const categoryToSaveModel = new categoryModel({
    id: categoryId,
    name: category.name,
    createdOn: Date.now()
  });

  // Saves the category object to the database.
  // Returns either 200 success or 400 error
  categoryToSaveModel.save().then(() => {

    // Log success message and saved object.
    console.log(category.name + ' Category Created Successfully');
    console.log(categoryToSaveModel);

    // Send success message back to front end.
    // Will probably use for logging later.
    response.status(200).json({
      message: 'Category saved successfully!',
      category: category
    });
  },
    error => {
      console.log(error.message);
      response.status(400).json({
        message: error.message,
        category: category
      })
    });
});

// ******************************************************* //
// ******QUESTION saved to the questions collection******* //
// ******************************************************* //
app.post("/api/question/save", (request, response, next) => {

  // Request.body is the question that is passed through.
  const question = request.body;

  // Will store the converted object to be saved.
  let questionObjectToSave;

  // Generate unique Ids for attachments
  if (question.hasAttachments) {
    question.attachments.forEach((a) => {
      a.id = mongoose.Types.ObjectId();
    });
  }

  if (question._id == null) {
    // Generate unique Id for question.
    question._id = mongoose.Types.ObjectId();
  }

  // Call to question type factory which creates the object to
  questionObjectToSave = questionFactory.createQuestionTypeFactory(question);

  // // Attach categories to question before saving.
  questionObjectToSave.categories = question.categories;

  // Attach points to the question before saving.
  questionObjectToSave.points = question.points;

  // Attach assessment Ids before saving.
  questionObjectToSave.assessmentIds = question.assessmentIds;

  // Attach indication if question was answered correctly before saving.
  questionObjectToSave.isAnsweredCorrectly = question.isAnsweredCorrectly;

  console.log(questionObjectToSave);

  // Saves the object to the database.
  // Returns either 200 success or 400 error
  questionObjectToSave.save().then(() => {

    // Log success message and saved object.
    // console.log(question.questionType + ' Question Created Successfully');
    // console.log(questionObjectToSave);

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

app.post("/api/question/delete/:id", (request, response, next) => {
  console.log(request.body);
  const archivedQuestion = request.body;
  mongoose.connection.db.collection('archived').save(archivedQuestion);

  next();
});

app.delete((request, response, next) => {
  console.log(request.body);
  questionCollection.deleteOne({_id: request.params.id});

});

// Finds documents in a given collection.
// Used for when we can't target a specific model.
function find(name, query, callBack) {
  mongoose.connection.db.collection(name, function (error, collection) {
    collection.find(query).toArray(callBack);
  });
}

// Exports the contstants and all of the middlewares attached to it.
module.exports = app;
