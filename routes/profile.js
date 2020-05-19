const express = require("express");
const router = express.Router();

const Post = require("../models/Post");
const User = require("../models/User");

router.get("/:username", async (req, res, next) => {
    const { username } = req.params;
    console.log(username);
    try {
      const userProfile = await User.find({ username });
      const posts = await Post.find({
        $or: [{ username: userProfile[0]._id }, { isorganization:userProfile[0]._id  }]}).populate("username").populate("isorganization").sort("-created_at");
      res.json({ userProfile, posts });
    } catch (error) {
      next(error);
    }
  });
module.exports = router;