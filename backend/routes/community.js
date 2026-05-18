const express = require("express");
const Post = require("../models/Post");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/posts", async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "username email")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: "게시글 조회 실패", error });
  }
});

router.post("/posts", authMiddleware, async (req, res) => {
  try {
    const { title, content, category } = req.body;

    const newPost = new Post({
      title,
      content,
      category,
      author: req.user.userId
    });

    await newPost.save();

    res.status(201).json({
      message: "게시글 작성 성공",
      post: newPost
    });
  } catch (error) {
    res.status(500).json({ message: "게시글 작성 실패", error });
  }
});

router.post("/posts/:id/like", authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "게시글을 찾을 수 없습니다." });
    }

    post.likes += 1;
    await post.save();

    res.json({
      message: "좋아요 성공",
      likes: post.likes
    });
  } catch (error) {
    res.status(500).json({ message: "좋아요 실패", error });
  }
});

router.post("/posts/:id/comments", authMiddleware, async (req, res) => {
  try {
    const { text } = req.body;

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "게시글을 찾을 수 없습니다." });
    }

    post.comments.push({
      text,
      username: req.user.username
    });

    await post.save();

    res.json({
      message: "댓글 작성 성공",
      comments: post.comments
    });
  } catch (error) {
    res.status(500).json({ message: "댓글 작성 실패", error });
  }
});

module.exports = router;