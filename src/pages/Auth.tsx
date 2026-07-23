import { useState, type FormEvent } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { isOnboardingDone } from "../data/contentStore";
import { usePlatform } from "../platform/PlatformContext";

type Mode = "pick" | "x" | "local";

export function Auth() {
  const { platform } = usePlatform();
  const {
    isLoggedIn,
    user,
    accounts,
    connectWithX,
    signUpLocal,
    loginAccount,
  } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState<Mode>("pick");
  const [xHandle, setXHandle] = useState("");
  const [xDisplay, setXDisplay] = useState("");
  const [localName, setLocalName] = useState("");
  const [avatar, setAvatar] = useState("🐺");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [banner, setBanner] = useState<string | null>(null);

  if (!platform) {
    return <Navigate to="/choose" replace />;
  }

  if (isLoggedIn && user) {
    return (
      <Navigate
        to={isOnboardingDone(user.id) ? "/" : "/onboarding"}
        replace
      />
    );
  }

  function afterAuth(userId: string, isNew: boolean) {
    setBanner(isNew ? "Account registered and saved." : "Welcome back — account loaded.");
    navigate(isOnboardingDone(userId) ? "/" : "/onboarding", { replace: true });
  }

  function onConnectX(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    window.setTimeout(() => {
      try {
        const before = accounts.some(
          (a) => a.xHandle?.toLowerCase() === xHandle.trim().replace(/^@/, "").toLowerCase()
        );
        const u = connectWithX(xHandle, xDisplay || undefined);
        afterAuth(u.id, !before);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Could not connect");
        setBusy(false);
      }
    }, 450);
  }

  function onCreateLocal(e: FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      const u = signUpLocal(localName, avatar);
      afterAuth(u.id, true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create account");
    }
  }

  function onReconnect(id: string) {
    setError(null);
    try {
      const u = loginAccount(id);
      afterAuth(u.id, false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not sign in");
    }
  }

  return (
    <div className="platform-gate auth-gate">
      <div className="platform-gate-bg" aria-hidden />
      <div className="platform-gate-card auth-card">
        <div className="platform-gate-brand">
          <span className="platform-gate-mark" aria-hidden>
            ⚡
          </span>
          <div>
            <h1>Join the Pack</h1>
            <p>Register once · reconnect anytime</p>
          </div>
        </div>

        {banner && (
          <div className="success-banner" role="status">
            {banner}
          </div>
        )}

        {mode === "pick" && (
          <>
            <h2 className="platform-gate-title">Connect or create</h2>
            <p className="platform-gate-sub">
              Accounts are <strong>saved on this browser</strong>. Names and X handles must be{" "}
              <strong>unique</strong>. Sign in again later from your saved accounts list.
            </p>

            {accounts.length > 0 && (
              <section className="panel auth-saved" style={{ marginBottom: "1.25rem" }}>
                <h3 className="panel-title">Saved accounts — tap to reconnect</h3>
                <div className="stack">
                  {accounts.map((a) => (
                    <button
                      key={a.id}
                      type="button"
                      className="saved-account-row"
                      onClick={() => onReconnect(a.id)}
                    >
                      <span className="saved-account-avatar" aria-hidden>
                        {a.avatarEmoji}
                      </span>
                      <span className="saved-account-meta">
                        <strong>{a.displayName}</strong>
                        <span>
                          {a.method === "x" && a.xHandle
                            ? `@${a.xHandle} · X`
                            : "Local Pack name"}{" "}
                          · last{" "}
                          {new Date(a.lastLoginAt).toLocaleDateString()}
                        </span>
                      </span>
                      <span className="saved-account-cta">Enter →</span>
                    </button>
                  ))}
                </div>
              </section>
            )}

            <div className="auth-pick">
              <button type="button" className="auth-method-card auth-x" onClick={() => setMode("x")}>
                <span className="auth-method-icon">𝕏</span>
                <span className="auth-method-label">Connect with X</span>
                <span className="auth-method-blurb">
                  Register or reconnect with your @handle (unique)
                </span>
                <span className="platform-card-cta">Continue →</span>
              </button>

              <button
                type="button"
                className="auth-method-card auth-local"
                onClick={() => setMode("local")}
              >
                <span className="auth-method-icon">🐺</span>
                <span className="auth-method-label">Create Pack name</span>
                <span className="auth-method-blurb">
                  New account — name cannot match anyone already registered
                </span>
                <span className="platform-card-cta">Continue →</span>
              </button>
            </div>
          </>
        )}

        {mode === "x" && (
          <form className="auth-form" onSubmit={onConnectX}>
            <h2 className="platform-gate-title">Connect with X</h2>
            <p className="platform-gate-sub">
              If this handle is already registered, you will be signed back into that account. New
              handles create a permanent entry (unique display name required).
            </p>

            <label className="field">
              <span>X handle</span>
              <input
                value={xHandle}
                onChange={(e) => setXHandle(e.target.value)}
                placeholder="@StarBoltSprint"
                autoComplete="username"
                autoFocus
                required
              />
            </label>

            <label className="field">
              <span>Display name (new accounts only)</span>
              <input
                value={xDisplay}
                onChange={(e) => setXDisplay(e.target.value)}
                placeholder="Unique Pack name if registering"
                maxLength={32}
              />
            </label>

            {error && <div className="auth-error">{error}</div>}

            <div className="onboarding-actions">
              <button type="button" className="btn-ghost" onClick={() => setMode("pick")}>
                Back
              </button>
              <button type="submit" className="btn-play" disabled={busy}>
                {busy ? "Saving…" : "Connect & save"}
              </button>
            </div>
          </form>
        )}

        {mode === "local" && (
          <form className="auth-form" onSubmit={onCreateLocal}>
            <h2 className="platform-gate-title">Create Pack name</h2>
            <p className="platform-gate-sub">
              Registers a new account. If the name is taken, pick another.
            </p>

            <label className="field">
              <span>Pack name (unique)</span>
              <input
                value={localName}
                onChange={(e) => setLocalName(e.target.value)}
                placeholder="e.g. Thunder Pup"
                maxLength={24}
                autoFocus
                required
              />
            </label>

            <div className="field">
              <span>Avatar</span>
              <div className="emoji-row">
                {["🐺", "⚡", "🐾", "💎", "🌀", "✨", "🔥", "🏰"].map((e) => (
                  <button
                    key={e}
                    type="button"
                    className={`emoji-pick${avatar === e ? " on" : ""}`}
                    onClick={() => setAvatar(e)}
                  >
                    {e}
                  </button>
                ))}
              </div>
            </div>

            {error && <div className="auth-error">{error}</div>}

            <div className="onboarding-actions">
              <button type="button" className="btn-ghost" onClick={() => setMode("pick")}>
                Back
              </button>
              <button type="submit" className="btn-play">
                Register account
              </button>
            </div>
          </form>
        )}

        <p className="platform-gate-foot">
          Powered by xAI & YOU · <strong>AROOOO</strong> ⚡🐺
        </p>
      </div>
    </div>
  );
}
