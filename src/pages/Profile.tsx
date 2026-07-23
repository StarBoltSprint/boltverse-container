import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { useContent } from "../content/ContentContext";
import { ExperienceCard } from "../components/ExperienceCard";

const AVATARS = ["🐺", "⚡", "🐾", "💎", "🌀", "✨", "🔥", "🏰", "𝕏", "📜"];

export function Profile() {
  const { user, updateProfile, signOut } = useAuth();
  const { published, howlCount, codexUnlocks, setDisplayName } = useContent();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.displayName ?? "");
  const [bio, setBio] = useState(user?.bio ?? "");
  const [avatar, setAvatar] = useState(user?.avatarEmoji ?? "🐺");
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  if (!user) {
    return (
      <div className="page">
        <div className="stub-note">Not signed in.</div>
        <Link to="/auth" className="btn-play">
          Sign in
        </Link>
      </div>
    );
  }

  function onSave(e: FormEvent) {
    e.preventDefault();
    setErr(null);
    setMsg(null);
    try {
      const next = updateProfile({
        displayName: name,
        bio,
        avatarEmoji: avatar,
      });
      setDisplayName(next.displayName);
      setMsg("Profile saved to your registered account.");
    } catch (error) {
      setErr(error instanceof Error ? error.message : "Could not save");
    }
  }

  function onSignOut() {
    if (!window.confirm("Sign out? Your account stays registered — reconnect anytime.")) return;
    signOut();
    navigate("/auth", { replace: true });
  }

  return (
    <div className="page profile-page">
      <h1 className="page-title">Profile</h1>
      <p className="page-sub">Your registered Pack identity — saved on this device.</p>

      {msg && (
        <div className="success-banner" role="status">
          {msg}
        </div>
      )}
      {err && <div className="auth-error">{err}</div>}

      <section className="panel profile-hero">
        <div className="profile-avatar-lg" aria-hidden>
          {user.avatarEmoji}
        </div>
        <div>
          <h2 style={{ margin: "0 0 0.25rem" }}>{user.displayName}</h2>
          <p className="page-sub" style={{ margin: 0 }}>
            {user.method === "x" && user.xHandle
              ? `𝕏 @${user.xHandle}`
              : "Local Pack account"}
          </p>
          <p className="play-foot" style={{ marginTop: "0.35rem" }}>
            Registered {new Date(user.createdAt).toLocaleString()} · Last login{" "}
            {new Date(user.lastLoginAt).toLocaleString()}
          </p>
        </div>
      </section>

      <div className="results-grid" style={{ marginTop: "1rem" }}>
        <div className="panel results-stat">
          <span className="panel-title">Published</span>
          <strong className="results-num">{published.length}</strong>
        </div>
        <div className="panel results-stat">
          <span className="panel-title">Howls</span>
          <strong className="results-num">{howlCount}</strong>
        </div>
        <div className="panel results-stat">
          <span className="panel-title">Codex unlocks</span>
          <strong className="results-num">{codexUnlocks.length}</strong>
        </div>
      </div>

      <form className="panel create-form" style={{ marginTop: "1.25rem" }} onSubmit={onSave}>
        <h2 className="panel-title">Edit profile</h2>

        <label className="field">
          <span>Pack name (unique)</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={32}
            required
          />
        </label>

        {user.method === "x" && user.xHandle && (
          <label className="field">
            <span>X handle (locked)</span>
            <input value={`@${user.xHandle}`} disabled />
          </label>
        )}

        <label className="field">
          <span>Bio</span>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
            maxLength={200}
            placeholder="Tell the Pack who you are…"
          />
        </label>

        <div className="field">
          <span>Avatar</span>
          <div className="emoji-row">
            {AVATARS.map((e) => (
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

        <div className="create-actions">
          <button type="submit" className="btn-play">
            Save profile
          </button>
          <button type="button" className="btn-ghost" onClick={onSignOut}>
            Sign out
          </button>
        </div>
      </form>

      <section className="panel" style={{ marginTop: "1.25rem" }}>
        <h2 className="panel-title">Your published ({published.length})</h2>
        {published.length === 0 ? (
          <div className="stub-note" style={{ marginBottom: 0 }}>
            Nothing published yet.{" "}
            <Link to="/create" style={{ color: "var(--cyan)" }}>
              Create something
            </Link>
            .
          </div>
        ) : (
          <div className="stack">
            {published.map((exp) => (
              <ExperienceCard key={exp.id} experience={exp} />
            ))}
          </div>
        )}
      </section>

      <p className="footer-howl">
        Account ID <strong>{user.id}</strong> · Powered by xAI & YOU
      </p>
    </div>
  );
}
