import Post from "../models/postModel.js";
import User from "../models/userModel.js";
import type { Request, Response } from "express";

export async function search(req: any, res: any) {
  const { q = "" } = req.query;

  const users = await User.find({
    $or: [
      { name: { $regex: q, $options: "i" } },
      { email: { $regex: q, $options: "i" } },
    ],
  })
    .select("name email avatarUrl bio")
    .limit(20);

  const hashtagQuery = q.startsWith("#")
    ? q.toLowerCase()
    : `#${q.toLowerCase()}`;

  const posts = await Post.find({
    $or: [
      { content: { $regex: q, $options: "i" } },
      { hashtags: hashtagQuery },
    ],
  })
    .populate("author", "name avatarUrl")
    .sort({ createdAt: -1 })
    .limit(20);

  return res.json({ users, posts });
}
