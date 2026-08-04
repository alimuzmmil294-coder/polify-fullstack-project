import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { MailCheck, ArrowRight, Loader2, RefreshCw } from "lucide-react";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../config.js";

export default function VerifyEmail() {
  const location = useLocation();
  const navigate = useNavigate();

  const [email, setEmail] = useState(location.state?.email || "");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Invalid or expired verification code.",
        );
      }

      toast.success("Email verified successfully! You can now log in.");
      navigate("/login", { state: { email } });
    } catch (err) {
      toast.error(err.message || "Verification failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!email) {
      toast.error("Please enter your email address.");
      return;
    }

    setResending(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/resend-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to resend code.");
      }

      toast.success("A new verification code has been sent to your email!");
    } catch (err) {
      toast.error(err.message || "Could not resend code.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)] text-[var(--color-text)] px-6 py-16">
      <div className="w-full max-w-md bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-8 relative overflow-hidden">
        <div className="w-12 h-12 rounded-xl bg-[var(--color-brand)]/10 border border-[var(--color-brand)]/20 text-[var(--color-brand)] flex items-center justify-center mb-6">
          <MailCheck size={24} />
        </div>

        <h2 className="text-2xl font-bold mb-2">Verify your email</h2>
        <p className="text-sm text-[var(--color-text-muted)] mb-6">
          We sent a verification code to{" "}
          <span className="font-semibold text-[var(--color-text)]">
            {email || "your email"}
          </span>
          .
        </p>

        <form onSubmit={handleVerify} className="space-y-5">
          {!location.state?.email && (
            <div>
              <label className="block text-[11px] font-semibold tracking-widest text-[var(--color-text-faint)] mb-2">
                EMAIL ADDRESS
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg px-3.5 py-3 text-sm outline-none focus:border-[var(--color-brand)]/60 transition-colors"
              />
            </div>
          )}

          <div>
            <label className="block text-[11px] font-semibold tracking-widest text-[var(--color-text-faint)] mb-2">
              VERIFICATION CODE
            </label>
            <input
              type="text"
              required
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter 6-digit code"
              className="w-full bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg px-3.5 py-3 text-sm text-center tracking-[0.3em] font-mono outline-none focus:border-[var(--color-brand)]/60 transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-[var(--color-brand)] text-black font-semibold rounded-lg py-3 hover:bg-[var(--color-brand-dim)] transition-colors focus-ring disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <>
                Verify Email
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 flex items-center justify-between text-xs text-[var(--color-text-faint)] border-t border-[var(--color-border)] pt-5">
          <button
            type="button"
            onClick={handleResendCode}
            disabled={resending}
            className="inline-flex items-center gap-1.5 text-[var(--color-brand)] hover:underline disabled:opacity-50"
          >
            <RefreshCw size={12} className={resending ? "animate-spin" : ""} />
            Resend code
          </button>

          <Link
            to="/login"
            className="hover:text-[var(--color-text)] transition-colors"
          >
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}
