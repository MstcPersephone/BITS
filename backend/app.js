// Import Node.js File System
const fs = require("fs");

// Import questionType mongoose objects for working with questions collection.
const checkBoxModels = require("./models/question-types/checkbox");
const multipleChoiceModels = require("./models/question-types/multiple-choice");
const trueFalseModels = require("./models/question-types/true-false");
const shortAnswerModels = require("./models/question-types/short-answer");
const uploadModels = require("./models/question-types/upload");
const email = require("./providers/email");

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

// Importing the question factory and the engine used for checking Upload question answers.
const questionFactory = require("./providers/questionFactory");
const checkUploadAnswer = require("./file-engine/check-upload-answer");

// Importing the user routes and the engine used for checking authentication.
const userRoutes = require("./routes/user");
const checkAuth = require("../backend/middleware/check-auth");

// Importing built in email module
const nodemailer = require('nodemailer');
// ******************************************************** //
// ***********   DATABASE COLLECTION OBJECTS   ************ //
// ******************************************************** //
const questionCollections = require("./models/question");
const categoryCollection = require("./models/shared/category");
const archiveCategory = require('./models/shared/category-archive');
const assessmentCollection = require("./models/assessment");
const archiveAssessmentCollection = require("./models/assessment-archive");
const studentCollection = require("./models/student");
const questionCollection = questionCollections.questions;
const archiveCollection = questionCollections.archive;
const takenAssessmentCollection = require("./models/taken-assessment");
const Constants = require("./providers/constants");

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
mongoose.connect('mongodb+srv://expressApp:Ohi6uDbGMZLBt56X@cluster0-bomls.mongodb.net/bitsDemo?retryWrites=true&w=majority',
  { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }).then(() => {
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
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  response.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, DELETE, PATCH, OPTIONS"
  );
  next();
});

// Runs our file-engine logic to extract and examine submitted files
app.post("/api/assessment/checkUpload", (request, response, next) => {

  // The question object to check.
  const question = request.body;
  const result = checkUploadAnswer.checkUploadAnswer(question);

  // Send message message back to front end.
  response.status(200).json({
    result: result
  });
});

// *********************************************************** //
// ******   ARCHIVE: ASSESSMENT FROM ASSESSMENT COLLECTION *** //
// *********************************************************** //
app.post("/api/assessment/delete", checkAuth, (request, response, next) => {
  const assessment = request.body;

  // Create archived model for the assessment
  const assessmentToArchive = new archiveAssessmentCollection({
    _id: assessment._id,
    name: assessment.name,
    description: assessment.description,
    config: assessment.config,
    questionIds: assessment.questionIds,
    status: assessment.status,
    modifiedOn: new Date(Date.now())
  });

  // Save the archive model to the archive assessment collection
  assessmentToArchive.save().then(() => {
    // get the id of the original assessment to find and delete from assessment collection
    const objectId = mongoose.Types.ObjectId(assessment._id);

    // pass the original assessment to the delete function
    deleteById('assessments', { _id: objectId }, function (resp, error) {
      if (error) {
        console.log('ERROR', error.message);
        response.status(400).json({
          message: error.message
        })
      }
      else {
        response.status(200).json({
          message: 'assessment archived successfully!'
        });
      }
    });
  },
    error => {
      console.log('ERROR', error.message);
      response.status(400).json({
        message: error.message
      })
    });
});

// *********************************************************** //
// ******   ARCHIVE: CATEGORY FROM CATEGORY COLLECTION *** //
// *********************************************************** //
app.post("/api/category/delete", checkAuth, (request, response, next) => {
  const category = request.body;

  // Create archived model for the category
  const categoryToArchive = new archiveCategory({
    _id: category._id,
    name: category.name,
    modifiedOn: new Date(Date.now())
  });

  // Save the archive model to the archive category collection
  categoryToArchive.save().then(() => {
    // get the id of the original category
    const objectId = mongoose.Types.ObjectId(category._id);

    // pass the original category to the delete function
    deleteById('categories', { _id: objectId }, function (resp, error) {
      if (error) {
        console.log('ERROR', error.message);
        response.status(400).json({
          message: error.message
        })
      }
      else {
        response.status(200).json({
          message: 'category archived successfully!'
        });
      }
    });
  },
    error => {
      console.log('ERROR', error.message);
      response.status(400).json({
        message: error.message
      })
    });
});

// *********************************************************** //
// ******   ARCHIVE: QUESTION FROM QUESTION COLLECTION   ****** //
// *********************************************************** //
app.post("/api/question/delete", checkAuth, (request, response, next) => {
  // Request.body is the question that is passed through.
  const question = request.body;

  // Will store the converted object to be archived.
  let questionObjectToArchive;

  // Call to question type factory which creates the object to archive
  questionObjectToArchive = questionFactory.createQuestionTypeFactory(question, 'archive');

  // Attach categories to question before archiving.
  questionObjectToArchive.categories = question.categories;

  // Attach points to the question before archiving.
  questionObjectToArchive.points = question.points;

  // Save question to archive collection, delete from questions collection and return success or error message
  questionObjectToArchive.save().then(() => {
    const objectId = mongoose.Types.ObjectId(questionObjectToArchive._id);
    deleteById('questions', { _id: objectId }, function (resp, error) {
      if (error) {
        console.log('ERROR', error.message);
        response.status(400).json({
          message: error.message,
          question: question
        })
      }
      else {
        response.status(200).json({
          message: 'Question archived successfully!'
        });
      }
    });
  },
    error => {
      console.log('ERROR', error.message);
      response.status(400).json({
        message: error.message,
        question: question
      })
    });
});

// ******************************************************** //
// *************   GET: ALL ASSESSMENTS    ***************** //
// ******************************************************** //
app.get("/api/assessments", checkAuth, (request, response, next) => {
  // Get all assessments from the database
  assessmentCollection.find({ _id: { $exists: true } }).then((assessments, error) => {
    response.status(200).json({
      message: 'Assessments fetched successfully!',
      assessments: assessments
    });
  },
    error => {
      console.log('ERROR', error.message);
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
  // Gets an assessment from the database based on the provided ID.
  assessmentCollection.find({ _id: request.params.id }).then((assessment, error) => {
    response.status(200).json({
      message: request.params.id + ' Assessment fetched successfully!',
      assessment: assessment
    });
  },
    error => {
      console.log('ERROR', error.message);
      response.status(400).json({
        message: error.message,
        assessment: null
      })
    })
});

// ******************************************************** //
// **********   GET: FILTERED TAKEN ASSESSMENTS  ********** //
// ******************************************************** //
app.post("/api/filterTakenAssessments/", (request, response, next) => {
  // Gets assessments that have been taken based on provided parameter values.
  const searchParameters = request.body.searchParameters;
  const spArray = [];

  searchParameters.forEach(sp => {
    const regEx = new RegExp(sp);
    spArray.push({ "student.uniqueStudentIdentifier": regEx });
  });

  takenAssessmentCollection.find({ $and: spArray }).then((takenAssessments, error) => {
    if (error) {
      console.log('ERROR', error.message);
    } else {
      response.status(200).json({
        message: 'Student Results fetched successfully!',
        takenAssessments: takenAssessments
      });
    }
  })
  .catch(err => {
    return response.status(202).json({
      message: "No search parameter required."
    });
  });
});

// ******************************************************** //
// *********   GET: SINGLE TAKEN ASSESSMENT BY ID    ************ //
// ******************************************************** //
app.get("/api/assessment/take/:id", (request, response, next) => {
  // Gets an assessment that has been taken based on the provided ID.
  takenAssessmentCollection.find({ _id: request.params.id }).then((takenAssessment, error) => {
    response.status(200).json({
      message: request.params.id + ' Assessment fetched successfully!',
      takenAssessment: takenAssessment
    });
  },
    error => {
      console.log('ERROR', error.message);
      response.status(400).json({
        message: error.message,
        takenAssessment: null
      })
    })
});

// ******************************************************** //
// ***************   GET: ALL CATEGORIES  ***************** //
// ******************************************************** //
app.get("/api/categories", checkAuth, (request, response, next) => {

  // Finds all categories by ID
  find('categories', { _id: { $exists: true } }, function (error, categories) {

    // Send a successful response message and an array of categories to work with.
    response.status(200).json({
      message: 'Categories Fetched Successfully!',
      categories: categories
    });
  }, error => {
    // Logs error message.
    // Sends an error status back to requestor.
    // Includes what was pulled for a categories array (if anything)
    console.log('ERROR', error.message);
    response.status(400).json({
      message: error.message,
      categories: categories
    })
  });
});

app.get("/api/category/questions/:id", checkAuth, (request, response, next) => {
  // The category id coming from the front-end
  const categoryId = request.params.id;

  // Converting the categoryId into both a string and ObjectId
  // Mongoose sometimes saves nested document ids differently. This is a known issue on their end
  // Accounting for both the string and ObjectId() takes care of any issues for us
  const idStrings = [categoryId, mongoose.Types.ObjectId(categoryId)];
  find('questions', { categories: { $elemMatch: { _id: {$in: idStrings} } } }, function (error, questions) {
    if (error) {
      throw error;
    }
    // If there are questions that come back, do not delete
    if (questions !== undefined && questions.length > 0) {
       response.status(400).json({
        message: 'Cannot delete category that is attached to questions',
        questions: questions
       });
    }
    // Else, you are ok to delete the category
    else {
      console.log('NO QUESTIONS FOUND. OK TO DELETE CATEGORY');
      response.status(200).json({
        message: 'NO QUESTIONS FOUND. OK TO DELETE CATEGORY',
        questions: null
      });
    }
  });
  });

// ********************************************************** //
// ***************   GET: CATEGORY BY ID   ****************** //
// ********************************************************** //
app.get("/api/category/:id", checkAuth, (request, response, next) => {
  // Gets a category based on the specified ID.
  categoryCollection.find({ _id: request.params.id }).then((category, error) => {
    response.status(200).json({
      message: request.params.id + ' Category fetched successfully!',
      category: category
    });
  },
    error => {
      console.log('ERROR', error.message);
      response.status(400).json({
        message: error.message,
        category: null
      })
    })
});

// ********************************************************** //
// ******   GET: QUESTIONS (ALL) FOR ASSESSMENT USE   ******* //
// ********************************************************** //
app.post("/api/assessment/questions/", (request, response, next) => {
  // Gets all questions used within a specific assessment
  const questionIds = request.body.questionIds;
  const objectIds = [];
  // Turns the string ids into ObjectIds
  if (questionIds !== null && questionIds !== undefined) {
    questionIds.forEach((qId) => { objectIds.push(mongoose.Types.ObjectId(qId)) });
    objectIds;
  }

  // Performs the search
  questionCollection.find({ _id: { $in: objectIds } }, (error, questions) => {
    if (error) {
      console.log('ERROR', error.message);
    }
    else {
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
app.get("/api/questions", checkAuth, (request, response, next) => {
  // Gets all questions that fall under a specific category.

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
            if (organizedQuestions[c.name] !== undefined) {
              // Find the proper category array and push the question
              organizedQuestions[c.name].push(q);
            } else {
              console.log('Add question to sorted list failed: ', q);
              console.log('Question contains a category that does not exist: ', c);
            }
          });
        }
      });

      // Sort questions by date
      for (var category in organizedQuestions) {
        if (Object.prototype.hasOwnProperty.call(organizedQuestions, category)) {
          organizedQuestions[category].sort((a, b) => {
            a = new Date(a.modifiedOn);
            b = new Date(b.modifiedOn);
            return a > b ? -1 : a < b ? 1 : 0;
          })
        }
      }

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
app.get("/api/questions/:questionType", checkAuth, (request, response, next) => {
  // Gets all questions that fall under a specific question type (Multiple Choice, True or False, etc.)
  questionCollection.find({ questionType: request.params.questionType }).then((questions, error) => {
    response.status(200).json({
      message: request.params.questionType + ' Questions fetched successfully!',
      questions: questions
    });
  },
    error => {
      console.log('ERROR', error.message);
      response.status(400).json({
        message: error.message,
        questions: null
      })
    })
});

// ******************************************************** //
// ************   GET: SINGLE QUESTION BY ID  ************* //
// ******************************************************** //
app.get("/api/question/:id", checkAuth, (request, response, next) => {
  // Gets a specific question using a provided ID.
  questionCollection.find({ _id: request.params.id }).then((question, error) => {
    response.status(200).json({
      message: request.params.id + ' Question fetched successfully!',
      question: question
    });
  },
    error => {
      console.log('ERROR', error.message);
      response.status(400).json({
        message: error.message,
        question: null
      })
    })
});

// ************************************************** //
// **************   GET: STUDENT BY ID ************** //
// ************************************************** //
app.get("/api/student/:id", (request, response, next) => {
  // Gets a specific studen using a provided ID.
  studentCollection.find({ _id: request.params.id }).then((student, error) => {
    response.status(200).json({
      message: request.params.id + ' Student fetched successfully!',
      student: student
    });
  },
    error => {
      console.log('ERROR', error.message);
      response.status(400).json({
        message: error.message,
        student: null
      })
    })
});

// *********************************************************** //
// ******   SAVE: ASSESSMENT TO ASSESSMENT COLLECTION   ****** //
// *********************************************************** //
app.post("/api/assessment/save", checkAuth, (request, response, next) => {
  // Saves the provided assessment to the assessment collection.

  // Request.body is the assessment that is passed through.
  const assessment = request.body;

  // Generate unique Id for assessment.
  const assessmentId = mongoose.Types.ObjectId();

  // assigns the unique id to the assessment.
  assessment._id = assessmentId;

  // assessment mapped object from front to back end.
  const assessmentToSaveModel = new assessmentCollection({
    id: assessmentId,
    name: assessment.name,
    description: assessment.description,
    config: assessment.config,
    questionIds: assessment.questionIds,
    status: assessment.status,
    modifiedOn: new Date(Date.now())
  });

  // Saves the assessment object to the database.
  // Returns either 200 success or 400 error
  assessmentToSaveModel.save().then(() => {

    // Send success message back to front end.
    // Will probably use for logging later.
    response.status(200).json({
      message: 'Assessment saved successfully!',
      assessment: assessment
    });
  },
    error => {
      console.log('ERROR', error.message);
      response.status(400).json({
        message: error.message,
        assessment: assessment
      })
    });
});

// ******************************************************* //
// ******   SAVE: CATEGORY TO CATEGORY COLLECTION   ****** //
// ******************************************************* //
app.post("/api/categories/save", checkAuth, (request, response, next) => {
  // Saves the provided category to the category collection.

  // Request.body is the category that is passed through.
  const category = request.body;

  // Generate unique Id for category.
  const categoryId = mongoose.Types.ObjectId();

  category._id = categoryId;

  // category mapped object from front to back end.
  const categoryToSaveModel = new categoryCollection({
    id: categoryId,
    name: category.name,
    modifiedOn: new Date(Date.now())
  });

  // Saves the category object to the database.
  // Returns either 200 success or 400 error
  categoryToSaveModel.save().then(() => {

    // Send success message back to front end.
    // Will probably use for logging later.
    response.status(200).json({
      message: 'Category saved successfully!',
      category: category
    });
  },
    error => {
      console.log('ERROR', error.message);
      response.status(400).json({
        message: error.message,
        category: category
      })
    });
});

// ******************************************************* //
// ******   SAVE: QUESTION TO QUESTION COLLECTION   ****** //
// ******************************************************* //
app.post("/api/question/save", checkAuth, (request, response, next) => {
  // Saves the provided question to the question collection.

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

  // Attach indication if question was answered correctly before saving.
  questionObjectToSave.isAnsweredCorrectly = question.isAnsweredCorrectly;

  // Saves the object to the database.
  // Returns either 200 success or 400 error
  questionObjectToSave.save().then(() => {

    // Send success message back to front end.
    // Will probably use for logging later.
    response.status(200).json({
      message: 'Question saved successfully!',
      question: question
    });
  },
    error => {
      console.log('ERROR', error.message);
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
  // Saves the provided student to the student collection.

  // First check to validate if student already exists using uniqueStudentIdentifier
  studentCollection.findOne({ uniqueStudentIdentifier: request.body.uniqueStudentIdentifier })
    .then(studentFound => {
      // If the student doesn't currently exist, then pass to database to be saved
      if (studentFound === null) {
        // Request.body is the student that is passed through.
        const student = request.body;

        // student mapped object from front to back end.
        const studentToSaveModel = new studentCollection({
          uniqueStudentIdentifier: student.uniqueStudentIdentifier,
          studentId: student.studentId,
          firstName: student.firstName,
          lastName: student.lastName,
          dateOfBirth: student.dateOfBirth,
          campusLocation: student.campusLocation,
          lastAssessmentDate: student.lastAssessmentDate,
          previousScores: student.previousScores,
          modifiedOn: new Date(Date.now())
        });

        // Saves the student object to the database.
        // Returns either 200 success or 400 error
        studentToSaveModel.save().then(() => {

          // Send success message back to front end return for attaching to taken assessment.
          // Will probably use for logging later.
          response.status(200).json({
            message: 'Student saved successfully!',
            student: studentToSaveModel // The new student record to be passed back to front end
          });
        },
          error => {
            console.log('ERROR', error.message);
            response.status(400).json({
              message: error.message,
              student: Object
            })
          });
      } else {
        // If student already exists, simply return the student for attaching to taken assessment.
        response.status(200).json({
          message: 'Student found successfully!',
          student: studentFound // Returns the student found in the database.
        });
      }
    });
});

// *************************************************************************** //
// ******   GENERATE: TAKEN ASSESSMENT IN TAKEN ASSESSMENT COLLECTION   ****** //
// *************************************************************************** //
// This will create the Taken Assessment record with only an assessment attached
app.post("/api/assessment/generate", (request, response, next) => {
  // Creates a taken assessment object and stores it in the assessment collection.

  // Request.body is the taken assessment that is passed through.
  const takenAssessment = request.body;

  // Generate unique Id for taken assessment.
  const takenAssessmentId = mongoose.Types.ObjectId();

  // assigns the unique id to the taken assessment.
  takenAssessment._id = takenAssessmentId;

  // taken assessment mapped object from front to back end.
  const takenAssessmentToSaveModel = new takenAssessmentCollection({
    id: takenAssessmentId,
    assessment: takenAssessment.assessment,
    student: takenAssessment.student,
    questions: takenAssessment.questions,
    score: takenAssessment.score,
    studentPassed: takenAssessment.studentPassed,
    modifiedOn: new Date(Date.now())
  });

  // Saves the assessment object to the database.
  // Returns either 200 success or 400 error
  takenAssessmentToSaveModel.save().then((takenAssessment) => {

    // Send success message back to front end.
    // Will probably use for logging later.
    response.status(200).json({
      message: 'Assessment saved successfully!',
      takenAssessmentId: takenAssessment._id // Returns the id for generating an assessment url on front end
    });
  },
    error => {
      console.log('ERROR', error.message);
      response.status(400).json({
        message: error.message,
        takenAssessmentId: takenAssessment._id
      })
    });
});

// ******************************************************** //
// ***********   UPDATE ASSESSMENT COLLECTION   ************* //
// ******************************************************** //
app.post("/api/assessment/update/", checkAuth, (request, response, next) => {
  // Updates the assessment collection.

  // Gets the assessment passed from the front end
  // Stores data for updating backend properties
  const requestedUpdate = request.body;

  console.log(requestedUpdate.questionIds);
  // Stores the updated assessment data
  const update = {
    id: requestedUpdate._id,
    name: requestedUpdate.name,
    description: requestedUpdate.description,
    config: requestedUpdate.config,
    questionIds: requestedUpdate.questionIds,
    status: requestedUpdate.status,
    modifiedOn: new Date(Date.now())
  };

  // passes the data to the database to update a specific assessment by id
  mongoose.connection.db.collection('assessments').updateOne({ _id: mongoose.Types.ObjectId(requestedUpdate._id.toString()) }, { $set: update }, { upsert: true }, function (error, updatedAssessment) {

    // Send a successful response message
    response.status(200).json({
      message: 'updatedAssessment Fetched Successfully!',
      updatedAssessment: updatedAssessment
    });
  }, error => {
    // Logs error message.
    // Sends an error status back to requestor.
    // Includes what was pulled for a categories array (if anything)
    console.log('ERROR', error.message);
    response.status(400).json({
      message: error.message,
      updatedAssessment: updatedAssessment
    })
  });
});

// ******************************************************** //
// ***********   UPDATE CATEGORY COLLECTION   ************* //
// ******************************************************** //
app.post("/api/category/update", checkAuth, (request, response, next) => {
  const requestedUpdate = request.body;
  console.log('Update Id Type: ', requestedUpdate._id);
  mongoose.connection.db.collection('categories').updateOne({ _id: mongoose.Types.ObjectId(requestedUpdate._id) }, { $set: { name: requestedUpdate.name } }, function (error, updatedCategory) {
    updateQuestionCategories(requestedUpdate);
    // Send a successful response message and an array of categories to work with.
    response.status(200).json({
      message: updatedCategory.name + ' updated successfully!',
      updatedCategory: updatedCategory
    });
  }, error => {
    // Logs error message.
    // Sends an error status back to requestor.
    // Includes what was pulled for a categories array (if anything)
    console.log('ERROR', error.message);
    response.status(400).json({
      message: error.message,
      updatedCategory: updatedCategory
    })
  });
});

// ******************************************************** //
// ***********   UPDATE QUESTION COLLECTION   ************* //
// ******************************************************** //
app.post("/api/question/update/", checkAuth, (request, response, next) => {
  // Updates the question collection.

  // Gets the question passed from the front end
  // Stores data for updating backend properties
  const requestedUpdate = request.body;

  // Sends the data to the question factory to edit the properties for a specific question type
  // Stores the data in a question object
  const update = questionFactory.editQuestionFactory(requestedUpdate);

  // passes the data to the database to update a specific question by id
  mongoose.connection.db.collection('questions').updateOne({ _id: mongoose.Types.ObjectId(requestedUpdate._id.toString()) }, { $set: update }, { upsert: true }, function (error, updatedQuestion) {

    // Send a successful response message.
    response.status(200).json({
      message: 'updatedQuestion Fetched Successfully!',
      updatedQuestion: updatedQuestion
    });
  }, error => {
    // Logs error message.
    // Sends an error status back to requestor.
    // Includes what was pulled for a question array (if anything)
    console.log('ERROR', error.message);
    response.status(400).json({
      message: error.message,
      updatedQuestion: updatedQuestion
    })
  });
});

// ******************************************************** //
// ************   UPDATE STUDENT COLLECTION   ************* //
// ******************************************************** //
app.post("/api/student/update/", (request, response, next) => {
  // Updates the student collection.

  // Gets the student passed from the front end
  // Stores data for updating backend properties
  const requestedUpdate = request.body;

  // Stores the updated student data
  const update = {
    id: requestedUpdate._id,
    uniqueStudentIdentifier: requestedUpdate.uniqueStudentIdentifier,
    studentId: requestedUpdate.studentId,
    campusLocation: requestedUpdate.campusLocation,
    firstName: requestedUpdate.firstName,
    lastName: requestedUpdate.lastName,
    dateOfBirth: requestedUpdate.dateOfBirth,
    lastAssessmentDate: requestedUpdate.lastAssessmentDate,
    previousScores: requestedUpdate.previousScores,
    modifiedOn: new Date(Date.now())
  };

  // passes the data to the database to update a specific student by id
  mongoose.connection.db.collection('students').updateOne({ _id: mongoose.Types.ObjectId(requestedUpdate._id.toString()) }, { $set: update }, { upsert: true }, function (error, updatedStudent) {
    // sends the updates to the taken assessments to update student data there as well.
    updateTakenAssessmentStudents(requestedUpdate);

    // Send a successful response message
    response.status(200).json({
      message: 'updated Student Fetched Successfully!',
      updatedStudent: updatedStudent
    });
  }, error => {
    // Logs error message.
    // Sends an error status back to requestor.
    // Includes what was pulled for a student (if anything)
    console.log('ERROR', error.message);
    response.status(400).json({
      message: error.message,
      updatedStudent: updatedStudent
    })
  });
});

// ******************************************************** //
// ********   UPDATE TAKEN ASSESSMENT COLLECTION   ******** //
// ******************************************************** //
app.post("/api/assessment/updateTaken", (request, response, next) => {
  // Updates the taken assessment collection.

  // Gets the assessment passed from the front end
  // Stores data for updating backend properties
  const requestedUpdate = request.body;

  // Stores the updated taken assessment data
  const update = {
    // id: requestedUpdate._id,
    assessment: requestedUpdate.assessment,
    student: requestedUpdate.student,
    questions: requestedUpdate.questions,
    score: requestedUpdate.score,
    studentPassed: requestedUpdate.studentPassed,
    modifiedOn: new Date(Date.now())
  };

  // passes the data to the database to update a specific assessment by id
  mongoose.connection.db.collection('takenAssessments').updateOne({ _id: mongoose.Types.ObjectId(requestedUpdate._id.toString()) }, { $set: update }, { upsert: true }, function (error, updatedTakenAssessment) {

    // If the assessment has been taken
    if (requestedUpdate.studentPassed !== null) {
      email.sendEmailOfResults(requestedUpdate);
    }

    // Send a successful response message
    response.status(200).json({
      message: 'updatedAssessment Fetched Successfully!',
      updatedAssessment: updatedTakenAssessment
    });
  }, error => {
    // Logs error message.
    // Sends an error status back to requestor.
    // Includes what was pulled for a categories array (if anything)
    console.log('ERROR', error.message);
    response.status(400).json({
      message: error.message,
      updatedAssessment: updatedTakenAssessment
    })
  });
});

// *********************************************************** //
// *****************   GENERIC FUNCTIONS   ******************* //
// *********************************************************** //
// Used for when we can't target a specific model.
function find(name, query, callBack) {
  // Finds a specific model based on the object's name.
  mongoose.connection.db.collection(name, function (error, collection) {
    collection.find(query).toArray(callBack);
  });
}

// Deletes an object from a collection
function deleteById(name, query, callBack) {
  // Finds and deletes a model based on the object's ID.
  mongoose.connection.db.collection(name, function (error, collection) {
    collection.deleteOne(query).then(callBack);
  });
}

// Updates all questions that have the updated category with the updated name
function updateQuestionCategories(updatedCategory) {
  const idStrings = [updatedCategory._id, mongoose.Types.ObjectId(updatedCategory._id)];
  mongoose.connection.db.collection('questions').updateMany({ categories: { $elemMatch: { _id: {$in: idStrings} } } }, { $set: { "categories.$.name": updatedCategory.name } });
}

// Updates all taken assessments student data when the student collection document is updated.
function updateTakenAssessmentStudents(updatedStudent) {
  mongoose.connection.db.collection('takenAssessments')
    .updateMany({ "student._id": { $eq: updatedStudent._id } },
      {
        $set: {
          "student.uniqueStudentIdentifier": updatedStudent.uniqueStudentIdentifier,
          "student.studentId": updatedStudent.studentId,
          "student.firstName": updatedStudent.firstName,
          "student.lastName": updatedStudent.lastName,
          "student.dateOfBirth": updatedStudent.dateOfBirth,
          "student.campusLocation": updatedStudent.campusLocation,
          "student.lastAssessmentDate": updatedStudent.lastAssessmentDate,
          "student.previousScores": updatedStudent.previousScores
        }
      });
}

// use the user routes for login functions
app.use("/api/user", userRoutes);

// Exports the contstants and all of the middlewares attached to it.
module.exports = app;
