import { useNavigate } from "react-router-dom";
import { usePlatform } from "../platform/PlatformContext";
import { PLATFORMS, type Platform } from "../platform/types";

export function PlatformSelect() {
  const { setPlatform } = usePlatform();
  const navigate = useNavigate();

  function choose(id: Platform) {
    setPlatform(id);
    navigate("/", { replace: true });
  }

  return (
    <div className="platform-gate">
      <div className="platform-gate-bg" aria-hidden />
      <div className="platform-gate-card">
        <div className="platform-gate-brand">
          <span className="platform-gate-mark" aria-hidden>
            ⚡
          </span>
          <div>
            <h1>Boltverse</h1>
            <p>Digital Citadel · Official Container</p>
          </div>
        </div>

        <h2 className="platform-gate-title">Choose your experience</h2>
        <p className="platform-gate-sub">
          Pick a layout before entering the Citadel. You can change this anytime from the shell.
        </p>

        <div className="platform-cards">
          {PLATFORMS.map((p) => (
            <button
              key={p.id}
              type="button"
              className={`platform-card platform-card--${p.id}`}
              onClick={() => choose(p.id)}
            >
              <span className="platform-card-icon" aria-hidden>
                {p.icon}
              </span>
              <span className="platform-card-label">{p.label}</span>
              <span className="platform-card-short">{p.short}</span>
              <span className="platform-card-blurb">{p.blurb}</span>
              <span className="platform-card-cta">Enter →</span>
            </button>
          ))}
        </div>

        <p className="platform-gate-foot">
          Powered by xAI & YOU · <strong>AROOOO</strong> ⚡🐺
        </p>
      </div>
    </div>
  );
}
