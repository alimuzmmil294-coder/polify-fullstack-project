import EmptyState from "../components/EmptyState";

export default function Voted() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Voted</h1>
      <p className="text-[var(--color-text-muted)] mb-6">Polls you've cast a vote on.</p>
      <EmptyState
        icon="check"
        title="You haven't voted yet"
        subtitle="Head to the dashboard and share your opinion on a poll."
        ctaLabel="Explore polls"
        ctaTo="/"
      />
    </div>
  );
}
