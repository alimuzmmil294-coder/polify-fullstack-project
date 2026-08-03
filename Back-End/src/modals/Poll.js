import mongoose from "mongoose";
// If you need helper functions from pollHelpers.js in this model, import them like this:
// import { yourHelperFunction } from "../utils/pollHelpers.js";

const voteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    value: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const Vote = mongoose.model("Vote", voteSchema);

const pollSchema = new mongoose.Schema(
  {
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    question: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["single", "yesno", "rating", "image", "open"],
      required: true,
    },
    options: [
      {
        text: String,
        image: String,
      },
    ],
    category: {
      type: String,
      default: "General",
      trim: true,
    },
    closed: {
      type: Boolean,
      default: false,
    },
    views: {
      type: Number,
      default: 0,
    },
    votes: [voteSchema],
  },
  {
    timestamps: true, // Added timestamps to track when polls are created/updated
  },
);

export const Poll = mongoose.model("Poll", pollSchema);
