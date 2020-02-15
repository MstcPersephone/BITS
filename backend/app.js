// express.js package
const express = require('express');

const app = express();

// setup for question api
app.use("/api/questions", (request, response, next) => {
  const questions = [
    {
      id: "123",
      questionText: "How are you?",
      name: "Essay-Test",
      questionType: "ESSAY",
      hasAttachments: false,
      attachments: null,
      isAnswered: false,
      duration: 2,
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
      duration: 2
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
      duration: 3
    },
    {
      id: "789",
      name: "TF-Test",
      questionText: "Earth is bigger than the sun.",
      questionType: "True_False",
      hasAttachments: false,
      attachments: null,
      isAnswered: false,
      duration: 1,
      answer: false
    }
  ];
  response.json({
    questions: questions
  });
});

// Exports the contstants and all of the middlewares attached to it.
module.exports = app;
