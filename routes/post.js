const express = require("express");
const router = express.Router();

const Post = require("../models/Post");
const User = require("../models/User");
const Follow = require("../models/Follow");
const mongoose = require("mongoose");

router.post("/:username/new", async (req, res, next) => {
  const { username } = req.params;
  const { text, university, post_id } = req.body;
  try {
    const user = await User.find({ username });
    console.log(user[0].username);
    const post = await Post.create({
      username: user[0]._id,
      text,
      formUni: university,
      commented_to: post_id
    });
    res.json({
      status: 200,
      post
    });
  } catch (error) {
    next(error);
  }
});
router.get("/detail/:postId", async (req, res, next) => {
  const { postId } = req.params;
  try {
    const postDetail = await Post.findById(postId).populate("username");
    const postComments = await Post.find({commented_to: postId }).populate("username").sort("-created_at");;
    res.json({postDetail, postComments});
  } catch (error) {
    console.log(error);
  }
});
router.get("/all", async (req, res, next) => {
  const username = req.session.currentUser;
  console.log(username);
  try {
    const followsId = await Follow.find(
      { follower: username._id },
      "followed -_id"
    );
    const arr = followsId.map(elem => elem.followed);
    const post = await Post.find({
      $or: [{ username: arr }, { formUni: arr }, { username: username._id }]
    })
      .populate("username")
      .populate("formUni")
      .sort("-created_at");
    res.json(post);
  } catch (error) {
    next(error);
  }
});
router.get("/:postId/:username/like", async (req, res, next) => {
  const { postId, username } = req.params;
  try {
    const user = await User.find({ username });
    const like = await Post.findByIdAndUpdate(postId, {
      $push: { likes: user[0]._id }
    }, { new: true }).populate("username");
    console.log(like);
    res.json(like);
  } catch (error) {
    next(error);
  }
});
router.get("/:postId/:username/unlike", async (req, res, next) => {
  const { postId, username } = req.params;
  try {
    const user = await User.find({ username });
    const like = await Post.findByIdAndUpdate(postId, {
      $pull: { likes: user[0]._id }
    },{ new: true }).populate("username");
    res.json(like);
  } catch (error) {
    next(error);
  }
});

module.exports = router;