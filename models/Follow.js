const mongoose = require("mongoose");

const { Schema } = mongoose;
const FollowSchema = new Schema(
  {
    followed: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    follower: {
      type: Schema.Types.ObjectId,
      ref: "User"
    }
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at"
    }
  }
);
const Follow = mongoose.model("Follow", FollowSchema);
module.exports = Follow;