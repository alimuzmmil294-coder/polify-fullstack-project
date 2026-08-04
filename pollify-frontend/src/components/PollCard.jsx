import { useState } from "react";
import Icon from "./Icon";
import { useAuth } from "../context/AuthContext";

const API_BASE_URL = "http://localhost:3500/api";

const avatarColors = [
  "#10b981",
  "#38bdf8",
  "#a78bfa",
  "#f59e0b",
  "#f472b6",
  "#f87171",
];

function colorFor(name = "User") {
  let hash = 0;
  for (let i = 0; i < name.length; i++)
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return avatarColors[Math.abs(hash) % avatarColors.length];
}

export default function PollCard({ poll }) {
  const { token, user } = useAuth();

  // Safe extraction of author attributes whether string or object
  const authorName =
    typeof poll.author === "string"
      ? poll.author
      : poll.author?.name || "Unknown";
  const authorHandle =
    poll.handle ||
    poll.author?.handle ||
    `@${authorName.toLowerCase().replace(/\s+/g, "")}`;
  const pollTime =
    poll.time ||
    (poll.createdAt
      ? new Date(poll.createdAt).toLocaleDateString()
      : "Just now");

  const [votedId, setVotedId] = useState(poll.userVotedOptionId || null);
  const [options, setOptions] = useState(poll.options || []);
  const [upvoted, setUpvoted] = useState(poll.isUpvoted || false);
  const [upvotes, setUpvotes] = useState(poll.upvotes || 0);
  const [saved, setSaved] = useState(poll.isSaved || false);

  const pollId = poll.id || poll._id;
  const totalVotes = options.reduce((sum, o) => sum + (o.votes || 0), 0);

  // Send vote choice to backend
  async function vote(optionId) {
    if (votedId) return; // Prevent double voting locally

    // Optimistic UI Update
    setVotedId(optionId);
    setOptions((prev) =>
      prev.map((o) => {
        const oId = o.id || o._id;
        return oId === optionId ? { ...o, votes: (o.votes || 0) + 1 } : o;
      }),
    );

    try {
      await fetch(`${API_BASE_URL}/polls/${pollId}/vote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({ optionId, userId: user?.id || user?._id }),
      });
    } catch (err) {
      console.error("Failed to submit vote:", err);
    }
  }

  // Send Upvote toggle to backend
  async function toggleUpvote() {
    const nextUpvoted = !upvoted;
    setUpvoted(nextUpvoted);
    setUpvotes((v) => (nextUpvoted ? v + 1 : v - 1));

    try {
      await fetch(`${API_BASE_URL}/polls/${pollId}/upvote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });
    } catch (err) {
      console.error("Failed to toggle upvote:", err);
    }
  }

  // Save/Bookmark toggle
  async function toggleBookmark() {
    setSaved((s) => !s);
    try {
      await fetch(`${API_BASE_URL}/polls/${pollId}/save`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });
    } catch (err) {
      console.error("Failed to bookmark poll:", err);
    }
  }

  return (
    <article className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-5 hover:border-[var(--color-border-light)] transition-colors">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-black shrink-0"
            style={{ backgroundColor: colorFor(authorName) }}
          >
            {authorName.charAt(0).toUpperCase()}
          </div>
          <p className="text-sm">
            <span className="font-semibold">{authorName}</span>
            <span className="text-[var(--color-text-faint)]">
              {" "}
              - {authorHandle} - {pollTime}
            </span>
          </p>
        </div>
        {poll.tag && (
          <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-[var(--color-warning)]/15 text-[var(--color-warning)]">
            {poll.tag}
          </span>
        )}
      </div>

      <h3 className="font-semibold text-lg mb-4">{poll.question}</h3>

      {poll.type === "rating" ? (
        <RatingPoll pollId={pollId} token={token} />
      ) : (
        <div className="flex flex-col gap-2 mb-4">
          {options.map((opt, idx) => {
            const optId = opt.id || opt._id || idx;
            const pct = totalVotes
              ? Math.round(((opt.votes || 0) / totalVotes) * 100)
              : 0;
            const isVoted = votedId === optId;
            return (
              <button
                key={optId}
                disabled={Boolean(votedId)}
                onClick={() => vote(optId)}
                className={`relative w-full text-left overflow-hidden rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors focus-ring ${
                  votedId
                    ? "border-[var(--color-border)] cursor-default"
                    : "border-[var(--color-border)] hover:border-[var(--color-brand)]/50 hover:bg-[var(--color-surface-hover)]"
                } ${isVoted ? "border-[var(--color-brand)]" : ""}`}
              >
                {votedId ? (
                  <div
                    className="absolute inset-y-0 left-0 bg-[var(--color-brand)]/10 transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                ) : null}
                <span className="relative flex items-center justify-between z-10">
                  <span className="flex items-center gap-2">
                    {poll.type === "yesno" ? (
                      <Icon
                        name={
                          opt.label?.toLowerCase() === "yes" || optId === "yes"
                            ? "check"
                            : "logout"
                        }
                        size={14}
                        className={
                          opt.label?.toLowerCase() === "yes" || optId === "yes"
                            ? "text-[var(--color-brand)]"
                            : "text-red-400"
                        }
                      />
                    ) : (
                      <span className="w-5 h-5 rounded-full bg-[var(--color-border-light)] flex items-center justify-center text-[10px] font-bold">
                        {String.fromCharCode(65 + idx)}
                      </span>
                    )}
                    {opt.label || opt.text}
                  </span>
                  {votedId ? (
                    <span className="text-[var(--color-text-muted)] font-normal">
                      {pct}%
                    </span>
                  ) : null}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Action Footer */}
      <div className="flex items-center gap-5 pt-1 text-[var(--color-text-muted)]">
        <button
          onClick={toggleUpvote}
          className={`flex items-center gap-1.5 text-sm font-medium transition-colors focus-ring rounded-md px-1 ${
            upvoted
              ? "text-[var(--color-brand)]"
              : "hover:text-[var(--color-text)]"
          }`}
        >
          <Icon name="up" size={15} />
          {upvotes}
        </button>
        <button className="flex items-center gap-1.5 text-sm font-medium hover:text-[var(--color-text)] transition-colors focus-ring rounded-md px-1">
          <Icon name="message" size={15} />
          {poll.commentsCount || poll.comments || 0}
        </button>
        <button
          onClick={toggleBookmark}
          className={`flex items-center gap-1.5 text-sm font-medium transition-colors focus-ring rounded-md px-1 ${
            saved
              ? "text-[var(--color-brand)]"
              : "hover:text-[var(--color-text)]"
          }`}
        >
          <Icon name="bookmark" size={15} />
          {(poll.saves || 0) + (saved ? 1 : 0)}
        </button>
        <button className="ml-auto flex items-center gap-1.5 text-sm font-medium hover:text-[var(--color-text)] transition-colors focus-ring rounded-md px-1">
          <Icon name="share" size={15} />
        </button>
      </div>
    </article>
  );
}

function RatingPoll({ pollId, token }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  const handleRate = async (n) => {
    if (rating > 0) return;
    setRating(n);

    try {
      await fetch(`${API_BASE_URL}/polls/${pollId}/rate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({ rating: n }),
      });
    } catch (err) {
      console.error("Failed to rate poll:", err);
    }
  };

  return (
    <div className="flex items-center gap-1.5 mb-4">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          onClick={() => handleRate(n)}
          onMouseEnter={() => setHover(n)}
          onMouseLeave={() => setHover(0)}
          className="focus-ring rounded transition-transform hover:scale-110"
          aria-label={`Rate ${n}`}
          disabled={rating > 0}
        >
          <Icon
            name="star"
            size={26}
            className={
              (hover || rating) >= n
                ? "fill-[var(--color-warning)] text-[var(--color-warning)]"
                : "text-[var(--color-border-light)]"
            }
          />
        </button>
      ))}
      {rating > 0 && (
        <span className="ml-2 text-sm text-[var(--color-text-muted)]">
          You rated {rating}/5
        </span>
      )}
    </div>
  );
}
