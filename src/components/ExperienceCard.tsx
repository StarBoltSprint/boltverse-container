import type { Experience } from "../data/mock";
import { typeLabel } from "../data/mock";

interface Props {
  experience: Experience;
  featured?: boolean;
}

export function ExperienceCard({ experience, featured }: Props) {
  return (
    <article className={`exp-card${featured ? " featured" : ""}`}>
      <div className="exp-thumb" aria-hidden>
        {experience.emoji}
      </div>
      <div className="exp-meta">
        <h3>{experience.title}</h3>
        <p>
          {typeLabel(experience.type)} · {experience.durationMin} min ·{" "}
          {experience.creator}
          {!featured && ` · ${experience.playCount.toLocaleString()} plays`}
        </p>
        {featured && <p style={{ marginTop: "0.35rem" }}>{experience.description}</p>}
        <div className="exp-tags">
          {experience.tags.slice(0, featured ? 4 : 2).map((t) => (
            <span key={t} className="tag">
              {t}
            </span>
          ))}
        </div>
        {featured && (
          <button type="button" className="btn-play">
            Play
          </button>
        )}
      </div>
      {!featured && (
        <button type="button" className="btn-play">
          Play
        </button>
      )}
    </article>
  );
}
