import { Link } from "react-router-dom";
import { ExperienceCard } from "../components/ExperienceCard";
import {
  STAR_CORE_CHARGE,
  continueExperiences,
  dailyChallenges,
  featuredExperience,
  globalEvent,
} from "../data/mock";

const quickActions = [
  { to: "/discover?type=ar", icon: "🌀", label: "AR Portals" },
  { to: "/discover?type=mini-quest", icon: "⚡", label: "Mini-Quests" },
  { to: "/discover?type=story-branch", icon: "📖", label: "Story Branches" },
  { to: "/pack", icon: "🐺", label: "Pack Howl" },
] as const;

export function Home() {
  return (
    <div className="page">
      {globalEvent.active && (
        <div className="event-banner" role="status">
          <span className="event-icon" aria-hidden>
            🔥
          </span>
          <div>
            <strong>{globalEvent.title}</strong>
            <span>{globalEvent.detail}</span>
          </div>
        </div>
      )}

      <div className="home-grid">
        <div className="stack">
          <section className="panel core-hero">
            <p className="core-caption">The Heart of the Pack</p>
            <div className="core-orb" aria-hidden />
            <h2>{STAR_CORE_CHARGE}%</h2>
            <p>
              Star Core charging · every Mini-Quest and Story Branch feeds the living heart
            </p>
          </section>

          <section className="panel">
            <h2 className="panel-title">Quick actions</h2>
            <div className="quick-actions">
              {quickActions.map((qa) => (
                <Link key={qa.label} to={qa.to} className="qa-btn">
                  <span className="qa-icon" aria-hidden>
                    {qa.icon}
                  </span>
                  <span className="qa-label">{qa.label}</span>
                </Link>
              ))}
            </div>
          </section>

          <section className="panel">
            <h2 className="panel-title">Featured by the Pack</h2>
            <ExperienceCard experience={featuredExperience} featured />
          </section>
        </div>

        <div className="stack">
          <section className="panel">
            <h2 className="panel-title">Continue your journey</h2>
            <div className="stack">
              {continueExperiences.map((exp) => (
                <ExperienceCard key={exp.id} experience={exp} />
              ))}
            </div>
          </section>

          <section className="panel">
            <h2 className="panel-title">Daily challenges</h2>
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
        Powered by xAI & YOU · <strong>AROOOO</strong> ⚡🐺
      </p>
    </div>
  );
}
