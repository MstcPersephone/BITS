const mongoose = require('mongoose');
// Import questionType mongoose objects for working with questions collection.
const checkBoxModels = require("../models/question-types/checkbox");
const multipleChoiceModels = require("../models/question-types/multiple-choice");
const trueFalseModels = require("../models/question-types/true-false");
const shortAnswerModels = require("../models/question-types/short-answer");
const uploadModels = require("../models/question-types/upload");

const checkBoxModel = checkBoxModels.question;
const checkBoxArchiveModel = checkBoxModels.archive;
const multipleChoiceModel = multipleChoiceModels.question;
const multipleChoiceArchiveModel = multipleChoiceModels.archive;
const trueFalseModel = trueFalseModels.question;
const trueFalseArchiveModel = trueFalseModels.archive;
const shortAnswerModel = shortAnswerModels.question;
const shortAnswerArchiveModel = shortAnswerModels.archive;
const uploadModel = uploadModels.question;
const uploadArchiveModel = uploadModels.archive;

const categoryCollection = require("../models/shared/category");


//*************************************************************//
//****SWITCH STATEMENT TO FIND THE CORRECT QUESTION BY TYPE****//
//*************************************************************//
const createQuestionTypeFactory = function (question, collectionName) {
  // Switch to internal function that creates object to save.
  switch (question.questionType) {
    case "Checkbox":
      return createCheckbox(question, collectionName);

    case "Multiple Choice":
      return createMultipleChoice(question, collectionName);

    case "Short Answer":
      return createShortAnswer(question, collectionName);

    case "True False":
      return createTrueFalse(question, collectionName);

    case "Upload":
      return createUpload(question, collectionName);
  }
}

const editQuestionFactory = function (question) {
  // Switch to internal fuction that updates an object.
  switch (question.questionType) {
    case "Checkbox":
      return updateCheckbox(question);
    case "Short Answer":
      return updateShortAnswer(question);
    case "Multiple Choice":
      return updateMultipleChoice(question);
    case "True False":
      return updateTrueFalse(question);
    case "Upload":
      return updateUpload(question);
  }
}

//*************************************//
//*********CHECKBOX OBJECT*************//
//*************************************//
// collectionName is questions unless specified in the call
function createCheckbox(question, collectionName = 'questions') {
  console.log('createCheckbox function hit');
  // The questionModel
  let q = null;
  switch (collectionName) {
    case 'questions':
      // Generates an id for each option
      // Assigns question id to each option
      question.options.forEach((x) => {
        x._id = mongoose.Types.ObjectId(),
          x.questionId = question._id;
      });
      // Set the question model to be the checkbox model
      q = new checkBoxModel();
      break;
    case 'archive':
      q = new checkBoxArchiveModel();
      break;
  }
  // Create Checkbox Model
  q._id = question._id;
  console.log('questionId in function: ', q._id);
  q.questionText = question.questionText;
  q.questionType = question.questionType;
  q.options = question.options;
  q.hasAttachments = question.hasAttachments;
  q.attachments = question.attachments;
  q.isAnswered = question.isAnswered;
  q.duration = question.duration;
  q.modifiedOn = new Date(Date.now());
  return q;
}

function updateCheckbox(question) {

  question.options.forEach((x) => {
    if (x._id === null) {
      x._id = mongoose.Types.ObjectId(),
      x.questionId = question._id;
    }
  });

  // Update categories to convert id strings to ObjectIds
  const categories = updateCategories(question);

  // creates an object for updating
  return {
    categories: categories,
    questionText: question.questionText,
    questionType: question.questionType,
    options: question.options,
    hasAttachments: question.hasAttachments,
    attachments: question.attachments,
    isAnswered: question.isAnswered,
    duration: question.duration,
    points: question.points,
    isAnsweredCorrectly: question.isAnsweredCorrectly,
    modifiedOn: new Date(Date.now())
  }
}

//**********************************************//
//***********MULTIPLE CHOICE OBJECT*************//
//**********************************************//
function createMultipleChoice(question, collectionName = 'questions') {
  let q = null;
  switch (collectionName) {
    case 'questions':
      // Generates an id for each option
      // Assigns question id to each option
      question.options.forEach((x) => {
        x._id = mongoose.Types.ObjectId(),
          x.questionId = question._id;
      });
      // Set the question model to be the checkbox model
      q = new multipleChoiceModel();
      break;
    case 'archive':
      q = new multipleChoiceArchiveModel();
      break;
  }

    q._id = question._id;
    q.questionText = question.questionText;
    q.questionType = question.questionType;
    q.options = question.options;
    q.hasAttachments = question.hasAttachments;
    q.attachments = question.attachments;
    q.isAnswered = question.isAnswered;
    q.duration = question.duration;
    q.modifiedOn = new Date(Date.now());

  return q;
}

function updateMultipleChoice(question) {

  question.options.forEach((x) => {
    if (x._id === null) {
      x._id = mongoose.Types.ObjectId(),
      x.questionId = question._id;
    }
  });

  // Update categories to convert id strings to ObjectIds
  const categories = updateCategories(question);

  // creates an object for updating
  return {
    categories: categories,
    questionText: question.questionText,
    questionType: question.questionType,
    options: question.options,
    hasAttachments: question.hasAttachments,
    attachments: question.attachments,
    isAnswered: question.isAnswered,
    duration: question.duration,
    points: question.points,
    isAnsweredCorrectly: question.isAnsweredCorrectly,
    modifiedOn: new Date(Date.now())
  }
}
//**********************************************//
//*************SHORT ANSWER OBJECT**************//
//**********************************************//
function createShortAnswer(question, collectionName = 'questions') {

 // The questionModel
 let q = null;
 switch (collectionName) {
   case 'questions':
     // Generates an id for each option
     // Assigns question id to each option
     question.matches.forEach((x) => {
       x._id = mongoose.Types.ObjectId(),
         x.questionId = question._id;
     });
     // Set the question model to be the checkbox model
     q = new shortAnswerModel();
     break;
   case 'archive':
     q = new shortAnswerArchiveModel();
     break;
 }

    q._id = question._id;
    q.questionText = question.questionText;
    q.questionType = question.questionType;
    q.hasAttachments = question.hasAttachments;
    q.attachments = question.attachments;
    q.isAnswered = question.isAnswered;
    q.studentAnswer = question.studentAnswer;
    q.matches = question.matches;
    q.isCaseSensitive = question.isCaseSensitive;
    q.duration = question.duration;
    q.modifiedOn = new Date(Date.now());

  return q;
}

function updateShortAnswer(question) {

  question.matches.forEach((x) => {
    if (x._id === null) {
      x._id = mongoose.Types.ObjectId(),
      x.questionId = question._id;
    }
  });

  // Update categories to convert id strings to ObjectIds
  const categories = updateCategories(question);

  // creates an object for updating
  return {
    categories: categories,
    questionText: question.questionText,
    questionType: question.questionType,
    hasAttachments: question.hasAttachments,
    attachments: question.attachments,
    isAnswered: question.isAnswered,
    studentAnswer: question.studentAnswer,
    matches: question.matches,
    duration: question.duration,
    points: question.points,
    isCaseSensitive: question.isCaseSensitive,
    isAnsweredCorrectly: question.isAnsweredCorrectly,
    modifiedOn: new Date(Date.now())
  }
}

//*****************************************//
//***********TRUE/FALSE OBJECT*************//
//*****************************************//
function createTrueFalse(question, collectionName = 'questions') {
  let q = null;

  switch(collectionName) {
    case 'questions':
      q = new trueFalseModel();
      break;
    case 'archive':
      q = new trueFalseArchiveModel();
      break;
  }

    q._id = question._id;
    q.questionText = question.questionText;
    q.questionType = question.questionType;
    q.hasAttachments = question.hasAttachments;
    q.attachments = question.attachments;
    q.isAnswered = question.isAnswered;
    q.studentAnswer = question.studentAnswer;
    q.answer = question.answer;
    q.duration = question.duration;
    q.modifiedOn = new Date(Date.now());

  return q;
}

function updateTrueFalse(question) {

  // Update categories to convert id strings to ObjectIds
  const categories = updateCategories(question);

  return {
    categories: categories,
    questionText: question.questionText,
    questionType: question.questionType,
    hasAttachments: question.hasAttachments,
    attachments: question.attachments,
    isAnswered: question.isAnswered,
    answer: question.answer,
    studentAnswer: question.studentAnswer,
    duration: question.duration,
    points: question.points,
    isAnsweredCorrectly: question.isAnsweredCorrectly,
    modifiedOn: new Date(Date.now())
  }
}
//*************************************//
//***********UPLOAD OBJECT*************//
//*************************************//
function createUpload(question, collectionName = 'questions') {
  let q = null;
  switch (collectionName) {
    case 'questions':
      q = new uploadModel();
      break;
    case 'archive':
      q = new uploadArchiveModel();
      break;
  }

    q._id = question._id;
    q.questionText = question.questionText;
    q.questionType = question.questionType;
    q.hasAttachments = question.hasAttachments;
    q.attachments = question.attachments;
    q.isAnswered = question.isAnswered;
    q.correctAnswer = question.correctAnswer;
    q.submittedAnswer = question.submittedAnswer;
    q.duration = question.duration;
    q.modifiedOn = new Date(Date.now());

  return q;
}

function updateUpload(question) {

  // Update categories to convert id strings to ObjectIds
  const categories = updateCategories(question);

  return {
    categories: categories,
    questionText: question.questionText,
    questionType: question.questionType,
    hasAttachments: question.hasAttachments,
    attachments: question.attachments,
    isAnswered: question.isAnswered,
    correctAnswer: question.correctAnswer,
    submittedAnswer: question.submittedAnswer,
    duration: question.duration,
    points: question.points,
    isAnsweredCorrectly: question.isAnsweredCorrectly,
    modifiedOn: new Date(Date.now())
  }
}

// Translate id strings to ObjectIds
function updateCategories(question) {
  const categories = [];
  question.categories.forEach((c) => {
    const category = new categoryCollection();
    category._id = mongoose.Types.ObjectId(c._id);
    category.name = c.name;
    categories.push(category);
  });

  return categories;
}

// Exports the question object with all properties attached to it.
module.exports = {createQuestionTypeFactory, editQuestionFactory};
