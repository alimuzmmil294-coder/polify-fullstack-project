import { useNavigate } from "react-router-dom";
import Icon from "./Icon";

export default function EmptyState({ icon, title, subtitle, ctaLabel, ctaTo }) {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center text-center py-24 border border-dashed border-[var(--color-border-light)] rounded-2xl">
      <div className="w-14 h-14 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-center mb-4">
        <Icon name={icon} size={22} className="text-[var(--color-text-faint)]" />
      </div>
      <p className="font-semibold mb-1">{title}</p>
      <p className="text-sm text-[var(--color-text-faint)] max-w-xs mb-6">{subtitle}</p>
      {ctaLabel && (
        <button
          onClick={() => navigate(ctaTo)}
          className="bg-[var(--color-brand)] text-black text-sm font-semibold px-4 py-2 rounded-lg hover:bg-[var(--color-brand-dim)] transition-colors focus-ring"
        >
          {ctaLabel}
        </button>
      )}
    </div>
  );
}
