import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { useContent } from "../content/ContentContext";
import { STAR_CORE_CHARGE } from "../data/mock";
import { usePlatform } from "../platform/PlatformContext";
import { PLATFORMS } from "../platform/types";

/** Grok-style spiral mark (matches Grok Games mock: orbit glyph + wordmark) */
function GrokGamesMark() {
  return (
    <svg className="grok-games-mark" viewBox="0 0 48 48" aria-hidden>
      <defs>
        <linearGradient id="grokMarkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="55%" stopColor="#b8f7ff" />
          <stop offset="100%" stopColor="#5ef0ff" />
        </linearGradient>
      </defs>
      {/* Outer orbit ring */}
      <circle
        cx="24"
        cy="24"
        r="18.5"
        fill="none"
        stroke="url(#grokMarkGrad)"
        strokeWidth="2.4"
        opacity="0.95"
      />
      {/* Spiral arm (Grok-like continuous curve) */}
      <path
        d="M24 8.5
           C33.5 8.5 39.5 15.2 39.5 24
           C39.5 31.8 34.2 37.5 27 38.2
           C22.5 38.6 18.8 36.2 17.2 32.5
           C15.8 29.2 17.2 25.5 20.5 24.2
           C23.2 23.2 25.8 24.5 26.8 27
           C27.5 28.8 26.8 30.8 25 31.5
           C23.5 32.1 21.8 31.4 21.2 30"
        fill="none"
        stroke="url(#grokMarkGrad)"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Inner accent arc */}
      <path
        d="M24 14.5 C30 14.5 34 18.8 34 24"
        fill="none"
        stroke="url(#grokMarkGrad)"
        strokeWidth="2.2"
        strokeLinecap="round"
        opacity="0.75"
      />
      {/* Center spark */}
      <circle cx="24" cy="24" r="2.2" fill="url(#grokMarkGrad)" opacity="0.95" />
    </svg>
  );
}

export function TopBar() {
  const { platform, resetPlatform, isMobile } = usePlatform();
  const { displayName } = useContent();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const meta = PLATFORMS.find((p) => p.id === platform);

  function onSignOut() {
    if (!window.confirm("Sign out? Your account stays registered — reconnect anytime.")) return;
    signOut();
    navigate("/auth", { replace: true });
  }

  const label =
    user?.method === "x" && user.xHandle
      ? `@${user.xHandle}`
      : displayName || user?.displayName || "Guardian";

  return (
    <header className="topbar topbar--grok">
      <div className="brand brand--grok" title="Grok Games">
        <GrokGamesMark />
        <div className="brand-text brand-text--grok">
          <strong className="brand-grok">Grok</strong>
          <span className="brand-games">GAMES</span>
        </div>
      </div>

      <div className="core-pill core-pill--star" title={`Star Core ${STAR_CORE_CHARGE}%`}>
        <span className="core-pill-label">Star Core</span>
        <img
          className="core-pill-heart"
          src={`${import.meta.env.BASE_URL}images/star-core-heart-fx.png`}
          alt=""
          draggable={false}
        />
      </div>

      <div className="topbar-right">
        {!isMobile && (
          <button
            type="button"
            className="platform-switch-btn"
            title="Change platform layout"
            onClick={resetPlatform}
          >
            {meta?.icon ?? "🖥️"} <span className="platform-switch-label">Switch</span>
          </button>
        )}
        <button
          type="button"
          className="platform-switch-btn"
          title="Sign out"
          onClick={onSignOut}
        >
          ⎋ <span className="platform-switch-label">Out</span>
        </button>
        <Link
          to="/profile"
          className="avatar avatar-link"
          title={`Profile · ${label}`}
          aria-label={`Open profile for ${label}`}
        >
          {user?.avatarEmoji ?? "🐺"}
        </Link>
      </div>
    </header>
  );
}
