import { Comment } from "../modals/comment.js";
import { Poll } from "../modals/Poll.js";
import { notify } from "./notification.js";

// import { Poll } from "../modals/Poll.js";
// import { notify } from "./notification.js";

export const votePoll = async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id);
    if (!poll) {
      return res.status(404).json({
        message: "Poll not found.",
        success: false,
      });
    }

    if (poll.closed) {
      return res.status(400).json({
        message: "This poll is closed.",
        success: false,
      });
    }

    // Accepts either optionId or value from body
    const { value, optionId } = req.body;
    const voteChoice = optionId || value;

    if (!voteChoice) {
      return res.status(400).json({
        message: "Vote value or optionId is required.",
        success: false,
      });
    }

    const userId = req.userId || req.user?._id || req.user?.id;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized: User identification missing.",
        success: false,
      });
    }

    // Check if user previously voted
    const existingVoteIndex = poll.votes.findIndex(
      (v) => String(v.user) === String(userId),
    );
    const hadVote = existingVoteIndex !== -1;

    if (hadVote) {
      // Decrement vote count on previous option if present
      const prevOptionId =
        poll.votes[existingVoteIndex].option ||
        poll.votes[existingVoteIndex].value;
      const prevOpt = poll.options.find(
        (o) => String(o._id || o.id) === String(prevOptionId),
      );
      if (prevOpt && prevOpt.votes > 0) {
        prevOpt.votes -= 1;
      }
      // Remove previous vote entry
      poll.votes.splice(existingVoteIndex, 1);
    }

    // Add new vote entry
    poll.votes.push({
      user: userId,
      option: voteChoice,
      value: voteChoice,
    });

    // Increment vote count on selected option
    const targetOpt = poll.options.find(
      (o) => String(o._id || o.id) === String(voteChoice),
    );
    if (targetOpt) {
      targetOpt.votes = (targetOpt.votes || 0) + 1;
    }

    await poll.save();

    // Trigger notification if first-time vote on someone else's poll
    if (!hadVote && String(poll.creator) !== String(userId)) {
      await notify({
        user: poll.creator,
        actor: userId,
        poll: poll._id,
        type: "vote",
      }).catch((err) => console.error("Notification Error:", err));
    }

    return res.json({
      success: true,
      message: "Vote recorded successfully.",
      poll,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Server error processing vote.",
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
  poll && String(poll.creator) === String(userId);

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
