import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Mail,
  User,
  AtSign,
  FileText,
  Eye,
  EyeOff,
  ArrowRight,
  TrendingUp,
  Loader2,
} from "lucide-react";
import { toast } from "react-toastify";

export default function Signup() {
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    bio: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "username" ? value.toLowerCase().trim() : value,
    }));
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:3500/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      // 1. If backend returned an error status or success: false
      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Registration failed. Please try again.",
        );
      }

      // 2. Display success notification
      toast.success(
        data.message || "Account created successfully! Please log in.",
      );

      // 3. Redirect to /login (passing email state to prepopulate login form)
      navigate("/login", { state: { email: formData.email } });
    } catch (err) {
      setError(err.message || "An unexpected error occurred.");
      toast.error(err.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)] text-[var(--color-text)] px-6 py-16">
      <form onSubmit={handleSubmit} className="w-full max-w-sm">
        <div className="flex items-center gap-2 mb-8 justify-center">
          <div className="w-8 h-8 rounded-lg bg-[var(--color-brand)] flex items-center justify-center">
            <TrendingUp size={16} className="text-black" strokeWidth={2.5} />
          </div>
          <span className="font-semibold text-lg">Pollify</span>
        </div>

        <h2 className="text-3xl font-bold mb-2 text-center">
          Create your account
        </h2>
        <p className="text-[var(--color-text-muted)] mb-6 text-sm text-center">
          Join the community and start polling.
        </p>

        {error && (
          <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-xs text-center font-medium">
            {error}
          </div>
        )}

        {/* FULL NAME */}
        <label className="block text-[11px] font-semibold tracking-widest text-[var(--color-text-faint)] mb-2">
          FULL NAME
        </label>
        <div className="flex items-center gap-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg px-3.5 py-3 mb-5 focus-within:border-[var(--color-brand)]/60 transition-colors">
          <input
            type="text"
            name="fullName"
            required
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Your full name"
            className="flex-1 bg-transparent outline-none text-sm placeholder:text-[var(--color-text-faint)]"
          />
          <User size={16} className="text-[var(--color-text-faint)]" />
        </div>

        {/* USERNAME */}
        <label className="block text-[11px] font-semibold tracking-widest text-[var(--color-text-faint)] mb-2">
          USERNAME
        </label>
        <div className="flex items-center gap-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg px-3.5 py-3 mb-5 focus-within:border-[var(--color-brand)]/60 transition-colors">
          <input
            type="text"
            name="username"
            required
            minLength={3}
            value={formData.username}
            onChange={handleChange}
            placeholder="username"
            className="flex-1 bg-transparent outline-none text-sm placeholder:text-[var(--color-text-faint)]"
          />
          <AtSign size={16} className="text-[var(--color-text-faint)]" />
        </div>

        {/* EMAIL ADDRESS */}
        <label className="block text-[11px] font-semibold tracking-widest text-[var(--color-text-faint)] mb-2">
          EMAIL ADDRESS
        </label>
        <div className="flex items-center gap-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg px-3.5 py-3 mb-5 focus-within:border-[var(--color-brand)]/60 transition-colors">
          <input
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder="you@example.com"
            className="flex-1 bg-transparent outline-none text-sm placeholder:text-[var(--color-text-faint)]"
          />
          <Mail size={16} className="text-[var(--color-text-faint)]" />
        </div>

        {/* BIO */}
        <div className="flex justify-between items-center mb-2">
          <label className="block text-[11px] font-semibold tracking-widest text-[var(--color-text-faint)]">
            BIO <span className="text-[10px] opacity-60">(OPTIONAL)</span>
          </label>
          <span className="text-[10px] text-[var(--color-text-faint)]">
            {formData.bio.length}/160
          </span>
        </div>
        <div className="flex items-start gap-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg px-3.5 py-3 mb-5 focus-within:border-[var(--color-brand)]/60 transition-colors">
          <textarea
            name="bio"
            maxLength={160}
            rows={2}
            value={formData.bio}
            onChange={handleChange}
            placeholder="Tell us a bit about yourself..."
            className="flex-1 bg-transparent outline-none text-sm placeholder:text-[var(--color-text-faint)] resize-none"
          />
          <FileText
            size={16}
            className="text-[var(--color-text-faint)] mt-0.5"
          />
        </div>

        {/* PASSWORD */}
        <label className="block text-[11px] font-semibold tracking-widest text-[var(--color-text-faint)] mb-2">
          PASSWORD
        </label>
        <div className="flex items-center gap-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg px-3.5 py-3 mb-7 focus-within:border-[var(--color-brand)]/60 transition-colors">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            required
            minLength={8}
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            className="flex-1 bg-transparent outline-none text-sm placeholder:text-[var(--color-text-faint)]"
          />
          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            className="text-[var(--color-text-faint)] hover:text-[var(--color-text)] focus-ring rounded"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-[var(--color-brand)] text-black font-semibold rounded-lg py-3 hover:bg-[var(--color-brand-dim)] transition-colors focus-ring mb-6 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <>
              Create account
              <ArrowRight size={16} />
            </>
          )}
        </button>

        <p className="text-center text-sm text-[var(--color-text-muted)]">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-[var(--color-brand)] hover:underline font-medium"
          >
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
}
