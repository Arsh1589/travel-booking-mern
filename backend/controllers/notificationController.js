const Notification = require("../models/Notification");

async function getNotifications(req, res) {
  try {
    const notifications = await Notification.find({ user: req.user.id }).sort({ createdAt: -1 }).limit(20);
    const unreadCount = await Notification.countDocuments({ user: req.user.id, read: false });
    res.status(200).json({ notifications, unreadCount });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

async function markAllRead(req, res) {
  try {
    await Notification.updateMany({ user: req.user.id, read: false }, { read: true });
    res.status(200).json({ message: "All notifications marked as read" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

module.exports = { getNotifications, markAllRead };
