import { useNavigate } from "react-router-dom";
import Icon from "./Icon";
import { useAuth } from "../context/AuthContext";

export default function TopBar() {
  const navigate = useNavigate();
  const { user, email } = useAuth();

  return (
    <header className="sticky top-0 z-10 flex items-center gap-4 border-b border-[var(--color-border)] bg-[var(--color-bg)]/90 backdrop-blur px-4 lg:px-8 py-4">
      <div className="flex-1 max-w-xl">
        <div className="flex items-center gap-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg px-3 py-2">
          <Icon
            name="search"
            size={16}
            className=" text-[var(--color-text-faint)]"
          />
          <input
            type="text"
            placeholder="Search polls..."
            className="bg-transparent outline-none text-sm w-full placeholder:text-[var(--color-text-faint)]"
          />
        </div>
      </div>

      <div className="ml-auto flex items-center gap-3">
        <button
          onClick={() => navigate("/create")}
          className="hidden sm:flex items-center gap-1.5 bg-[var(--color-brand)] text-black text-sm font-semibold px-4 py-2 rounded-lg hover:bg-[var(--color-brand-dim)] transition-colors focus-ring"
        >
          <Icon name="plus" size={16} strokeWidth={2.5} />
          Create
        </button>
        <button
          className="w-9 h-9 flex items-center justify-center rounded-lg border border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-hover)] transition-colors focus-ring"
          aria-label="Notifications"
        >
          <Icon name="bell" size={17} />
        </button>
        <button
          onClick={() => navigate("/settings")}
          className="focus-ring rounded-full"
        >
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt={user?.name || email || "User"}
              className="w-9 h-9 rounded-full object-cover border border-[var(--color-border-light)]"
            />
          ) : (
            <p className="bg-gradient-to-br from-[var(--color-brand)] to-[var(--color-brand-dim)] flex justify-center items-center w-9 h-9 rounded-full object-cover border border-[var(--color-border-light)]">
              {email?.charAt(0)?.toUpperCase() || "U"}
            </p>
          )}
        </button>
      </div>
    </header>
  );
}
