import { PERSONAL_RESONANCE, PLAYER_NAME, STAR_CORE_CHARGE } from "../data/mock";
import { usePlatform } from "../platform/PlatformContext";
import { PLATFORMS } from "../platform/types";

export function TopBar() {
  const { platform, resetPlatform, isMobile } = usePlatform();
  const meta = PLATFORMS.find((p) => p.id === platform);

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
        <div className="avatar" title={PLAYER_NAME} aria-label={PLAYER_NAME}>
          🐺
        </div>
      </div>
    </header>
  );
}
