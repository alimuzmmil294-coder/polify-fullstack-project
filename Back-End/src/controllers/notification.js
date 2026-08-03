import { Notification } from "../modals/notification.js";

export const notify = async ({ user, actor, poll, type }) => {
  if (!user || String(user) === String(actor)) return;

  try {
    await Notification.create({ user, actor, poll, type });
  } catch (error) {}
};

export const getNotification = async (req, res) => {
  try {
    const items = await Notification.find({ user: req.userId })
      .populate("actor", "name username avatar")
      .populate("poll", "question")
      .sort("-createdAt")
      .limit(20);
    const unread = await Notification.countDocuments({
      user: req.userId,
      read: false,
    });

    res.json({ items, unread });
  } catch (error) {
    res.status(501).json({
      message: error.message || "Internal server error",
      success: false,
    });
  }
};

export const markRead = async (req, res) => {
  try {
    await Notification.updateMany(
      {
        user: req.userId,
        read: false,
      },
      {
        read: true,
      },
    );

    res.json({ ok: true });
  } catch (error) {
    res.status(501).json({
      message: error.message || "Internal server error",
      success: false,
    });
  }
};
