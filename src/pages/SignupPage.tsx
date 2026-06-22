import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function passwordStrength(p: string): { level: number; label: string; color: string } {
  if (!p) return { level: 0, label: "", color: "" };
  let score = 0;
  if (p.length >= 8) score++;
  if (/[A-Z]/.test(p)) score++;
  if (/[0-9]/.test(p)) score++;
  if (/[^A-Za-z0-9]/.test(p)) score++;
  const map = [
    { level: 1, label: "Weak",   color: "bg-rose-400"   },
    { level: 2, label: "Fair",   color: "bg-amber-400"  },
    { level: 3, label: "Good",   color: "bg-blue-400"   },
    { level: 4, label: "Strong", color: "bg-emerald-400" },
  ];
  return map[Math.min(score, 4) - 1] || { level: 0, label: "", color: "" };
}

export default function SignupPage() {
  const { signup, user } = useAuth();
  const navigate         = useNavigate();

  useEffect(() => {
    if (user) navigate("/", { replace: true });
  }, [user, navigate]);

  const [name,         setName]         = useState("");
  const [email,        setEmail]        = useState("");
  const [password,     setPassword]     = useState("");
  const [confirm,      setConfirm]      = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error,        setError]        = useState("");
  const [loading,      setLoading]      = useState(false);

  const strength = passwordStrength(password);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name.trim() || !email.trim() || !password || !confirm) {
      setError("Please fill in all fields."); return;
    }
    if (password !== confirm) { setError("Passwords don't match."); return; }
    if (password.length < 6)  { setError("Password must be at least 6 characters."); return; }
    setLoading(true);
    setTimeout(() => {
      const result = signup(name.trim(), email.trim(), password);
      if (!result.success) { setError(result.error || "Sign up failed."); setLoading(false); }
      // navigation handled by useEffect
    }, 400);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, #2d1b69 0%, #6d28d9 40%, #4338ca 100%)" }}
    >
      {/* Soft background blobs */}
      <div className="absolute top-[-60px] right-[-60px] w-80 h-80 rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(167,139,250,0.35), transparent)" }} />
      <div className="absolute bottom-[-50px] left-[-50px] w-96 h-96 rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(244,114,182,0.3), transparent)" }} />
      <div className="absolute top-1/2 right-1/4 w-60 h-60 rounded-full blur-2xl"
        style={{ background: "radial-gradient(circle, rgba(99,102,241,0.25), transparent)" }} />

      {/* <div className="absolute top-8 left-8 text-4xl float" style={{ animationDelay: "0.3s", opacity: 0.3 }}>📚</div>
      <div className="absolute top-8 right-8 text-4xl float" style={{ animationDelay: "1.5s", opacity: 0.3 }}>✅</div>
      <div className="absolute bottom-8 left-8 text-4xl float" style={{ animationDelay: "2.2s", opacity: 0.3 }}>🚀</div>
      <div className="absolute bottom-8 right-8 text-4xl float" style={{ animationDelay: "0.8s", opacity: 0.3 }}>🎯</div> */}

      {/* Card */}
      <div className="dialog-in relative w-full max-w-md my-6">
        <div className="h-1.5 rounded-t-3xl" style={{ background: "linear-gradient(90deg, #f472b6, #a855f7, #6366f1)" }} />

        <div className="bg-white rounded-b-3xl shadow-2xl px-8 py-8">
          {/* Logo */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-3 shadow-lg"
              style={{ background: "linear-gradient(135deg, #ec4899, #8b5cf6)" }}>
              <span className="text-3xl">🚀</span>
            </div>
            <h1 className="text-2xl font-extrabold animated-gradient-text">Create Account</h1>
            <p className="text-gray-400 text-sm mt-1">Start organizing your day</p>
          </div>

          {/* Error */}
          {error && (
            <div className="pop-in mb-4 flex items-center gap-2 bg-rose-50 border border-rose-200 text-rose-600 text-sm px-4 py-3 rounded-xl">
              <span>⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Name */}
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">Full Name</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
                  </svg>
                </span>
                <input
                  type="text"
                  placeholder="Your full name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-300 text-sm transition-all"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">Email</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                  </svg>
                </span>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-300 text-sm transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">Password</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
                  </svg>
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Min. 6 characters"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-300 text-sm transition-all"
                />
                <button type="button" onClick={() => setShowPassword(p => !p)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-500 transition-colors">
                  {showPassword
                    ? <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/></svg>
                    : <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd"/><path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.064 7 9.542 7 .847 0 1.669-.105 2.454-.303z"/></svg>
                  }
                </button>
              </div>
              {/* Strength bar */}
              {password && (
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex gap-1 flex-1">
                    {[1, 2, 3, 4].map(n => (
                      <div key={n} className={`flex-1 h-1.5 rounded-full transition-all duration-300 ${n <= strength.level ? strength.color : "bg-gray-200"}`} />
                    ))}
                  </div>
                  <span className="text-xs text-gray-500 font-medium w-12">{strength.label}</span>
                </div>
              )}
            </div>

            {/* Confirm */}
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">Confirm Password</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Re-enter your password"
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border outline-none focus:ring-2 focus:ring-purple-300 text-sm transition-all ${
                    confirm && confirm !== password ? "border-rose-300 bg-rose-50" : "border-gray-200"
                  }`}
                />
                {confirm && confirm === password && (
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-emerald-500">
                    <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l3-3z" clipRule="evenodd"/>
                    </svg>
                  </span>
                )}
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-white font-semibold text-sm transition-all active:scale-95 disabled:opacity-60 shadow-lg mt-1"
              style={{ background: loading ? "#c084fc" : "linear-gradient(135deg, #ec4899, #8b5cf6)" }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Creating account…
                </span>
              ) : "Create Account →"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-5">
            Already have an account?{" "}
            <Link to="/login" className="text-purple-600 font-semibold hover:text-purple-800 transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
