const cookieParser = require("cookie-parser");
const express = require("express");
const app = express();
const router = require("./routes/index");
const PORT = 3000;

app.use(express.json());
app.use(cookieParser());
app.use("/", router);

app.listen(PORT, () => {
  console.log(PORT, "포트로 서버가 열렸습니다");
});
