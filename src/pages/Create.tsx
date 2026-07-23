export function Create() {
  return (
    <div className="page">
      <h1 className="page-title">Create</h1>
      <p className="page-sub">Forge Mini-Quests and Story Branches with Grok, then publish to the Pack.</p>

      <div className="stub-note">
        Scaffold only — full Grok co-author + Publish pipeline comes next. Templates and draft list
        are placeholders for the IA Create hub.
      </div>

      <div className="stack">
        <section className="panel">
          <h2 className="panel-title">Create with Grok</h2>
          <button type="button" className="btn-play" style={{ width: "100%", padding: "0.9rem" }}>
            Start a new experience
          </button>
        </section>

        <section className="panel">
          <h2 className="panel-title">Templates</h2>
          <div className="quick-actions">
            {["Mini-Quest", "Story Branch", "AR Portal", "Pack Howl"].map((t) => (
              <button key={t} type="button" className="qa-btn">
                <span className="qa-icon">✨</span>
                <span className="qa-label">{t}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="panel">
          <h2 className="panel-title">Your drafts</h2>
          <div className="stub-note" style={{ marginBottom: 0 }}>
            No drafts yet. Your first creation will appear here.
          </div>
        </section>
      </div>
    </div>
  );
}
