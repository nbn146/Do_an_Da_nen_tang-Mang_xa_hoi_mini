import { Post } from "../models/Post.js";
import { User } from "../models/User.js";

export async function getProfile(req, res) {
  const { userId } = req.params;
  const user = await User.findById(userId).select("-password");
  if (!user) return res.status(404).json({ message: "User not found" });

  const posts = await Post.find({ author: userId }).sort({ createdAt: -1 });
  return res.json({ user, posts });
}

export async function updateMyAvatar(req, res) {
  if (!req.file) {
    return res.status(400).json({ message: "Avatar file is required" });
  }

  const avatarUrl = `/uploads/${req.file.filename}`;
  const user = await User.findByIdAndUpdate(
    req.userId,
    { avatarUrl },
    { new: true },
  ).select("-password");

  return res.json({ user });
}
