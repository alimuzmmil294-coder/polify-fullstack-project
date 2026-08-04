import { useEffect, useMemo, useState } from "react";
import Icon from "../components/Icon";
import PollCard from "../components/PollCard";
import { filterTabs } from "../data/mockData";
import { useAuth } from "../context/AuthContext";

const typeMap = {
  "Yes / No": "yesno",
  "Single Choice": "single",
  Rating: "rating",
  Image: "image",
  "Open Ended": "open",
};

const API_BASE_URL = "http://localhost:3500/api";

export default function Dashboard() {
  const { user, email, token } = useAuth();
  const [tab, setTab] = useState("Explore");
  const [filter, setFilter] = useState("All");
  const [question, setQuestion] = useState("");

  // Data fetching states
  const [polls, setPolls] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPosting, setIsPosting] = useState(false);
  const [error, setError] = useState(null);

  const firstName = user?.name?.split(" ")[0] || "there";

  // 1. FETCH ALL POLLS (GLOBAL FEED)
  useEffect(() => {
    async function fetchAllPolls() {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch all community polls without filtering by user ID
        const response = await fetch(`${API_BASE_URL}/polls`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        });

        if (!response.ok) {
          const errBody = await response.json().catch(() => ({}));
          throw new Error(
            errBody.message ||
              `Error ${response.status}: Failed to fetch polls`,
          );
        }

        const data = await response.json();

        // Flexibly handle array or object wrapper response ({ polls: [...] })
        const pollsList = Array.isArray(data) ? data : data.polls || [];
        setPolls(pollsList);
      } catch (err) {
        console.error("Error fetching polls:", err);
        setError(err.message || "Failed to load polls");
      } finally {
        setIsLoading(false);
      }
    }

    fetchAllPolls();
  }, [token]);

  // 2. CREATE QUICK POLL
  const handleCreateQuickPoll = async (e) => {
    e.preventDefault();
    const trimmedQuestion = question.trim();
    if (!trimmedQuestion || isPosting) return;

    try {
      setIsPosting(true);

      const response = await fetch(`${API_BASE_URL}/polls`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({
          question: trimmedQuestion,
          authorId: user?.id || user?._id,
          type: "single", // Default type for quick creation
        }),
      });

      if (!response.ok) {
        const errBody = await response.json().catch(() => ({}));
        throw new Error(errBody.message || "Failed to post poll");
      }

      const newPoll = await response.json();

      // Prepend newly created poll directly to the global feed state
      setPolls((prev) => [newPoll.poll || newPoll, ...prev]);
      setQuestion("");
    } catch (err) {
      console.error("Failed to create poll:", err);
      alert(err.message || "Could not post your question. Please try again.");
    } finally {
      setIsPosting(false);
    }
  };

  // Filter polls based on active category selection
  const visiblePolls = useMemo(() => {
    if (filter === "All") return polls;
    return polls.filter((p) => p.type === typeMap[filter]);
  }, [polls, filter]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Hey, {firstName}</h1>
      <p className="text-[var(--color-text-muted)] mb-6">
        What's the community thinking today?
      </p>

      {/* Input Box / Quick Post */}
      <form
        onSubmit={handleCreateQuickPoll}
        className="flex items-center gap-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl px-4 py-3 mb-5"
      >
        <p className="bg-gradient-to-br from-[var(--color-brand)] to-[var(--color-brand-dim)] flex justify-center items-center w-9 h-9 rounded-full object-cover border border-[var(--color-border-light)] font-medium text-sm">
          {email?.charAt(0)?.toUpperCase() || "U"}
        </p>
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask the community something..."
          disabled={isPosting}
          className="flex-1 bg-transparent outline-none text-sm placeholder:text-[var(--color-text-faint)] disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={isPosting || !question.trim()}
          className="w-9 h-9 shrink-0 flex items-center justify-center rounded-lg bg-[var(--color-brand)] text-black hover:bg-[var(--color-brand-dim)] transition-colors focus-ring disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Post"
        >
          <Icon name="edit" size={16} />
        </button>
      </form>

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 mb-5">
        {["Explore", "Following"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors focus-ring ${
              tab === t
                ? "bg-[var(--color-surface-hover)] border border-[var(--color-border-light)] text-[var(--color-text)]"
                : "text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
            }`}
          >
            <Icon name={t === "Explore" ? "compass" : "users"} size={15} />
            {t}
          </button>
        ))}
      </div>

      {/* Type Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 mb-6 -mx-1 px-1">
        {filterTabs.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`shrink-0 px-3.5 py-1.5 rounded-lg text-sm font-medium border transition-colors focus-ring ${
              filter === f
                ? "bg-[var(--color-text)] text-black border-[var(--color-text)]"
                : "border-[var(--color-border)] text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)]"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Poll List Area */}
      <div className="flex flex-col gap-4">
        {isLoading ? (
          <div className="text-center py-16 text-[var(--color-text-faint)] text-sm">
            Loading polls...
          </div>
        ) : error ? (
          <div className="text-center py-16 text-red-400 text-sm">{error}</div>
        ) : visiblePolls.length === 0 ? (
          <div className="text-center py-16 text-[var(--color-text-faint)] text-sm">
            No polls found in this category.
          </div>
        ) : (
          visiblePolls.map((poll) => (
            <PollCard key={poll.id || poll._id} poll={poll} />
          ))
        )}
      </div>
    </div>
  );
}
