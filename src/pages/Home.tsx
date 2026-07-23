import { Link } from "react-router-dom";
import { CoreProgressRing, StarCoreVisual } from "../components/StarCoreVisual";
import { STAR_CORE_CHARGE, featuredExperience } from "../data/mock";

const quickActions = [
  { to: "/discover?type=ar", label: "AR Portals" },
  { to: "/discover?type=mini-quest", label: "Mini-Quests" },
  { to: "/discover?type=story-branch", label: "Story Branches" },
  { to: "/pack", label: "Pack Howl" },
] as const;

export function Home() {
  return (
    <div className="page home-page home-hero-layout">
      {/* Title row: Home · Hero · 74% */}
      <div className="hero-title-row">
        <span className="hero-nav-label">Home</span>
        <h1 className="hero-center-title">Hero</h1>
        <div className="hero-percent" title="Star Core charge">
          <span>{STAR_CORE_CHARGE}%</span>
          <CoreProgressRing percent={STAR_CORE_CHARGE} size={40} />
        </div>
      </div>

      {/* Crystal heart Star Core */}
      <section className="hero-core-stage" aria-label="Star Core">
        <div className="hero-core-stars" aria-hidden />
        <StarCoreVisual percent={STAR_CORE_CHARGE} size="hero" />
      </section>

      {/* 2×2 glass action pills */}
      <nav className="hero-actions" aria-label="Quick actions">
        {quickActions.map((qa) => (
          <Link key={qa.label} to={qa.to} className="hero-action-pill">
            {qa.label}
          </Link>
        ))}
      </nav>

      {/* Featured Creation — Bolt */}
      <section className="hero-featured">
        <h2 className="hero-featured-label">Featured Creation</h2>
        <Link to={`/play/${featuredExperience.id}`} className="hero-featured-card">
          <img
            src={`${import.meta.env.BASE_URL}images/bolt-featured.png`}
            alt="Bolt — white cosmic companion with lightning"
            className="hero-featured-img"
            draggable={false}
          />
          <div className="hero-featured-gradient" />
          <div className="hero-featured-copy">
            <span className="hero-featured-kicker">StarBoltSprint</span>
            <span className="hero-featured-title">Bolt</span>
            <span className="hero-featured-cta">Play →</span>
          </div>
        </Link>
      </section>

      <p className="footer-howl footer-howl--compact">
        Powered by xAI & YOU · <strong>AROOOO</strong>
      </p>
    </div>
  );
}
