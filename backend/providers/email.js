// Importing built-in email module and constants collection.
const nodemailer = require('nodemailer');
const Constants = require("./constants");

// Sends an email containing the student's results.
const sendEmailOfResults = (takenAssessment) => {
  console.log('SENDING EMAIL');

  // Creates the transporter object, defining the mail service and the user authentication details.
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'mstc.assessment.engine@gmail.com',
      pass: 'wf2-)7MmXJ>_)&AK'
    }
  });

  // Subject
  const subjectText = takenAssessment.student.firstName + ' ' + takenAssessment.student.lastName + '\'s ' + takenAssessment.assessment.name + ' Results';

  // Body
  let body = 'Score: ' + takenAssessment.score + '% \n';
  const studentPassedToString = takenAssessment.studentPassed ? 'True \n' : 'False \n';
  body += 'Passed: ' + studentPassedToString;

  // get dateTaken value
  const modifiedOn = new Date(takenAssessment.modifiedOn);
  const dateTaken = formatDateTaken(modifiedOn);

  // Add to Body
  body += 'Date Taken: ' + dateTaken;

  // Creates the mailOptions object, containing the sender information, the recipient, the subject text and the body text.
  const mailOptions = {
    from: 'derekkandler@gmail.com',
    to: getEmailAddress(takenAssessment.student.campusLocation),
    subject: subjectText,
    text: body
  }

  // Sends the email to the recipient.
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent successfully: ' + info.response);
    }
  })
}

// Gets the appropriate email address via backend/providers/constants.js
function getEmailAddress(campusLocation) {
  switch (campusLocation) {
    case 'Wisconsin Rapids':
      return Constants.EmailTestResults.WisconsinRapids;
    case 'Stevens Point':
      return Constants.EmailTestResults.StevensPoint;
  }
}

// Formats the date an assessment is taken
function formatDateTaken(date) {
  const dateTaken = new Date(date);
  const month = addZeroIfNeeded(dateTaken.getMonth() + 1);
  const day = addZeroIfNeeded(dateTaken.getDate());
  const year = dateTaken.getFullYear();

  return month + '/' + day + '/' + year;
}

// Adds a zero to month or day if value is less than 10
function addZeroIfNeeded(n) {
  return (n < 10) ? '0' + n : n;
}

// Exporting the module.
module.exports = {
  sendEmailOfResults: sendEmailOfResults
}
