import { Link, NavLink, useNavigate } from "react-router-dom";
import Icon from "./Icon";
import { navItems } from "../data/mockData";
import { useAuth } from "../context/AuthContext";

export default function Sidebar() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  return (
    <aside className="hidden lg:flex w-64 shrink-0 flex-col justify-between border-r border-[var(--color-border)] px-4 py-6 h-screen sticky top-0">
      <div>
        <div className="flex items-center gap-2 px-2 mb-8">
          <Link to="/" className="flex gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[var(--color-brand)] flex items-center justify-center">
              <Icon name="up" size={16} className="text-black rotate-45" />
            </div>
            <span className="font-semibold text-lg tracking-tight">
              Pollify
            </span>
          </Link>
        </div>

        <p className="text-[11px] font-semibold text-[var(--color-text-faint)] tracking-widest px-2 mb-2">
          MENU
        </p>
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.key}
              to={item.key === "dashboard" ? "/" : `/${item.key}`}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors focus-ring ${
                  isActive
                    ? "bg-[var(--color-brand)]/10 text-[var(--color-brand)]"
                    : "text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-hover)]"
                }`
              }
              end={item.key === "dashboard"}
            >
              <Icon name={item.icon} size={18} />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="flex flex-col gap-1">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors focus-ring ${
              isActive
                ? "bg-[var(--color-brand)]/10 text-[var(--color-brand)]"
                : "text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-hover)]"
            }`
          }
        >
          <Icon name="settings" size={18} />
          Settings
        </NavLink>
        <button
          onClick={() => {
            logout();
            navigate("/login");
          }}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors focus-ring text-left"
        >
          <Icon name="logout" size={18} />
          Log out
        </button>
      </div>
    </aside>
  );
}
