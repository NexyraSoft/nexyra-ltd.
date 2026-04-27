import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../../lib/auth";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const response = await authService.login({ email, password });
      authService.saveToken(response.token);
      navigate("/admin", { replace: true });
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unable to log in.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6 py-20 relative z-10">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 shadow-2xl">
        <h1 className="text-3xl font-display font-bold text-center mb-2">Admin Login</h1>
        <p className="text-sm text-slate-400 text-center mb-8">
          Sign in with your admin account credentials.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="admin-email" className="text-sm text-slate-300">Email</label>
            <input
              id="admin-email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 outline-none focus:border-maroon-800"
              placeholder="admin@example.com"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="admin-password" className="text-sm text-slate-300">Password</label>
            <input
              id="admin-password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 outline-none focus:border-maroon-800"
              placeholder="Enter your password"
            />
          </div>

          {error ? <p className="text-sm text-red-400">{error}</p> : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-maroon-800 py-3 font-semibold text-white transition hover:bg-maroon-900 disabled:opacity-70"
          >
            {isSubmitting ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
