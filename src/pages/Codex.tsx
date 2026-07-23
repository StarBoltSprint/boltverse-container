import { codexEntries } from "../data/mock";

export function Codex() {
  return (
    <div className="page">
      <h1 className="page-title">Codex</h1>
      <p className="page-sub">Living lore of the Boltverse — unlock entries through play and story.</p>

      <div className="stub-grid">
        {codexEntries.map((entry) => (
          <article
            key={entry.id}
            className={`codex-card${entry.unlocked ? "" : " locked"}`}
          >
            <div className="section">
              {entry.section}
              {!entry.unlocked && " · Locked"}
            </div>
            <h3>
              {entry.unlocked ? entry.title : "??????"}
            </h3>
            <p>{entry.unlocked ? entry.blurb : "Complete the linked Story Branch to reveal."}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
