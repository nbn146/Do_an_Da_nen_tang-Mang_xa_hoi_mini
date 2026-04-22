import { Notification } from "../models/Notification.js";

export async function getMyNotifications(req, res) {
  const notifications = await Notification.find({ recipient: req.userId })
    .populate("actor", "name avatarUrl")
    .populate("post", "content")
    .sort({ createdAt: -1 });

  return res.json(notifications);
}

export async function markAsRead(req, res) {
  const { notificationId } = req.params;

  const notification = await Notification.findOneAndUpdate(
    { _id: notificationId, recipient: req.userId },
    { isRead: true },
    { new: true },
  );

  if (!notification)
    return res.status(404).json({ message: "Notification not found" });
  return res.json(notification);
}
