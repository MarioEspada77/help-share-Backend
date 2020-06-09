var express = require("express");
var router = express.Router();

const Post = require("../models/Post");
const User = require("../models/User");
const Follow = require("../models/Follow");

router.get("/:followed/:follower/follow", async (req, res, next) => {
  const { followed, follower } = req.params;
  try {
    const userfollowed = await User.find({ username: followed });
    const userWhoFollow = await User.find({ username: follower });
    const follow = await Follow.create({
      followed: userfollowed[0]._id,
      follower: userWhoFollow[0]._id
    });
    res.json(follow);
  } catch (error) {
    next(error);
  }
});

router.get("/:followed/getUsers", async (req, res, next) => {
  const { followed } = req.params;

  try {
    const user = await User.find({ username: followed });
    const userfollowed = await Follow.find({ followed: user[0]._id }).populate(
      "follower"
    );
    res.json(userfollowed);
  } catch (error) {
    next(error);
  }
});
router.get("/:follower/getFollowing", async (req, res, next) => {
  const { follower } = req.params;

  try {
    const user = await User.find({ username: follower });
    const userfollowing = await Follow.find({ follower: user[0]._id }).populate(
      "followed"
    );
    res.json(userfollowing);
  } catch (error) {
    next(error);
  }
});
router.get("/:followId/unfollow", async (req, res, next) => {
  const { followId } = req.params;

  try {
    const unfollow = await Follow.findByIdAndDelete(followId);
    console.log(unfollow);
    res.json(unfollow);
  } catch (error) {
    next(error);
  }
});


module.exports = router;