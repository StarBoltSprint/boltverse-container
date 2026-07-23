import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { useContent } from "../content/ContentContext";
import { STAR_CORE_CHARGE } from "../data/mock";
import { usePlatform } from "../platform/PlatformContext";
import { PLATFORMS } from "../platform/types";

function GrokGamesMark() {
  return (
    <svg className="grok-games-mark" viewBox="0 0 40 40" aria-hidden>
      <defs>
        <linearGradient id="gg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#5ef0ff" />
          <stop offset="100%" stopColor="#0891b2" />
        </linearGradient>
      </defs>
      <path
        fill="url(#gg)"
        d="M20 4 L34 12 L34 28 L20 36 L6 28 L6 12 Z M20 10 L28 14.5 L28 25.5 L20 30 L12 25.5 L12 14.5 Z"
        opacity="0.95"
      />
      <path
        fill="#031018"
        d="M20 14 L25 17 V24 L20 27 L15 24 V17 Z"
        opacity="0.85"
      />
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
      <div className="brand brand--grok">
        <GrokGamesMark />
        <div className="brand-text">
          <strong className="brand-grok">Grok</strong>
          <span className="brand-games">GAMES</span>
        </div>
      </div>

      <div className="core-pill core-pill--star" title={`Star Core ${STAR_CORE_CHARGE}%`}>
        <span className="core-pill-label">Star Core</span>
        <img
          className="core-pill-heart"
          src={`${import.meta.env.BASE_URL}images/star-core-heart.png`}
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
