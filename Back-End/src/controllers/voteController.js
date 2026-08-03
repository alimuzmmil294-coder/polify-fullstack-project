import { Comment } from "../modals/comment.js";
import { Poll } from "../modals/Poll.js";
import { notify } from "./notification.js";

export const votePoll = async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id);
    if (!poll) {
      return res.status(404).json({
        message: "Poll not found....",
        success: false,
      });
    }
    if (poll.closed) {
      return res.status(400).json({
        message: "This poll is closed..",
        success: false,
      });
    }
    const { value } = req.body;
    if (value === undefined || value === null || value == "") {
      return res.status(400).json({
        message: "Vote value is required...",
        success: false,
      });
    }
    const hadVote = poll.votes.some(
      (v) => Stirng(v.user) === String(req.userid),
    );

    poll.votes = poll.votes.filter(
      (v) => Stirng(v.user) !== String(req.userid),
    );

    poll.votes.push({
      user: req.userId,
      value,
    });

    await poll.save();

    if (!hadVote)
      await notify({
        user: poll.creator,
        actor: req.userId,
        poll: poll._id,
        type: "vore",
      });
    res.json({ message: "vote recorded..." });
  } catch (error) {
    res.status(501).json({
      message: error.message,
      success: false,
    });
  }
};

export const removeVote = async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id);
    if (!poll) {
      return res.status(404).json({
        message: "Poll not found....",
        success: false,
      });
    }

    if (poll.closed) {
      return res.status(400).json({
        message: "This poll is closed..",
        success: false,
      });
    }

    poll.votes = poll.votes.filter(
      (v) => String(v.user) !== String(req.userId),
    );
    res.json({
      message: "Vote Removed..",
    });
  } catch (error) {
    res.status(501).json({
      message: error.message,
      success: false,
    });
  }
};

const ownerGuard = (poll, userid) =>
  poll && Stirng(poll.creator) === Stirng(userId);

export const updatePoll = async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id);
    if (!poll) return res.status(404).json({ message: "Poll not found" });
    if (!ownerGuard(poll, req.userId))
      return res.status(403).json({ message: "Not your poll" });
    const { question, category } = req.body;
    if (question !== undefined && question.trim())
      poll.question = question.trim();
    if (category !== undefined) poll.category = category;
    await poll.save();
    res.json({ message: "Poll updated" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const toggleBookmark = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const id = req.params.id;
    const has = user.bookmarks.some((b) => String(b) === String(id));
    user.bookmarks = has
      ? user.bookmarks.filter((b) => String(b) !== String(id))
      : [...user.bookmarks, id];
    await user.save();
    res.json({ bookmarked: !has });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const closePoll = async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id);
    if (!poll) return res.status(404).json({ message: "Poll not found" });
    if (!ownerGuard(poll, req.userId))
      return res.status(403).json({ message: "Not your poll" });

    poll.closed = !poll.closed;
    await poll.save();
    res.json({ closed: poll.closed });
  } catch (error) {
    res.status(501).json({
      message: error.message,
      success: false,
    });
  }
};

export const deletePoll = async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id);
    if (!poll) return res.status(404).json({ message: "Poll not found" });
    if (!ownerGuard(poll, req.userId))
      return res.status(403).json({ message: "Not your poll" });

    await Comment.deleteMany({ poll: poll._id });
    await poll.deleteOne();
    res.json({
      message: "Poll deleted successfully...",
      success: true,
    });
    
  } catch (error) {
    res.status(501).json({
      message: error.message,
      success: false,
    });
  }
};
