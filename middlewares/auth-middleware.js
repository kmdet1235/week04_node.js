const jwt = require("jsonwebtoken");
const { Users } = require("../models");

module.exports = (req, res, next) => {
  const { token } = req.cookies;
  // const { authorization } = req.headers;
  // const [authType, authToken] = (authorization || "").split(" ");

  // if (!authToken || authType !== "Bearer") {
  //   res.status(401).send({
  //     errorMessage: "로그인 후 이용가능한 기능입니다.",
  //   });
  //   return;
  // }
  if (!token) {
    res.status(400).send({ errorMessage: "로그인 후 이용가능한 기능입니다." });
  }
  console.log(jwt.verify(token, "customized-secret-key"));
  // try {
  const { userId } = jwt.verify(token, "customized-secret-key");
  Users.findByPk(userId).then((user) => {
    res.locals.user = user;
    next();
  });
  // } catch (err) {
  // res.status(401).send({
  //   errorMessage: err.errorMessage,
  // });
  // }
};
