import { Link } from "react-router-dom";
import { ExperienceCard } from "../components/ExperienceCard";
import { StarCoreVisual } from "../components/StarCoreVisual";
import {
  STAR_CORE_CHARGE,
  continueExperiences,
  dailyChallenges,
  featuredExperience,
  globalEvent,
} from "../data/mock";

const quickActions = [
  { to: "/discover?type=ar", icon: "◎", label: "AR Portals", hint: "Real-world rifts" },
  { to: "/discover?type=mini-quest", icon: "⚡", label: "Mini-Quests", hint: "2–8 min sprints" },
  { to: "/discover?type=story-branch", icon: "◈", label: "Story Branches", hint: "Choice & lore" },
  { to: "/pack", icon: "☾", label: "Pack Howl", hint: "Charge together" },
] as const;

export function Home() {
  return (
    <div className="page home-page">
      <header className="home-header">
        <div>
          <p className="home-kicker">Thunderwolf Citadel</p>
          <h1 className="home-welcome">Welcome back, Guardian</h1>
        </div>
        <p className="home-header-sub">
          Sprint, choose, create — every action feeds the living Star Core.
        </p>
      </header>

      {globalEvent.active && (
        <div className="event-banner" role="status">
          <span className="event-icon" aria-hidden>
            ✦
          </span>
          <div>
            <strong>{globalEvent.title}</strong>
            <span>{globalEvent.detail}</span>
          </div>
          <Link to="/discover?type=mini-quest" className="event-cta">
            Jump in
          </Link>
        </div>
      )}

      <div className="home-grid">
        <div className="stack home-main-col">
          <section className="panel core-hero">
            <div className="core-hero-inner">
              <div className="core-hero-visual">
                <StarCoreVisual percent={STAR_CORE_CHARGE} />
              </div>
              <div className="core-hero-copy">
                <p className="core-caption">The Heart of the Pack</p>
                <h2 className="core-percent">
                  {STAR_CORE_CHARGE}
                  <span>%</span>
                </h2>
                <p className="core-blurb">
                  Shared charge from every Mini-Quest, Story Branch, Howl, and creation.
                </p>
                <div className="core-meter" aria-hidden>
                  <i style={{ width: `${STAR_CORE_CHARGE}%` }} />
                </div>
                <p className="core-meter-label">Core Pulse unlocks at 100%</p>
              </div>
            </div>
          </section>

          <section className="panel panel--soft">
            <div className="panel-head">
              <h2 className="panel-title">Quick actions</h2>
            </div>
            <div className="quick-actions">
              {quickActions.map((qa) => (
                <Link key={qa.label} to={qa.to} className="qa-btn">
                  <span className="qa-icon" aria-hidden>
                    {qa.icon}
                  </span>
                  <span className="qa-label">{qa.label}</span>
                  <span className="qa-hint">{qa.hint}</span>
                </Link>
              ))}
            </div>
          </section>

          <section className="panel panel--featured">
            <div className="panel-head">
              <h2 className="panel-title">Featured by the Pack</h2>
              <span className="panel-badge">Citadel’s Choice</span>
            </div>
            <ExperienceCard experience={featuredExperience} featured />
          </section>
        </div>

        <div className="stack home-side-col">
          <section className="panel">
            <div className="panel-head">
              <h2 className="panel-title">Continue your journey</h2>
            </div>
            <div className="stack stack--tight">
              {continueExperiences.map((exp) => (
                <ExperienceCard key={exp.id} experience={exp} />
              ))}
            </div>
          </section>

          <section className="panel">
            <div className="panel-head">
              <h2 className="panel-title">Daily challenges</h2>
            </div>
            {dailyChallenges.map((c) => {
              const pct = Math.min(100, Math.round((c.progress / c.total) * 100));
              return (
                <div key={c.id} className="challenge-row">
                  <div className="challenge-head">
                    <strong>{c.label}</strong>
                    <span>
                      {c.progress}/{c.total}
                    </span>
                  </div>
                  <div className="bar" aria-hidden>
                    <i style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </section>
        </div>
      </div>

      <p className="footer-howl">
        Powered by xAI & YOU · <strong>AROOOO</strong>
      </p>
    </div>
  );
}
