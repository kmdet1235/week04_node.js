const express = require("express");
const router = express.Router();
const app = express();
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const { Op } = require("sequelize");
const authMiddleware = require("../middlewares/auth-middleware");
const { Users } = require("../models");

//회원가입 API
router.post("/signup", async (req, res) => {
  const { nickname, password, confirm } = req.body;

  if (password !== confirm) {
    res
      .status(400)
      .send({ errormessage: "패스워드가 패스워드 확인과 일치하지 않습니다." });
    return;
  }
  try {
    const existUser = await Users.findOne({
      where: { nickname },
    });

    if (existUser) {
      res.status(400).send({ errormessage: "중복된 닉네임 입니다." });
      return;
    }
    await Users.create({ nickname, password });
    res.status(201).send({ message: "회원 가입에 성공Hat습니다." });
  } catch (err) {
    res.status(400).send({ errormessage: "다른 비밀번호를 사용해주세요!" });
  }
});

//로그인 API
router.post("/login", async (req, res) => {
  const { nickname, password } = req.body;
  try {
    const user = await Users.findOne({ where: { nickname } });

    if (!user || password !== user.password) {
      // password는 number이고, user.password는 string이라 형변환 맞춰줄 필요가 있음
      // || password !== user.password
      res
        .status(400)
        .send({ errorMessage: "닉네임 또는 패스워드를 확인해주세요." });
      return;
    }
    const token = jwt.sign({ userId: user.userId }, "customized-secret-key");
    res.cookie("token", token);
    res.send({
      token,
    });
  } catch (err) {
    res.status(400).send({ errorMessage: "로그인에 실패했습니다." });
  }
});

router.get("/login/me", authMiddleware, async (req, res) => {
  res.send({ user: res.locals.user });
});

app.use(express.urlencoded({ extended: false }), router);

module.exports = router;
