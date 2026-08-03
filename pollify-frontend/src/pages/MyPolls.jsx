import EmptyState from "../components/EmptyState";

export default function MyPolls() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">My Polls</h1>
      <p className="text-[var(--color-text-muted)] mb-6">Polls you've created.</p>
      <EmptyState
        icon="edit"
        title="No polls yet"
        subtitle="Create your first poll and see how the community responds."
        ctaLabel="Create a poll"
        ctaTo="/create"
      />
    </div>
  );
}
