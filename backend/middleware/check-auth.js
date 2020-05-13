const jwt = require("jsonwebtoken");

module.exports = (request, response, next) => {
  try {
    const token = request.headers.authorization.split(" ")[1];
    jwt.verify(token, 'this_is_a_secret_but_its_no_secret_this_application_was_built_by_the_fine_people_of_team_persephone_Janet_Derek_Orion_and_Tegan');
    next();
  } catch (error) {
    response.status(401).json({ message: "Auth failed!" });
  }

};
