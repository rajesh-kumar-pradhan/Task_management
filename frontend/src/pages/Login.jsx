import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Alert from "../components/Alert";
import { authService } from "../services/api";
import { useAuthStore } from "../store/index";

/* ─── Shared auth page styles ─────────────────────────────── */
const AUTH_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');

  :root {
    --auth-bg: #111827;
    --auth-panel: rgba(255,255,255,0.035);
    --auth-border: rgba(255,255,255,0.09);
    --auth-border-hi: rgba(255,255,255,0.18);
    --auth-accent: #3b82f6;
    --auth-accent-dim: rgba(59,130,246,0.18);
    --auth-text: #f8fafc;
    --auth-muted: rgba(226,232,240,0.62);
    --auth-faint: rgba(226,232,240,0.34);
    --auth-error: #f87171;
    --auth-error-bg: rgba(248,113,113,0.1);
    --font-display: 'DM Sans', sans-serif;
    --font-body: 'DM Sans', sans-serif;
    --ease: cubic-bezier(0.4,0,0.2,1);
  }

  .auth-root {
    min-height: 100vh;
    background: var(--auth-bg);
    background-image:
      radial-gradient(ellipse 80% 60% at 18% 65%, rgba(30,64,175,0.18) 0%, transparent 68%),
      radial-gradient(ellipse 55% 48% at 90% 15%, rgba(14,165,233,0.08) 0%, transparent 65%);
    display: flex;
    align-items: stretch;
    font-family: var(--font-body);
    color: var(--auth-text);
  }

  /* ── Left decorative panel ── */
  .auth-left {
    display: none;
    flex: 1;
    padding: 3rem;
    flex-direction: column;
    justify-content: space-between;
    border-right: 1px solid var(--auth-border);
    position: relative;
    overflow: hidden;
  }
  @media (min-width: 900px) { .auth-left { display: flex; } }

  .auth-left-grid {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
    background-size: 48px 48px;
    mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 20%, transparent 100%);
  }
  .auth-left-brand {
    display: flex;
    align-items: center;
    gap: 10px;
    position: relative;
    z-index: 1;
  }
  .auth-left-mark {
    width: 36px; height: 36px; border-radius: 11px;
    background: #2563eb;
    display: flex; align-items: center; justify-content: center;
    font-family: var(--font-display); font-weight: 800; font-size: 16px; color: #fff;
  }
  .auth-left-name {
    font-family: var(--font-display); font-weight: 700; font-size: 19px;
    letter-spacing: -0.3px;
  }
  .auth-left-copy {
    position: relative; z-index: 1;
  }
  .auth-left-headline {
    font-family: var(--font-display);
    font-weight: 800;
    font-size: clamp(32px, 3vw, 44px);
    line-height: 1.12;
    letter-spacing: -1.5px;
    margin-bottom: 1rem;
  }
  .auth-left-headline em {
    font-style: normal;
    background: linear-gradient(135deg, #60a5fa, #2563eb);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .auth-left-sub {
    font-size: 15px;
    color: var(--auth-muted);
    line-height: 1.6;
    max-width: 340px;
  }

  /* ── Completion illustration ── */
  .auth-visual {
    position: relative; z-index: 1;
    width: min(500px, 58%); height: 200px;
    margin: 0 -.75rem 0 auto; display: grid; place-items: center;
  }
  .auth-visual::before {
    content: ''; position: absolute; width: 285px; height: 100px;
    bottom: 3px; right: 20px; border-radius: 50%;
    background: rgba(37,99,235,0.24); filter: blur(26px);
  }
  .auth-visual svg { position: relative; width: 100%; height: 100%; overflow: visible; filter: drop-shadow(0 18px 22px rgba(2,6,23,0.34)); }
  @media (max-height: 850px) and (min-width: 900px) {
    .auth-visual { height: 145px; transform: scale(.9); margin-block: -7px; }
  }
  @media (min-width: 900px) and (max-width: 1199px) {
    .auth-visual { width: min(390px, 100%); margin-right: 0; }
  }
  .auth-features {
    position: relative; z-index: 1;
    display: flex; flex-direction: column; gap: 12px;
  }
  .auth-feature {
    display: flex; align-items: center; gap: 12px;
    padding: 12px 14px;
    border-radius: 12px;
    border: 1px solid var(--auth-border);
    background: var(--auth-panel);
  }
  .auth-feature-icon {
    width: 32px; height: 32px; border-radius: 8px;
    background: var(--auth-accent-dim);
    display: flex; align-items: center; justify-content: center;
    font-size: 15px; flex-shrink: 0;
  }
  .auth-feature-text { font-size: 13px; color: var(--auth-muted); line-height: 1.4; }
  .auth-feature-text strong { color: var(--auth-text); font-weight: 500; display: block; margin-bottom: 1px; }

  /* ── Right form panel ── */
  .auth-right {
    width: 100%;
    max-width: 480px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2.5rem 2rem;
    margin: 0 auto;
  }
  @media (min-width: 900px) {
    .auth-right { width: 480px; max-width: none; margin: 0; }
  }

  .auth-card {
    width: 100%;
    animation: auth-rise 0.5s var(--ease) both;
  }
  @keyframes auth-rise {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* ── Card header ── */
  .auth-card-header { margin-bottom: 2rem; }
  .auth-card-logo {
    display: flex; align-items: center; gap: 10px; margin-bottom: 1.5rem;
  }
  .auth-card-mark {
    width: 34px; height: 34px; border-radius: 10px;
    background: #2563eb;
    display: flex; align-items: center; justify-content: center;
    font-family: var(--font-display); font-weight: 800; font-size: 15px; color: #fff;
  }
  .auth-card-mark-name {
    font-family: var(--font-display); font-weight: 700; font-size: 17px; letter-spacing: -.2px;
  }
  .auth-card-title {
    font-family: var(--font-display);
    font-weight: 800; font-size: 28px;
    letter-spacing: -0.8px; line-height: 1.1;
    margin-bottom: 6px;
  }
  .auth-card-sub { font-size: 14px; color: var(--auth-muted); }

  /* ── Form ── */
  .auth-form { display: flex; flex-direction: column; gap: 18px; }

  .auth-field { display: flex; flex-direction: column; gap: 6px; }
  .auth-label {
    font-size: 12px; font-weight: 500; letter-spacing: 0.07em;
    text-transform: uppercase; color: var(--auth-muted);
  }
  .auth-input-wrap { position: relative; }
  .auth-input-icon {
    position: absolute; left: 13px; top: 50%; transform: translateY(-50%);
    color: var(--auth-faint); font-size: 15px; pointer-events: none;
    transition: color 0.2s var(--ease);
  }
  .auth-input {
    width: 100%; padding: 11px 14px 11px 38px;
    border-radius: 10px;
    border: 1px solid var(--auth-border);
    background: rgba(255,255,255,0.04);
    color: var(--auth-text);
    font-family: var(--font-body); font-size: 14px;
    outline: none;
    transition: border-color 0.2s var(--ease), background 0.2s var(--ease);
    box-sizing: border-box;
  }
  .auth-input::placeholder { color: var(--auth-faint); }
  .auth-input:focus {
    border-color: var(--auth-accent);
    background: rgba(59,130,246,0.08);
  }
  .auth-input:focus ~ .auth-focus-line { transform: scaleX(1); }
  .auth-input-wrap:focus-within .auth-input-icon { color: var(--auth-accent); }

  .auth-field-error {
    font-size: 12px; color: var(--auth-error);
    display: flex; align-items: center; gap: 5px;
  }

  /* ── Submit button ── */
  .auth-submit {
    width: 100%; padding: 12px;
    border-radius: 10px; border: none;
    background: #2563eb;
    color: #fff;
    font-family: var(--font-display); font-weight: 700; font-size: 15px;
    letter-spacing: 0.01em; cursor: pointer;
    box-shadow: 0 4px 18px rgba(37,99,235,0.25);
    transition: transform 0.2s var(--ease), box-shadow 0.2s var(--ease), opacity 0.2s;
    display: flex; align-items: center; justify-content: center; gap: 8px;
    margin-top: 4px;
  }
  .auth-submit:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 7px 24px rgba(37,99,235,0.36);
  }
  .auth-submit:active:not(:disabled) { transform: translateY(0); }
  .auth-submit:disabled { opacity: 0.6; cursor: not-allowed; }

  /* ── Spinner ── */
  .auth-spinner {
    width: 16px; height: 16px;
    border: 2px solid rgba(255,255,255,0.3);
    border-top-color: #fff;
    border-radius: 50%;
    animation: auth-spin 0.65s linear infinite;
  }
  @keyframes auth-spin { to { transform: rotate(360deg); } }

  /* ── Divider / footer ── */
  .auth-divider {
    display: flex; align-items: center; gap: 12px; margin: 4px 0;
  }
  .auth-divider-line { flex: 1; height: 1px; background: var(--auth-border); }
  .auth-divider-text { font-size: 12px; color: var(--auth-faint); }

  .auth-footer {
    text-align: center; font-size: 13px; color: var(--auth-muted);
  }
  .auth-link {
    color: var(--auth-accent); font-weight: 500; text-decoration: none;
    transition: opacity 0.2s;
  }
  .auth-link:hover { opacity: 0.75; }

  /* ── Alert override ── */
  .auth-alert-wrap { margin-bottom: 4px; }
`;

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [formData, setFormData] = React.useState({ email: "", password: "" });
  const [loading, setLoading] = React.useState(false);
  const [localError, setLocalError] = React.useState("");

  React.useEffect(() => {
    const id = "auth-injected-styles";
    if (!document.getElementById(id)) {
      const tag = document.createElement("style");
      tag.id = id;
      tag.textContent = AUTH_STYLES;
      document.head.appendChild(tag);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setLocalError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setLocalError("");
    try {
      const response = await authService.login(formData);
      const { user, accessToken } = response.data.data;
      login(user, accessToken);
      localStorage.setItem("token", accessToken);
      localStorage.setItem("user", JSON.stringify(user));
      navigate("/dashboard");
    } catch (error) {
      setLocalError(error.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-root">
      {/* Left decorative panel */}
      <div className="auth-left">
        <div className="auth-left-grid" />
        <div className="auth-left-brand">
          <div className="auth-left-mark">T</div>
          <span className="auth-left-name">TaskManagement</span>
        </div>
        <div className="auth-left-copy">
          <h1 className="auth-left-headline">
            Your tasks.<br /><em>Organized.</em>
          </h1>
          <p className="auth-left-sub">
            A focused workspace to track, prioritize, and complete everything that matters.
          </p>
        </div>
        <div className="auth-visual" role="img" aria-label="An orbit of connected tasks progressing toward completion">
          <svg viewBox="0 0 500 200" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <defs>
              <radialGradient id="core" cx="0" cy="0" r="1" gradientTransform="translate(354 104) rotate(90) scale(53)" gradientUnits="userSpaceOnUse"><stop stopColor="#93C5FD" /><stop offset=".54" stopColor="#3B82F6" /><stop offset="1" stopColor="#1D4ED8" /></radialGradient>
              <linearGradient id="glass" x1="279" y1="54" x2="419" y2="155" gradientUnits="userSpaceOnUse"><stop stopColor="#EFF6FF" stopOpacity=".24" /><stop offset="1" stopColor="#60A5FA" stopOpacity=".05" /></linearGradient>
              <linearGradient id="node" x1="111" y1="72" x2="165" y2="115" gradientUnits="userSpaceOnUse"><stop stopColor="#FDE68A" /><stop offset="1" stopColor="#F59E0B" /></linearGradient>
            </defs>
            <ellipse cx="354" cy="104" rx="120" ry="52" stroke="#60A5FA" strokeOpacity=".24" strokeWidth="1.5" transform="rotate(-22 354 104)" />
            <ellipse cx="354" cy="104" rx="84" ry="107" stroke="#60A5FA" strokeOpacity=".18" strokeWidth="1.5" transform="rotate(42 354 104)" />
            <path d="M74 118C152 119 195 58 283 69" stroke="#60A5FA" strokeOpacity=".42" strokeWidth="2" strokeLinecap="round" strokeDasharray="3 8" />
            <path d="M236 153C273 172 336 174 389 151" stroke="#60A5FA" strokeOpacity=".34" strokeWidth="2" strokeLinecap="round" strokeDasharray="3 8" />
            <circle cx="354" cy="104" r="62" fill="url(#glass)" stroke="#93C5FD" strokeOpacity=".24" />
            <circle cx="354" cy="104" r="46" fill="url(#core)" /><circle cx="339" cy="88" r="12" fill="#BFDBFE" fillOpacity=".32" />
            <path d="M331 105L345 119L378 85" stroke="white" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
            <g transform="rotate(-5 128 109)"><rect x="72" y="76" width="112" height="66" rx="15" fill="#1E293B" stroke="#93C5FD" strokeOpacity=".22" /><rect x="87" y="93" width="49" height="7" rx="3.5" fill="#E2E8F0" fillOpacity=".85" /><rect x="87" y="107" width="76" height="5" rx="2.5" fill="#94A3B8" fillOpacity=".54" /><circle cx="155" cy="125" r="12" fill="url(#node)" /><path d="M150 125L154 129L161 121" stroke="#78350F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></g>
            <g transform="rotate(9 437 73)"><rect x="406" y="46" width="62" height="55" rx="15" fill="#172554" stroke="#60A5FA" strokeOpacity=".42" /><rect x="421" y="63" width="31" height="6" rx="3" fill="#DBEAFE" fillOpacity=".8" /><rect x="421" y="76" width="20" height="5" rx="2.5" fill="#93C5FD" fillOpacity=".5" /></g>
            <circle cx="209" cy="51" r="7" fill="#FBBF24" /><circle cx="447" cy="144" r="5" fill="#93C5FD" /><circle cx="269" cy="163" r="4" fill="#60A5FA" />
          </svg>
        </div>
        <div className="auth-features">
          {[
            { icon: "⚡", title: "Instant sync", desc: "Tasks update in real-time across all devices" },
            { icon: "🎯", title: "Priority system", desc: "High, medium, and low priority with smart sorting" },
            { icon: "🔒", title: "Secure by default", desc: "JWT-protected sessions with encrypted storage" },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="auth-feature">
              <div className="auth-feature-icon">{icon}</div>
              <div className="auth-feature-text">
                <strong>{title}</strong>{desc}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right form panel */}
      <div className="auth-right">
        <div className="auth-card">
          <div className="auth-card-header">
            <div className="auth-card-logo">
              <div className="auth-card-mark">T</div>
              <span className="auth-card-mark-name">TaskManagement</span>
            </div>
            <h2 className="auth-card-title">Welcome back</h2>
            <p className="auth-card-sub">Sign in to continue to your workspace</p>
          </div>

          {localError && (
            <div className="auth-alert-wrap">
              <Alert type="error" message={localError} onClose={() => setLocalError("")} />
            </div>
          )}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-field">
              <label className="auth-label">Email Address</label>
              <div className="auth-input-wrap">
                <span className="auth-input-icon">✉</span>
                <input
                  className="auth-input"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="auth-field">
              <label className="auth-label">Password</label>
              <div className="auth-input-wrap">
                <span className="auth-input-icon">🔒</span>
                <input
                  className="auth-input"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
                />
              </div>
            </div>

            <button className="auth-submit" type="submit" disabled={loading}>
              {loading ? (
                <><div className="auth-spinner" /> Signing in…</>
              ) : (
                "Sign In →"
              )}
            </button>
          </form>

          <div style={{ marginTop: "1.5rem" }}>
            <div className="auth-divider">
              <div className="auth-divider-line" />
              <span className="auth-divider-text">no account?</span>
              <div className="auth-divider-line" />
            </div>
            <div className="auth-footer" style={{ marginTop: "1rem" }}>
              <Link to="/register" className="auth-link">
                Create a free account →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
