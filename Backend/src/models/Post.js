import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    content: { type: String, required: true, trim: true },
    imageUrl: { type: String, default: "" },
    hashtags: [{ type: String }],
    reactions: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        type: {
          type: String,
          enum: ["like", "love", "haha", "wow", "sad", "angry"],
          default: "like",
        },
      },
    ],
    originalPost: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      default: null,
    },
  },
  { timestamps: true },
);

postSchema.index({ content: "text", hashtags: "text" });

export const Post = mongoose.model("Post", postSchema);
