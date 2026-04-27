import { Comment } from "../models/Comment.js";
import { Notification } from "../models/Notification.js";
import { Post } from "../models/Post.js";
import { emitNotification } from "../services/socketService.js";

function extractHashtags(text) {
  const matches = text.match(/#[a-zA-Z0-9_]+/g) || [];
  return [...new Set(matches.map((t) => t.toLowerCase()))];
}

export async function createPost(req, res) {
  const { content } = req.body;
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : "";

  const post = await Post.create({
    author: req.userId,
    content,
    imageUrl,
    hashtags: extractHashtags(content),
  });

  const populated = await Post.findById(post._id).populate(
    "author",
    "name email avatarUrl",
  );
  return res.status(201).json(populated);
}

export async function getNewsfeed(req, res) {
  const posts = await Post.find()
    .sort({ createdAt: -1 })
    .populate("author", "name email avatarUrl")
    .lean();

  const postIds = posts.map((p) => p._id);
  const comments = await Comment.find({ post: { $in: postIds } })
    .populate("user", "name avatarUrl")
    .sort({ createdAt: 1 })
    .lean();

  const commentsByPost = comments.reduce((acc, c) => {
    const key = String(c.post);
    if (!acc[key]) acc[key] = [];
    acc[key].push(c);
    return acc;
  }, {});

  const merged = posts.map((post) => ({
    ...post,
    comments: commentsByPost[String(post._id)] || [],
  }));

  return res.json(merged);
}

export async function reactToPost(req, res) {
  const { postId } = req.params;
  const { type = "like" } = req.body; // type: like, love, haha, wow, sad, angry
  const validTypes = ["like", "love", "haha", "wow", "sad", "angry"];

  if (!validTypes.includes(type)) {
    return res.status(400).json({ message: "Invalid reaction type" });
  }

  const post = await Post.findById(postId);
  if (!post) return res.status(404).json({ message: "Post not found" });

  const existingReactionIndex = post.reactions.findIndex(
    (r) => String(r.user) === String(req.userId),
  );

  let action = ""; // "added", "updated", or "removed"

  if (existingReactionIndex !== -1) {

    if (post.reactions[existingReactionIndex].type === type) {

      post.reactions.splice(existingReactionIndex, 1);
      action = "removed";
    } else {

      post.reactions[existingReactionIndex].type = type;
      action = "updated";
    }
  } else {

    post.reactions.push({ user: req.userId, type });
    action = "added";

    if (String(post.author) !== String(req.userId)) {
      const notification = await Notification.create({
        recipient: post.author,
        actor: req.userId,
        post: post._id,
        type: "reaction",
        message: `Someone reacted with ${type} to your post`,
      });
      emitNotification(post.author, notification);
    }
  }

  await post.save();
  return res.json({
    reactionsCount: post.reactions.length,
    reactions: post.reactions,
    action
  });
}
export async function commentPost(req, res) {
  const { postId } = req.params;
  const { text } = req.body;

  const post = await Post.findById(postId);
  if (!post) return res.status(404).json({ message: "Post not found" });

  const comment = await Comment.create({
    post: postId,
    user: req.userId,
    text,
  });
  const populated = await Comment.findById(comment._id).populate(
    "user",
    "name avatarUrl",
  );

  if (String(post.author) !== String(req.userId)) {
    const notification = await Notification.create({
      recipient: post.author,
      actor: req.userId,
      post: post._id,
      type: "comment",
      message: "Someone commented on your post",
    });
    emitNotification(post.author, notification);
  }

  return res.status(201).json(populated);
}
