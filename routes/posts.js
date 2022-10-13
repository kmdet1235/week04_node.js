const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth-middleware");
const { Posts, Likes, sequelize } = require("../models");

// 게시글 작성 API
router.post("/", authMiddleware, async (req, res) => {
  const { userId, nickname } = res.locals.user;
  const { title, content } = req.body;
  try {
    if (typeof title !== "string") {
      res.status(400).send({ errormessage: "제목을 작성해주세요" });
    }
    if (typeof content !== "string") {
      res.status(400).send({ errormessage: "게시글을 작성해 주세요" });
    }
    const post = new Posts({ userId, nickname, ...req.body });
    await post.save();
    return res.send({ message: "게시글 작성에 성공했습니다." });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

// 게시글 조회 API
router.get("/", async (req, res) => {
  try {
    const posts = await Posts.findAll({
      attributes: { exclude: ["content"] },
      order: [["createdAt", "DESC"]],
    });
    return res.send({ posts });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

// 좋아요 게시글 조회 API
router.get("/like", authMiddleware, async (req, res) => {
  const { userId } = res.locals.user;
  const [array] = await sequelize.query(
    "SELECT * FROM Posts JOIN Likes ON Likes.postId = Posts.postId"
  );

  let like = [];
  try {
    for (let i = 0; i < array.length; i++) {
      if (array[i].likes > 0) {
        like.push(array[i]);
      }
      // return like;
    }
    res.send({ like });
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
  // const [all_likes] = await Posts.findAll({
  //   // order: [["createdAt", "DESC"]],
  // });
  // console.log(all_likes);
  // let arr = [];
  // for (let i = 0; i < all_likes.length; i++) {
  //   if (all_likes[i].likes > 0) {
  //     arr.push(all_likes[i]);
  //   }
  // }
  // res.send({ arr });
  // try {
  //   if (Number(all_likes.likes) > 0) {
  //     res.send({ all_likes });
  //   } else {
  //     res.status(400).send({ message: "좋아요한 게시물이 없습니다" });
  //   }
  // } catch (err) {
  //   res.status(400).send({ error: err.message });
  // }
});

// 게시글 상세페이지 API
router.get("/:postId", async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await Posts.findOne({ where: { postId } });
    if (!post) {
      res.status(400).send({ errormessage: "게시글이 존재하지 않습니다." });
    }
    res.send({ post });
  } catch (err) {
    res.status(400).send({ err: err.message });
  }
});

// 게시글 수정 API
router.put("/:postId", authMiddleware, async (req, res) => {
  const { postId } = req.params;
  const { title, content } = req.body;
  const id = await Posts.findOne({ where: { postId } });
  try {
    if (id.userId == res.locals.user.userId) {
      const post = await Posts.update(
        { title, content },
        { where: { postId } }
      );
      res.status(200).send({ message: "게시글을 수정했습니다." });
    } else {
      res.status(400).send({ message: "게시글 수정 권한이 없습니다." });
    }
  } catch (err) {
    res.status(400).send({ err: err.message });
  }
});

// 게시글 삭제 API
router.delete("/:postId", authMiddleware, async (req, res) => {
  const { postId } = req.params;
  const id = await Posts.findOne({ where: { postId } });

  try {
    if (id.userId == res.locals.user.userId) {
      const post = await Posts.destroy({ where: { postId } });
      res.status(200).send({ message: "게시글이 삭제되었습니다." });
    } else {
      res.status(400).send({ message: "게시글 삭제 권한이 없습니다." });
    }
  } catch (err) {
    res.status(400).send({ err: err.message });
  }
});

// 게시글 좋아요 API
router.put("/:postId/like", authMiddleware, async (req, res) => {
  const { postId } = req.params;
  const { userId } = res.locals.user;

  try {
    const push_like = await Likes.findOne({ where: [{ postId }, { userId }] });
    if (!push_like) {
      await Likes.create({ postId, userId });
      await Posts.increment({ likes: 1 }, { where: { postId } });
      res.status(200).send({ message: "게시글의 좋아요를 등록했습니다." });
    } else {
      await Likes.destroy({ where: [{ postId }, { userId }] });
      await Posts.decrement({ likes: 1 }, { where: { postId } });
      res.status(200).send({ message: "좋아요를 취소했습니다." });
    }
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

module.exports = router;
