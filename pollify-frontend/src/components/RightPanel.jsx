import { useNavigate } from "react-router-dom";
import Icon from "./Icon";
import { pollTypeStats } from "../data/mockData";
import { useAuth } from "../context/AuthContext";

export default function RightPanel() {
  const { user, email } = useAuth();
  const navigate = useNavigate();
  const maxValue = Math.max(...pollTypeStats.map((s) => s.value));

  return (
    <aside className="hidden xl:flex w-80 shrink-0 flex-col gap-6 py-6 pl-6 pr-2 sticky top-0 h-screen overflow-y-auto">
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 flex flex-col items-center text-center">
        <p className="bg-gradient-to-br from-[var(--color-brand)] to-[var(--color-brand-dim)] flex justify-center items-center w-9 h-9 rounded-full object-cover border border-[var(--color-border-light)]">
          {email?.charAt(0)?.toUpperCase() || "U"}
        </p>
        <p className="font-semibold text-base">{user?.name}</p>
        <p className="text-xs text-[var(--color-text-faint)] mb-4 truncate max-w-full">
          {user?.handle}
        </p>

        <div className="grid grid-cols-3 gap-2 w-full mb-4">
          {[
            { label: "Created", value: user?.created },
            { label: "Voted", value: user?.voted },
            { label: "Saved", value: user?.saved },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="text-lg font-bold">{stat.value}</p>
              <p className="text-[10px] uppercase tracking-wide text-[var(--color-text-faint)]">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        <button
          onClick={() => navigate("/settings")}
          className="w-full text-sm font-medium border border-[var(--color-border-light)] rounded-lg py-2 hover:bg-[var(--color-surface-hover)] transition-colors focus-ring"
        >
          View profile
        </button>
      </div>

      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6">
        <p className="flex items-center gap-2 text-xs font-semibold text-[var(--color-text-faint)] tracking-widest mb-4">
          <Icon name="up" size={13} className="text-[var(--color-brand)]" />
          POLL TYPES
        </p>
        <div className="flex flex-col gap-4">
          {pollTypeStats.map((stat) => (
            <div key={stat.label}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
                  <Icon name={stat.icon} size={14} />
                  {stat.label}
                </span>
                <span className="text-sm font-semibold">{stat.value}</span>
              </div>
              <div className="h-1.5 rounded-full bg-[var(--color-border)] overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${(stat.value / maxValue) * 100}%`,
                    backgroundColor: stat.color,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
