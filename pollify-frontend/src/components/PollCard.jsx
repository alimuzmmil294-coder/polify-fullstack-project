import { useState } from "react";
import Icon from "./Icon";

const avatarColors = [
  "#10b981", "#38bdf8", "#a78bfa", "#f59e0b", "#f472b6", "#f87171",
];

function colorFor(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return avatarColors[Math.abs(hash) % avatarColors.length];
}

export default function PollCard({ poll }) {
  const [votedId, setVotedId] = useState(null);
  const [options, setOptions] = useState(poll.options);
  const [upvoted, setUpvoted] = useState(false);
  const [upvotes, setUpvotes] = useState(poll.upvotes);
  const [saved, setSaved] = useState(false);

  const totalVotes = options.reduce((sum, o) => sum + o.votes, 0);

  function vote(id) {
    if (votedId) return;
    setVotedId(id);
    setOptions((prev) =>
      prev.map((o) => (o.id === id ? { ...o, votes: o.votes + 1 } : o))
    );
  }

  function toggleUpvote() {
    setUpvoted((v) => !v);
    setUpvotes((v) => (upvoted ? v - 1 : v + 1));
  }

  return (
    <article className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-5 hover:border-[var(--color-border-light)] transition-colors">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-black"
            style={{ backgroundColor: colorFor(poll.author) }}
          >
            {poll.author.charAt(0)}
          </div>
          <p className="text-sm">
            <span className="font-semibold">{poll.author}</span>
            <span className="text-[var(--color-text-faint)]"> - {poll.handle} - {poll.time}</span>
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
        <RatingPoll />
      ) : (
        <div className="flex flex-col gap-2 mb-4">
          {options.map((opt) => {
            const pct = totalVotes ? Math.round((opt.votes / totalVotes) * 100) : 0;
            const isVoted = votedId === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => vote(opt.id)}
                className={`relative w-full text-left overflow-hidden rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors focus-ring ${
                  votedId
                    ? "border-[var(--color-border)]"
                    : "border-[var(--color-border)] hover:border-[var(--color-brand)]/50 hover:bg-[var(--color-surface-hover)]"
                } ${isVoted ? "border-[var(--color-brand)]" : ""}`}
              >
                {votedId && (
                  <div
                    className="absolute inset-y-0 left-0 bg-[var(--color-brand)]/10"
                    style={{ width: `${pct}%` }}
                  />
                )}
                <span className="relative flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    {poll.type === "yesno" ? (
                      <Icon
                        name={opt.id === "yes" ? "check" : "logout"}
                        size={14}
                        className={opt.id === "yes" ? "text-[var(--color-brand)]" : "text-red-400"}
                      />
                    ) : (
                      <span className="w-5 h-5 rounded-full bg-[var(--color-border-light)] flex items-center justify-center text-[10px] font-bold">
                        {opt.id.toUpperCase().slice(0, 1)}
                      </span>
                    )}
                    {opt.label}
                  </span>
                  {votedId && <span className="text-[var(--color-text-muted)]">{pct}%</span>}
                </span>
              </button>
            );
          })}
        </div>
      )}

      <div className="flex items-center gap-5 pt-1 text-[var(--color-text-muted)]">
        <button
          onClick={toggleUpvote}
          className={`flex items-center gap-1.5 text-sm font-medium transition-colors focus-ring rounded-md px-1 ${
            upvoted ? "text-[var(--color-brand)]" : "hover:text-[var(--color-text)]"
          }`}
        >
          <Icon name="up" size={15} />
          {upvotes}
        </button>
        <button className="flex items-center gap-1.5 text-sm font-medium hover:text-[var(--color-text)] transition-colors focus-ring rounded-md px-1">
          <Icon name="message" size={15} />
          {poll.comments}
        </button>
        <button
          onClick={() => setSaved((s) => !s)}
          className={`flex items-center gap-1.5 text-sm font-medium transition-colors focus-ring rounded-md px-1 ${
            saved ? "text-[var(--color-brand)]" : "hover:text-[var(--color-text)]"
          }`}
        >
          <Icon name="bookmark" size={15} />
          {poll.saves + (saved ? 1 : 0)}
        </button>
        <button className="ml-auto flex items-center gap-1.5 text-sm font-medium hover:text-[var(--color-text)] transition-colors focus-ring rounded-md px-1">
          <Icon name="share" size={15} />
        </button>
      </div>
    </article>
  );
}

function RatingPoll() {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  return (
    <div className="flex items-center gap-1.5 mb-4">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          onClick={() => setRating(n)}
          onMouseEnter={() => setHover(n)}
          onMouseLeave={() => setHover(0)}
          className="focus-ring rounded"
          aria-label={`Rate ${n}`}
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
        <span className="ml-2 text-sm text-[var(--color-text-muted)]">You rated {rating}/5</span>
      )}
    </div>
  );
}
