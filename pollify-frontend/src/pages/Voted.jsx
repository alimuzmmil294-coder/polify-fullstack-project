import { useEffect, useState } from "react";
import PollCard from "../components/PollCard";
import EmptyState from "../components/EmptyState";
import { useAuth } from "../context/AuthContext";
import { API_BASE_URL } from "../config.js";

export default function Voted() {
  const { token } = useAuth();
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchVotedPolls() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`${API_BASE_URL}/polls/voted`, {
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        });

        const data = await res.json();

        if (res.ok) {
          // Handles array responses directly or wrapped object formats
          const list = Array.isArray(data) ? data : data.polls || [];
          setPolls(list);
        } else {
          setError(data.message || "Failed to fetch voted polls.");
        }
      } catch (err) {
        console.error("Error fetching voted polls:", err);
        setError("Network error fetching voted polls.");
      } finally {
        setLoading(false);
      }
    }

    fetchVotedPolls();
  }, [token]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px]">
        <div className="w-8 h-8 border-2 border-[var(--color-brand)] border-t-transparent rounded-full animate-spin mb-2" />
        <p className="text-xs text-[var(--color-text-muted)]">
          Loading voted polls...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 text-sm">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-1">Voted</h1>
      <p className="text-[var(--color-text-muted)] mb-6">
        Polls you've cast a vote on.
      </p>

      {polls.length === 0 ? (
        <EmptyState
          icon="check"
          title="You haven't voted yet"
          subtitle="Head to the dashboard and share your opinion on a poll."
          ctaLabel="Explore polls"
          ctaTo="/"
        />
      ) : (
        <div className="flex flex-col gap-4">
          {polls.map((poll) => (
            <PollCard key={poll.id || poll._id} poll={poll} />
          ))}
        </div>
      )}
    </div>
  );
}
