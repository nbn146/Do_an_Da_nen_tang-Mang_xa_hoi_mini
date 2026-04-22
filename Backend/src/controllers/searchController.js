import { Post } from "../models/Post.js";
import { User } from "../models/User.js";

export async function search(req, res) {
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
