import { uploadToCloudinary } from "../configs/cloudinary.js";
import { User } from "../modals/authModal.js";
import { Poll } from "../modals/Poll.js";
import { Comment } from "../modals/Comment.js";
import mongoose from "mongoose";
import { shapePoll } from "../utils/pollShape.js";

const POP = ["creator", "name username avatar"];

// Helper function to resolve the missing 'withCounts' reference
const withCounts = async (polls) => {
  if (!polls || !polls.length) return [];

  const pollIds = polls.map((p) => p._id);
  const commentCounts = await Comment.aggregate([
    { $match: { poll: { $in: pollIds } } },
    { $group: { _id: "$poll", count: { $sum: 1 } } },
  ]);

  const countMap = commentCounts.reduce((acc, curr) => {
    acc[curr._id.toString()] = curr.count;
    return acc;
  }, {});

  return polls.map((p) => ({
    ...p,
    commentsCount: countMap[p._id.toString()] || 0,
  }));
};

const bookmarkSet = async (userId) => {
  const me = await User.findById(userId).select("bookmarks");
  return new Set((me?.bookmarks || []).map(String));
};

export const createPoll = async (req, res) => {
  try {
    const { question, category, type } = req.body;

    if (!question || !type) {
      return res.status(400).json({
        message: "Question and Type are required.",
        success: false,
      });
    }

    let options = [];
    if (type === "yesno") {
      options = [{ text: "Yes" }, { text: "No" }];
    } else if (type === "single") {
      const parsed =
        typeof req.body.options === "string"
          ? JSON.parse(req.body.options || "[]")
          : req.body.options || [];

      options = parsed
        .filter((t) => t && t.trim())
        .map((t) => ({ text: t.trim() }));
      if (options.length < 2)
        return res
          .status(400)
          .json({ message: "Add at least 2 options", success: false });
    } else if (type === "image") {
      if (!req.files || req.files.length < 2)
        return res
          .status(400)
          .json({ message: "Add at least 2 images", success: false });
      const urls = await Promise.all(
        req.files.map((f) => uploadToCloudinary(f.buffer)),
      );
      options = urls.map((image) => ({ image, text: "" }));
    }

    const poll = await Poll.create({
      creator: req.userId,
      question,
      type,
      category,
      options,
    });

    res.status(201).json({ success: true, poll });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Server error",
      success: false,
    });
  }
};

const sendList = async (filter, req, res) => {
  const polls = await Poll.find(filter)
    .populate(...POP)
    .sort("-createdAt");

  const set = await bookmarkSet(req.userId);
  const shaped = polls.map((p) => shapePoll(p, req.userId, set));
  res.json(await withCounts(shaped));
};

export const listPolls = async (req, res) => {
  try {
    const filter = {};

    if (req.query.type && req.query.type !== "all")
      filter.type = req.query.type;
    if (req.query.category) filter.category = req.query.category;
    if (req.query.feed === "following") {
      const me = await User.findById(req.userId).select("following");
      filter.creator = { $in: me?.following || [] };
    }
    await sendList(filter, req, res);
  } catch (error) {
    res.status(500).json({
      message: error.message || "Internal server error.",
      success: false,
    });
  }
};

export const getMyPolls = async (req, res) => {
  try {
    const userId = req.userId || req.user?._id || req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User ID not found in request context",
      });
    }
    const creatorId = new mongoose.Types.ObjectId(userId);
    await sendList({ creator: creatorId }, req, res);
  } catch (error) {
    res.status(500).json({
      message: error.message || "Internal server error.",
      success: false,
    });
  }
};

export const getVotedPolls = async (req, res) => {
  try {
    const userId = req.userId || req.user?._id || req.user?.id;
    await sendList({ "votes.user": userId }, req, res);
  } catch (error) {
    res.status(500).json({
      message: error.message || "Internal server error.",
      success: false,
    });
  }
};

export const getBookmarks = async (req, res) => {
  try {
    const me = await User.findById(req.userId).populate({
      path: "bookmarks",
      populate: { path: "creator", select: "name username avatar" },
    });

    const set = new Set((me?.bookmarks || []).map((p) => String(p._id)));
    const shaped = (me?.bookmarks || []).map((p) =>
      shapePoll(p, req.userId, set),
    );

    res.json(await withCounts(shaped));
  } catch (error) {
    res.status(500).json({
      message: error.message || "Internal server error.",
      success: false,
    });
  }
};

export const getTrending = async (req, res) => {
  try {
    const types = ["single", "yesno", "rating", "image", "open"];
    const counts = await Promise.all(
      types.map((t) => Poll.countDocuments({ type: t })),
    );

    res.json(
      types.map((t, i) => ({
        type: t,
        count: counts[i],
      })),
    );
  } catch (error) {
    res.status(500).json({
      message: error.message || "Internal server error.",
      success: false,
    });
  }
};

export const getPoll = async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id).populate(...POP);
    if (!poll)
      return res
        .status(404)
        .json({ message: "Poll not found", success: false });

    const creatorId = poll.creator?._id || poll.creator;
    const isCreator = String(creatorId) === String(req.userId);
    const skipView = req.query.noview === "true";

    if (!isCreator && !skipView) {
      poll.views = (poll.views || 0) + 1;
      await poll.save();
    }

    const set = await bookmarkSet(req.userId);
    const [shaped] = await withCounts([shapePoll(poll, req.userId, set)]);
    res.json(shaped);
  } catch (err) {
    res.status(500).json({ message: err.message, success: false });
  }
};

export const getPollAnalytics = async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id).populate(...POP);
    if (!poll) {
      return res.status(404).json({
        message: "Poll not found.",
        success: false,
      });
    }

    if (String(poll.creator._id) !== String(req.userId)) {
      return res.status(403).json({
        message: "Not authorized to view analytics for this poll.",
        success: false,
      });
    }
    const set = await bookmarkSet(req.userId);
    const shaped = shapePoll(poll, req.userId, set);

    const comments = await Comment.countDocuments({ poll: poll._id });
    res.json({ poll: shaped, comments });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Internal server error.",
      success: false,
    });
  }
};
