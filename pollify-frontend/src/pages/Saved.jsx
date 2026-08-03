import EmptyState from "../components/EmptyState";

export default function Saved() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Saved</h1>
      <p className="text-[var(--color-text-muted)] mb-6">Polls you've bookmarked for later.</p>
      <EmptyState
        icon="bookmark"
        title="Nothing saved yet"
        subtitle="Tap the bookmark icon on any poll to save it here."
        ctaLabel="Explore polls"
        ctaTo="/"
      />
    </div>
  );
}
