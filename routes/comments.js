const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth-middleware");
const { Comments } = require("../models");

// 댓글작성 API
router.post("/:postId", authMiddleware, async (req, res) => {
  const { postId } = req.params;
  const { userId, nickname } = res.locals.user;
  const { comment } = req.body;
  try {
    if (!comment) {
      res.status(400).send({ message: "내용을 작성해 주세요" });
    }
    const comments = new Comments({ postId, userId, nickname, ...req.body });
    await comments.save();
    return res.status(200).send({ message: "댓글을 작성했습니다." });
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

// 댓글목록조회 API
router.get("/:postId", async (req, res) => {
  const { postId } = req.params;
  try {
    const comment = await Comments.findAll({
      attributes: { exclude: ["postId"] },
      where: { postId },
      order: [["createdAt", "DESC"]],
    });
    return res.send({ comment });
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

// 댓글수정 API
router.put("/:commentId", authMiddleware, async (req, res) => {
  const { commentId } = req.params;
  const { comment } = req.body;
  const { userId } = res.locals.user;

  const id = await Comments.findOne({ where: { commentId } });

  try {
    if (id.userId == res.locals.user.userId) {
      const comments = await Comments.update(
        { comment },
        { where: { commentId } }
      );
      res.status(200).send({ message: "댓글을 수정했습니다." });
    } else {
      res.status(400).send({ message: "댓글 수정 권한이 없습니다." });
    }
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

// 댓글삭제 API
router.delete("/:commentId", authMiddleware, async (req, res) => {
  const { commentId } = req.params;

  const id = await Comments.findOne({ where: { commentId } });
  try {
    if (id.userId == res.locals.user.userId) {
      const commentDelete = await Comments.destroy({ where: { commentId } });
      res.status(200).send({ message: "댓글을 삭제했습니다." });
    } else {
      res.status(400).send({ message: "댓글을 삭제할 권한이 없습니다." });
    }
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

module.exports = router;
