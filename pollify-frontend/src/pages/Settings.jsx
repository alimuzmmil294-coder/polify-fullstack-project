import { useAuth } from "../context/AuthContext";

export default function Settings() {
  const { user, email } = useAuth();

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold mb-1">Settings</h1>
      <p className="text-[var(--color-text-muted)] mb-6">
        Manage your account and preferences.
      </p>

      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 flex items-center gap-4 mb-6">
        <p className="w-16 h-16 rounded-full flex justify-center items-center object-cover border-2 border-[var(--color-brand)]/30">
          {email?.charAt(0)?.toUpperCase() || "U"}
        </p>
        <div>
          <p className="font-semibold text-lg">{user?.name}</p>
          <p className="text-sm text-[var(--color-text-faint)]">
            {user?.handle}
          </p>
        </div>
      </div>

      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 flex flex-col gap-5">
        <div>
          <label className="block text-[11px] font-semibold tracking-widest text-[var(--color-text-faint)] mb-2">
            DISPLAY NAME
          </label>
          <input
            defaultValue={user?.name}
            className="w-full bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg px-3.5 py-3 text-sm outline-none focus:border-[var(--color-brand)]/60"
          />
        </div>
        <div>
          <label className="block text-[11px] font-semibold tracking-widest text-[var(--color-text-faint)] mb-2">
            EMAIL
          </label>
          <input
            defaultValue={user?.handle?.replace("@", "")}
            className="w-full bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg px-3.5 py-3 text-sm outline-none focus:border-[var(--color-brand)]/60"
          />
        </div>
        <button className="self-start bg-[var(--color-brand)] text-black text-sm font-semibold px-4 py-2.5 rounded-lg hover:bg-[var(--color-brand-dim)] transition-colors focus-ring">
          Save changes
        </button>
      </div>
    </div>
  );
}
