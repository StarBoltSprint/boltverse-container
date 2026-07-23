import { Link } from "react-router-dom";
import type { Experience } from "../data/mock";
import { typeLabel } from "../data/mock";

interface Props {
  experience: Experience;
  featured?: boolean;
}

export function ExperienceCard({ experience, featured }: Props) {
  const playTo = `/play/${experience.id}`;

  return (
    <article className={`exp-card${featured ? " featured" : ""}`}>
      <div className="exp-thumb" aria-hidden>
        <span>{experience.emoji}</span>
      </div>
      <div className="exp-meta">
        <div className="exp-meta-top">
          <h3>{experience.title}</h3>
          {!featured && (
            <Link to={playTo} className="btn-play btn-play--sm">
              Play
            </Link>
          )}
        </div>
        <p className="exp-line">
          <span className="exp-type">{typeLabel(experience.type)}</span>
          <span className="exp-dot">·</span>
          {experience.durationMin} min
          <span className="exp-dot">·</span>
          {experience.creator}
          {!featured && (
            <>
              <span className="exp-dot">·</span>
              {experience.playCount.toLocaleString()} plays
            </>
          )}
        </p>
        {featured && <p className="exp-desc">{experience.description}</p>}
        <div className="exp-tags">
          {experience.tags.slice(0, featured ? 4 : 2).map((t) => (
            <span key={t} className="tag">
              {t}
            </span>
          ))}
        </div>
        {featured && (
          <Link to={playTo} className="btn-play">
            Play now
          </Link>
        )}
      </div>
    </article>
  );
}
