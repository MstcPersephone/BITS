// Import Node.js File System
const fs = require("fs");

// Import questionType mongoose objects for working with questions collection.
const checkBoxModels = require("./models/question-types/checkbox");
const multipleChoiceModels = require("./models/question-types/multiple-choice");
const trueFalseModels = require("./models/question-types/true-false");
const shortAnswerModels = require("./models/question-types/short-answer");
const uploadModels = require("./models/question-types/upload");

const checkBoxModel = checkBoxModels.question;
const checkboxArchiveModel = checkBoxModels.archive;
const multipleChoiceModel = multipleChoiceModels.question;
const multipleChoiceArchiveModel = multipleChoiceModels.archive;
const trueFalseModel = trueFalseModels.question;
const trueFalseArchiveModel = trueFalseModels.archive;
const shortAnswerModel = shortAnswerModels.question;
const shortAnswerArchiveModel = shortAnswerModels.archive;
const uploadModel = uploadModels.question;
const uploadArchiveModel = uploadModels.archive;

const questionFactory = require("./providers/questionFactory");

// ******************************************************** //
// ***********   DATABASE COLLECTION OBJECTS   ************ //
// ******************************************************** //
const questionCollections = require("./models/question");
const categoryCollection = require("./models/shared/category");
const assessmentCollection = require("./models/assessment");
const studentCollection = require("./models/student");

const questionCollection = questionCollections.questions;
const archiveCollection = questionCollections.archive;

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

// *********************************************************** //
// ******   ARCHIVE: QUESTION FROM QUESTION COLLECTION   ****** //
// *********************************************************** //
app.post("/api/question/delete", (request, response, next) => {
  // Request.body is the question that is passed through.
  const question = request.body;

  console.log('passed back questionId: ', question._id);

  // Will store the converted object to be archived.
  let questionObjectToArchive;

  // Call to question type factory which creates the object to archive
  questionObjectToArchive = questionFactory.createQuestionTypeFactory(question, 'archive');

  // Attach categories to question before archiving.
  questionObjectToArchive.categories = question.categories;

  // Attach points to the question before archiving.
  questionObjectToArchive.points = question.points;

  // console.log('question to save ' + questionObjectToArchive);
// Save question to archive collection and return success or error message
  questionObjectToArchive.save().then(() => {
    const objectId = mongoose.Types.ObjectId(questionObjectToArchive._id);
    deleteById('questions', {_id: objectId}, function (error, question) {
      if (error) {
        response.status(400).json({
          message: error.message,
          question: question
        })
      }
      else {
        response.status(200).json({
          message: 'Question archived successfully!',
          question: question
      });
      }
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

// ******************************************************** //
// *************   GET: ALL ASSESSMENTS    ***************** //
// ******************************************************** //
app.get("/api/assessments", (request, response, next) => {
  // Get all assessments from the database
  assessmentCollection.find({ _id: { $exists: true } }).then((assessments, error) => {
    response.status(200).json({
      message: 'Assessments fetched successfully!',
      assessments: assessments
    });
  },
    error => {
      console.log(error.message);
      response.status(400).json({
        message: error.message,
        assignments: null
      })
    })
});

// ******************************************************** //
// *********   GET: SINGLE ASSESSMENT BY ID    ************ //
// ******************************************************** //
app.get("/api/assessment/:id", (request, response, next) => {
  assessmentCollection.find({ _id: request.params.id }).then((assessment, error) => {
    response.status(200).json({
      message: request.params.id + ' Assessment fetched successfully!',
      assessment: assessment
    });
    // TODO: [PER-98] Remove the console logs before pushing to production.
    console.log(assessment);
  },
    error => {
      console.log(error.message);
      response.status(400).json({
        message: error.message,
        assessment: null
      })
    })
});

// ******************************************************** //
// ***************   GET: CATEGORY BY ID  ***************** //
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

// ********************************************************** //
// ******   GET: QUESTIONS (ALL) FOR ASSESSMENT USE   ******* //
// ********************************************************** //
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

// ************************************************************* //
// ****   GET: QUESTION (ALL) FILTERED IN A CATEGORY ARRAY  **** //
// ************************************************************* //
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

// ******************************************************** //
// *******   GET: QUESTIONS ONLY OF A CERTAIN TYPE  ******* //
// ******************************************************** //
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

// ******************************************************** //
// ************   GET: SINGLE QUESTION BY ID  ************* //
// ******************************************************** //
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

// *********************************************************** //
// ******   SAVE: ASSESSMENT TO ASSESSMENT COLLECTION   ****** //
// *********************************************************** //
app.post("/api/assessment/save", (request, response, next) => {

  // Request.body is the assessment that is passed through.
  const assessment = request.body;

  // Generate unique Id for assessment.
  const assessmentId = mongoose.Types.ObjectId();

  // assigns the unique id to the assessment.
  assessment._id = assessmentId;
  console.log('Assessment:', assessment)

  // assessment mapped object from front to back end.
  const assessmentToSaveModel = new assessmentCollection({
    id: assessmentId,
    name: assessment.name,
    description: assessment.description,
    config: assessment.config,
    questionIds: assessment.questionIds,
    status: assessment.status,
    createdOn: Date.now()
  });

  console.log('Backend Assessment Presave', assessmentToSaveModel);

  // Saves the assessment object to the database.
  // Returns either 200 success or 400 error
  assessmentToSaveModel.save().then(() => {

    // Log success message and saved object.
    console.log(assessment.name + ' Assessment Created Successfully');
    console.log('Saved assessment', assessmentToSaveModel);

    // Send success message back to front end.
    // Will probably use for logging later.
    response.status(200).json({
      message: 'Assessment saved successfully!',
      assessment: assessment
    });
  },
    error => {
      console.log(error.message);
      response.status(400).json({
        message: error.message,
        assessment: assessment
      })
    });
});

// ******************************************************* //
// ******   SAVE: CATEGORY TO CATEGORY COLLECTION   ****** //
// ******************************************************* //
app.post("/api/categories/save", (request, response, next) => {

  // Request.body is the category that is passed through.
  const category = request.body;

  // Generate unique Id for category.
  const categoryId = mongoose.Types.ObjectId();

  category._id = categoryId;

  // category mapped object from front to back end.
  const categoryToSaveModel = new categoryCollection({
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
// ******   SAVE: QUESTION TO QUESTION COLLECTION   ****** //
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

// ***************************************************** //
// ******   SAVE: STUDENT TO STUDENT COLLECTION   ****** //
// ***************************************************** //
app.post("/api/student/save", (request, response, next) => {

  // Request.body is the student that is passed through.
  const student = request.body;

  // Generate unique Id for student.
  const studentId = mongoose.Types.ObjectId();

  // assigns the unique id to the student.
  student._id = studentId;
  console.log('Student:', student)

  // student mapped object from front to back end.
  const studentToSaveModel = new studentCollection({
    id: studentId,
    studentId: student.studentId,
    firstName: student.firstName,
    lastName: student.lastName,
    dateOfBirth: student.dateOfBirth,
    campusLocation: student.campusLocation,
    lastAssessmentDate: student.lastAssessmentDate,
    previousScores: student.previousScores,
    createdOn: Date.now()
  });

  console.log('Backend Student Presave', studentToSaveModel);

  // Saves the student object to the database.
  // Returns either 200 success or 400 error
  studentToSaveModel.save().then(() => {

    // Log success message and saved object.
    console.log(student.studentId + ' Created Successfully');
    console.log('Saved Student', studentToSaveModel);

    // Send success message back to front end.
    // Will probably use for logging later.
    response.status(200).json({
      message: 'Assessment saved successfully!',
      student: student
    });
  },
    error => {
      console.log(error.message);
      response.status(400).json({
        message: error.message,
        student: student
      })
    });
});


// ******************************************************** //
// ***********   UPDATE QUESTION COLLECTION   ************* //
// ******************************************************** //
app.post("/api/question/update/", (request, response, next) => {

  // Gets the question passed from the front end
  // Stores data for updating backend properties
  console.log(request.body.points);
  const requestedUpdate = request.body;

  // Sends the data to the question factory to edit the properties for a specific question type
  // Stores the data in a question object
  const update = questionFactory.editQuestionFactory(requestedUpdate);

  // passes the data to the database to update a specific question by id
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

// *********************************************************** //
// *********   GET: COLLECTION BY GENERIC FUNCTION   ********* //
// *********************************************************** //
// Used for when we can't target a specific model.
function find(name, query, callBack) {
  mongoose.connection.db.collection(name, function (error, collection) {
    collection.find(query).toArray(callBack);
  });
}

function deleteById(name, query, callBack) {
  mongoose.connection.db.collection(name, function(error, collection) {
    collection.deleteOne(query).then(callBack);
  });
}

// Exports the contstants and all of the middlewares attached to it.
module.exports = app;
