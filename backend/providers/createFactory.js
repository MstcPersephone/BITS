function createQuestionTypeFactory(question, questionId) {

  // Switch to internal function that creates object to save.
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
}
