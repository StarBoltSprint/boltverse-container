import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { useContent } from "../content/ContentContext";
import { PERSONAL_RESONANCE, STAR_CORE_CHARGE } from "../data/mock";
import { usePlatform } from "../platform/PlatformContext";
import { PLATFORMS } from "../platform/types";

export function TopBar() {
  const { platform, resetPlatform, isMobile } = usePlatform();
  const { displayName } = useContent();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const meta = PLATFORMS.find((p) => p.id === platform);

  function onSignOut() {
    if (!window.confirm("Sign out of the Citadel on this device?")) return;
    signOut();
    navigate("/auth", { replace: true });
  }

  const label =
    user?.method === "x" && user.xHandle
      ? `@${user.xHandle}`
      : displayName || user?.displayName || "Guardian";

  return (
    <header className="topbar">
      <div className="brand">
        <div className="brand-mark" aria-hidden>
          ⚡
        </div>
        <div className="brand-text">
          <strong>Boltverse</strong>
          <span>{isMobile ? meta?.label ?? "Mobile" : "Digital Citadel"}</span>
        </div>
      </div>

      <div className="core-pill" title="Shared Star Core charge">
        <div className="core-dot" aria-hidden />
        <div>
          <strong>{STAR_CORE_CHARGE}%</strong>
          {!isMobile && <span> · Star Core</span>}
        </div>
      </div>

      <div className="topbar-right">
        {!isMobile && (
          <div className="resonance-stat">
            <span>Personal Resonance</span>
            <strong>{PERSONAL_RESONANCE.toLocaleString()}</strong>
          </div>
        )}
        <button
          type="button"
          className="platform-switch-btn"
          title="Change platform layout"
          onClick={resetPlatform}
        >
          {meta?.icon ?? "⚙️"} <span className="platform-switch-label">Switch</span>
        </button>
        <button
          type="button"
          className="platform-switch-btn"
          title="Sign out"
          onClick={onSignOut}
        >
          ⎋ <span className="platform-switch-label">Out</span>
        </button>
        <div
          className="avatar"
          title={label}
          aria-label={label}
        >
          {user?.avatarEmoji ?? "🐺"}
        </div>
      </div>
    </header>
  );
}
