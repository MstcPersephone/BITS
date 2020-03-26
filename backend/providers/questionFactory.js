const mongoose = require('mongoose');
// Import questionType mongoose objects for working with questions collection.
const checkBoxModel = require("../models/question-types/checkbox");
const multipleChoiceModel = require("../models/question-types/multiple-choice");
const trueFalseModel = require("../models/question-types/true-false");
const shortAnswerModel = require("../models/question-types/short-answer");
const uploadModel = require("../models/question-types/upload");

//*************************************************************//
//****SWITCH STATEMENT TO FIND THE CORRECT QUESTION BY TYPE****//
//*************************************************************//
const createQuestionTypeFactory = function (question, collectionName) {
  // Switch to internal function that creates object to save.
  switch (question.questionType) {
    case "Checkbox":
      return createMultipleChoice(question, collectionName);

    case "Multiple Choice":
      return createCheckbox(question, collectionName);

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
  }
}

//*************************************//
//*********CHECKBOX OBJECT*************//
//*************************************//
// collectionName is questions unless specified in the call
function createCheckbox(question, collectionName = 'questions') {
  // The questionModel
  let q = null;
  switch (collectionName) {
    case 'questions':
      // Generates an id for each option
      // Assigns question id to each option
      question.options.forEach((x) => {
        x.id = mongoose.Types.ObjectId(),
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
  q.id = question._id;
  q.questionText = question.questionText;
  q.questionType = question.questionType;
  q.options = question.options;
  q.hasAttachments = question.hasAttachments;
  q.attachments = question.attachments;
  q.isAnswered = question.isAnswered;
  q.assessmentIds = question.assessmentIds;
  q.duration = question.duration;
  q.createdOn = Date.now();
  return q;
}

function updateCheckbox(question) {
  // creates an object for updating
  return {
    categories: question.categories,
    questionText: question.questionText,
    questionType: question.questionType,
    options: question.options,
    hasAttachments: question.hasAttachments,
    attachments: question.attachments,
    isAnswered: question.isAnswered,
    assessmentIds: question.assessmentIds,
    duration: question.duration,
    points: question.points,
    isAnsweredCorrectly: question.isAnsweredCorrectly,
    createdOn: question.createdOn
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
        x.id = mongoose.Types.ObjectId(),
          x.questionId = question._id;
      });
      // Set the question model to be the checkbox model
      q = new multipleChoiceModel();
      break;
    case 'archive':
      q = new multipleChoiceArchiveModel();
      break;
  }

    q.id = question._id;
    q.questionText = question.questionText;
    q.questionType = question.questionType;
    q.options = question.options;
    q.hasAttachments = question.hasAttachments;
    q.attachments = question.attachments;
    q.isAnswered = question.isAnswered;
    q.assessmentIds = question.assessmentIds;
    q.duration = question.duration;
    q.createdOn = Date.now();

  return q;
}

function updateMultipleChoice(question) {
  // creates an object for updating
  return {
    categories: question.categories,
    questionText: question.questionText,
    questionType: question.questionType,
    options: question.options,
    hasAttachments: question.hasAttachments,
    attachments: question.attachments,
    isAnswered: question.isAnswered,
    assessmentIds: question.assessmentIds,
    duration: question.duration,
    points: question.points,
    isAnsweredCorrectly: question.isAnsweredCorrectly,
    createdOn: question.createdOn
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
       x.id = mongoose.Types.ObjectId(),
         x.questionId = question._id;
     });
     // Set the question model to be the checkbox model
     q = new shortAnswerModel();
     break;
   case 'archive':
     q = new shortAnswerArchiveModel();
     break;
 }

    q.id = question._id;
    q.questionText = question.questionText;
    q.questionType = question.questionType;
    q.hasAttachments = question.hasAttachments;
    q.attachments = question.attachments;
    q.isAnswered = question.isAnswered;
    q.studentAnswer = question.studentAnswer;
    q.matches = question.matches;
    q.assessmentIds = question.assessmentIds;
    q.isCaseSensitive = question.isCaseSensitive;
    q.duration = question.duration;
    q.createdOn = Date.now();

  return q;
}

function updateShortAnswer(question) {
  // creates an object for updating
  return {
    categories: question.categories,
    questionText: question.questionText,
    questionType: question.questionType,
    hasAttachments: question.hasAttachments,
    attachments: question.attachments,
    isAnswered: question.isAnswered,
    studentAnswer: question.studentAnswer,
    matches: question.matches,
    duration: question.duration,
    points: question.points,
    assessmentIds: question.assessmentIds,
    isCaseSensitive: question.isCaseSensitive,
    isAnsweredCorrectly: question.isAnsweredCorrectly,
    createdOn: question.createdOn
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

    q.id = question._id;
    q.questionText = question.questionText;
    q.questionType = question.questionType;
    q.hasAttachments = question.hasAttachments;
    q.attachments = question.attachments;
    q.isAnswered = question.isAnswered;
    q.studentAnswer = question.studentAnswer;
    q.answer = question.answer;
    q.assessmentIds = question.assessmentIds;
    q.duration = question.duration;
    q.createdOn = Date.now();

  return q;
}

function updateTrueFalse(question) {
  return {
    categories: question.categories,
    questionText: question.questionText,
    questionType: question.questionType,
    hasAttachments: question.hasAttachments,
    attachments: question.attachments,
    isAnswered: question.isAnswered,
    answer: question.answer,
    studentAnswer: question.studentAnswer,
    duration: question.duration,
    points: question.points,
    assessmentIds: question.assessmentIds,
    isAnsweredCorrectly: question.isAnsweredCorrectly,
    createdOn: question.createdOn
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

    q.id = question._id;
    q.questionText = question.questionText;
    q.questionType = question.questionType;
    q.hasAttachments = question.hasAttachments;
    q.attachments = question.attachments;
    q.isAnswered = question.isAnswered;
    q.correctAnswer = question.correctAnswer;
    q.submittedAnswer = question.submittedAnswer;
    q.assessmentIds = question.assessmentIds;
    q.duration = question.duration;
    q.createdOn = Date.now();

  return q;
}

// Exports the question object with all properties attached to it.
module.exports = {createQuestionTypeFactory, editQuestionFactory};
