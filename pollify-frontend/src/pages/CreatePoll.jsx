import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../components/Icon";
import { Plus, Trash2 } from "lucide-react";

const pollTypes = [
  { key: "single", label: "Single Choice", icon: "list" },
  { key: "yesno", label: "Yes / No", icon: "toggle" },
  { key: "rating", label: "Rating", icon: "star" },
  { key: "image", label: "Image", icon: "image" },
  { key: "open", label: "Open Ended", icon: "message" },
];

export default function CreatePoll() {
  const navigate = useNavigate();
  const [type, setType] = useState("single");
  const [question, setQuestion] = useState("");
  const [tag, setTag] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [posted, setPosted] = useState(false);

  function updateOption(i, val) {
    setOptions((prev) => prev.map((o, idx) => (idx === i ? val : o)));
  }

  function addOption() {
    setOptions((prev) => [...prev, ""]);
  }

  function removeOption(i) {
    setOptions((prev) => prev.filter((_, idx) => idx !== i));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setPosted(true);
    setTimeout(() => navigate("/"), 900);
  }

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold mb-1">Create a poll</h1>
      <p className="text-[var(--color-text-muted)] mb-6">
        Ask the community what they think.
      </p>

      <form
        onSubmit={handleSubmit}
        className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 flex flex-col gap-6"
      >
        <div>
          <p className="text-[11px] font-semibold tracking-widest text-[var(--color-text-faint)] mb-3">
            POLL TYPE
          </p>
          <div className="flex flex-wrap gap-2">
            {pollTypes.map((t) => (
              <button
                type="button"
                key={t.key}
                onClick={() => setType(t.key)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium border transition-colors focus-ring ${
                  type === t.key
                    ? "bg-[var(--color-brand)]/10 border-[var(--color-brand)] text-[var(--color-brand)]"
                    : "border-[var(--color-border)] text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)]"
                }`}
              >
                <Icon name={t.icon} size={15} />
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-semibold tracking-widest text-[var(--color-text-faint)] mb-2">
            QUESTION
          </label>
          <input
            required
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="What do you want to ask?"
            className="w-full bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg px-3.5 py-3 text-sm outline-none focus:border-[var(--color-brand)]/60 placeholder:text-[var(--color-text-faint)]"
          />
        </div>

        {(type === "single" || type === "image") && (
          <div>
            <label className="block text-[11px] font-semibold tracking-widest text-[var(--color-text-faint)] mb-2">
              OPTIONS
            </label>
            <div className="flex flex-col gap-2">
              {options.map((opt, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="w-7 h-7 shrink-0 rounded-full bg-[var(--color-border)] flex items-center justify-center text-xs font-bold">
                    {String.fromCharCode(65 + i)}
                  </span>
                  <input
                    value={opt}
                    onChange={(e) => updateOption(i, e.target.value)}
                    placeholder={`Option ${i + 1}`}
                    className="flex-1 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-[var(--color-brand)]/60 placeholder:text-[var(--color-text-faint)]"
                  />
                  {options.length > 2 && (
                    <button
                      type="button"
                      onClick={() => removeOption(i)}
                      className="text-[var(--color-text-faint)] hover:text-red-400 focus-ring rounded p-1"
                      aria-label="Remove option"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addOption}
              className="flex items-center gap-1.5 text-sm font-medium text-[var(--color-brand)] mt-3 hover:underline focus-ring rounded"
            >
              <Plus size={15} />
              Add option
            </button>
          </div>
        )}

        {type === "yesno" && (
          <p className="text-sm text-[var(--color-text-muted)] bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg px-3.5 py-3">
            Voters will choose between <strong className="text-[var(--color-text)]">Yes</strong> and{" "}
            <strong className="text-[var(--color-text)]">No</strong>.
          </p>
        )}
        {type === "rating" && (
          <p className="text-sm text-[var(--color-text-muted)] bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg px-3.5 py-3">
            Voters will rate this on a 1-5 star scale.
          </p>
        )}
        {type === "open" && (
          <p className="text-sm text-[var(--color-text-muted)] bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg px-3.5 py-3">
            Voters will respond with their own free-text answer.
          </p>
        )}

        <div>
          <label className="block text-[11px] font-semibold tracking-widest text-[var(--color-text-faint)] mb-2">
            CATEGORY (OPTIONAL)
          </label>
          <input
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            placeholder="e.g. Sports, Tech, Education"
            className="w-full bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg px-3.5 py-3 text-sm outline-none focus:border-[var(--color-brand)]/60 placeholder:text-[var(--color-text-faint)]"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-[var(--color-brand)] text-black font-semibold rounded-lg py-3 hover:bg-[var(--color-brand-dim)] transition-colors focus-ring disabled:opacity-60"
          disabled={posted}
        >
          {posted ? "Poll posted" : "Post poll"}
        </button>
      </form>
    </div>
  );
}
