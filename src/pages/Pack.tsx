export function Pack() {
  return (
    <div className="page">
      <h1 className="page-title">Pack</h1>
      <p className="page-sub">Howls, shared goals, leaderboards — the collective pulse of the Citadel.</p>

      <div className="stub-note">
        Scaffold only — live multiplayer Howls and real leaderboards need the shared backend later.
      </div>

      <div className="home-grid">
        <section className="panel core-hero" style={{ minHeight: 200 }}>
          <p className="core-caption">Pack Howl</p>
          <div style={{ fontSize: "3rem" }} aria-hidden>
            🐺
          </div>
          <p>Join a synchronized Howl and charge the Star Core together.</p>
          <button type="button" className="btn-play" style={{ marginTop: "0.5rem" }}>
            Start Howl
          </button>
        </section>

        <section className="panel">
          <h2 className="panel-title">Shared goals</h2>
          <div className="challenge-row">
            <div className="challenge-head">
              <strong>Complete 50,000 Mini-Quests together</strong>
              <span>62%</span>
            </div>
            <div className="bar" aria-hidden>
              <i style={{ width: "62%" }} />
            </div>
          </div>
          <div className="challenge-row">
            <div className="challenge-head">
              <strong>Publish 1,000 Story Branches this week</strong>
              <span>28%</span>
            </div>
            <div className="bar" aria-hidden>
              <i style={{ width: "28%" }} />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
