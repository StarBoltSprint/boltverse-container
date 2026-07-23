import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { useMemo, useState, useEffect, useCallback } from "react";
import {
  buildGenericResult,
  getExperienceById,
  loreQuiz,
  silentSeedStory,
  stormOrbQuest,
  type PlayResult,
  type StoryNode,
} from "../data/playContent";
import { typeLabel } from "../data/mock";
import { savePlayResult } from "../data/playSession";

export function Play() {
  const { id = "" } = useParams();
  const exp = useMemo(() => getExperienceById(id), [id]);

  if (!exp) {
    return (
      <div className="page">
        <div className="stub-note">Experience not found.</div>
        <Link to="/discover" className="btn-play">
          Back to Discover
        </Link>
      </div>
    );
  }

  // Dedicated samples
  if (exp.id === "feat-1" || exp.type === "sprint") {
    return <StormOrbQuest experienceId={exp.id} title={exp.title} emoji={exp.emoji} type={exp.type} />;
  }
  if (exp.id === "d-5" || (exp.type === "mini-quest" && exp.id !== "feat-1")) {
    return <LoreQuizQuest experienceId={exp.id} title={exp.title} emoji={exp.emoji} type={exp.type} />;
  }
  if (exp.id === "cont-1" || exp.type === "story-branch") {
    return <SilentSeedStory experienceId={exp.id} title={exp.title} emoji={exp.emoji} type={exp.type} />;
  }

  return <GenericPlay experienceId={exp.id} />;
}

function PlayChrome({
  title,
  emoji,
  liveResonance,
  onExit,
}: {
  title: string;
  emoji: string;
  liveResonance: number;
  onExit: () => void;
}) {
  return (
    <div className="play-chrome">
      <button type="button" className="play-exit" onClick={onExit}>
        ← Exit
      </button>
      <div className="play-chrome-title">
        <span aria-hidden>{emoji}</span> {title}
      </div>
      <div className="play-chrome-res">⚡ {liveResonance}</div>
    </div>
  );
}

function finish(navigate: ReturnType<typeof useNavigate>, result: PlayResult) {
  savePlayResult(result);
  navigate(`/results/${result.experienceId}`, { replace: true, state: result });
}

/* ─── Mini-Quest: Storm Orbs ─── */

function StormOrbQuest({
  experienceId,
  title,
  emoji,
  type,
}: {
  experienceId: string;
  title: string;
  emoji: string;
  type: PlayResult["type"];
}) {
  const navigate = useNavigate();
  const [orbs, setOrbs] = useState(0);
  const [timeLeft, setTimeLeft] = useState(stormOrbQuest.seconds);
  const [started, setStarted] = useState(false);
  const [burst, setBurst] = useState(0);

  useEffect(() => {
    if (!started || timeLeft <= 0) return;
    const t = window.setInterval(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [started, timeLeft]);

  const complete = useCallback(
    (collected: number) => {
      const ratio = collected / stormOrbQuest.targetOrbs;
      const personal = Math.round(stormOrbQuest.baseResonance * Math.min(1.2, 0.4 + ratio));
      const shared = Math.round(stormOrbQuest.sharedResonance * Math.min(1.15, 0.5 + ratio));
      finish(navigate, {
        experienceId,
        title,
        type,
        emoji,
        personalResonance: personal,
        sharedResonance: shared,
        coreDelta: `+0.00${2 + (collected % 4)}%`,
        rewards: stormOrbQuest.rewards,
        endingTitle: collected >= stormOrbQuest.targetOrbs ? "Lightning Dash cleared!" : "Sprint ended",
        endingSummary:
          collected >= stormOrbQuest.targetOrbs
            ? `You gathered all ${stormOrbQuest.targetOrbs} storm orbs. The corridor crackles with Pack energy.`
            : `You secured ${collected}/${stormOrbQuest.targetOrbs} orbs before the storm closed.`,
      });
    },
    [emoji, experienceId, navigate, title, type]
  );

  useEffect(() => {
    if (started && timeLeft <= 0) complete(orbs);
  }, [started, timeLeft, orbs, complete]);

  useEffect(() => {
    if (orbs >= stormOrbQuest.targetOrbs) complete(orbs);
  }, [orbs, complete]);

  function collect() {
    if (!started) setStarted(true);
    if (orbs >= stormOrbQuest.targetOrbs || timeLeft <= 0) return;
    setOrbs((o) => o + 1);
    setBurst((b) => b + 1);
  }

  return (
    <div className="page play-page">
      <PlayChrome
        title={title}
        emoji={emoji}
        liveResonance={orbs * 8}
        onExit={() => navigate(-1)}
      />
      <div className="play-stage play-stage--storm">
        <p className="play-hint">
          {typeLabel("sprint")} sample · Tap the storm to collect orbs before time runs out.
        </p>
        <div className="play-stats">
          <span>
            Orbs <strong>{orbs}</strong> / {stormOrbQuest.targetOrbs}
          </span>
          <span>
            Time <strong>{timeLeft}s</strong>
          </span>
        </div>
        <div className="bar play-bar" aria-hidden>
          <i style={{ width: `${(orbs / stormOrbQuest.targetOrbs) * 100}%` }} />
        </div>
        <button type="button" className="storm-hit" onClick={collect} key={burst}>
          <span className="storm-hit-glow" />
          <span className="storm-hit-label">{started ? "⚡ Collect orb" : "⚡ Start sprint"}</span>
        </button>
        <p className="play-foot">Each tap pulls a storm orb into your Resonance trail.</p>
      </div>
    </div>
  );
}

/* ─── Mini-Quest: Lore Quiz ─── */

function LoreQuizQuest({
  experienceId,
  title,
  emoji,
  type,
}: {
  experienceId: string;
  title: string;
  emoji: string;
  type: PlayResult["type"];
}) {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);

  const q = loreQuiz.questions[index];
  const done = index >= loreQuiz.questions.length;

  function answer(i: number) {
    if (picked !== null) return;
    setPicked(i);
    const isRight = i === q.correct;
    const nextCorrect = correct + (isRight ? 1 : 0);
    window.setTimeout(() => {
      if (index + 1 >= loreQuiz.questions.length) {
        const ratio = nextCorrect / loreQuiz.questions.length;
        finish(navigate, {
          experienceId,
          title,
          type,
          emoji,
          personalResonance: Math.round(loreQuiz.baseResonance * (0.5 + ratio * 0.7)),
          sharedResonance: Math.round(loreQuiz.sharedResonance * (0.5 + ratio * 0.6)),
          coreDelta: `+0.00${1 + nextCorrect}%`,
          rewards: loreQuiz.rewards,
          endingTitle: nextCorrect === 3 ? "Perfect Echo" : "Quiz complete",
          endingSummary: `You answered ${nextCorrect}/${loreQuiz.questions.length} correctly. Bolt nods. The Codex hums.`,
        });
      } else {
        setCorrect(nextCorrect);
        setIndex((n) => n + 1);
        setPicked(null);
      }
    }, 550);
  }

  if (done) return <Navigate to={`/results/${experienceId}`} replace />;

  return (
    <div className="page play-page">
      <PlayChrome
        title={title}
        emoji={emoji}
        liveResonance={correct * 25}
        onExit={() => navigate(-1)}
      />
      <div className="play-stage">
        <p className="play-hint">
          Mini-Quest sample · Question {index + 1} of {loreQuiz.questions.length}
        </p>
        <h2 className="play-question">{q.q}</h2>
        <div className="play-choices">
          {q.options.map((opt, i) => {
            let cls = "play-choice";
            if (picked !== null) {
              if (i === q.correct) cls += " correct";
              else if (i === picked) cls += " wrong";
            }
            return (
              <button key={opt} type="button" className={cls} onClick={() => answer(i)}>
                {opt}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ─── Story Branch: Silent Seed ─── */

function SilentSeedStory({
  experienceId,
  title,
  emoji,
  type,
}: {
  experienceId: string;
  title: string;
  emoji: string;
  type: PlayResult["type"];
}) {
  const navigate = useNavigate();
  const [nodeId, setNodeId] = useState("start");
  const [path, setPath] = useState<string[]>(["start"]);
  const node: StoryNode = silentSeedStory[nodeId] ?? silentSeedStory.start;

  function choose(next: string) {
    setPath((p) => [...p, next]);
    setNodeId(next);
  }

  function claimEnding() {
    const e = node.ending;
    if (!e) return;
    finish(navigate, {
      experienceId,
      title,
      type,
      emoji,
      personalResonance: e.resonance,
      sharedResonance: e.shared,
      coreDelta: `+0.0${Math.max(1, Math.floor(e.shared / 10))}%`,
      rewards: e.rewards,
      endingTitle: e.title,
      endingSummary: e.summary,
      codexUnlock: e.codexUnlock,
      choicePath: path,
    });
  }

  return (
    <div className="page play-page">
      <PlayChrome
        title={title}
        emoji={emoji}
        liveResonance={path.length * 20}
        onExit={() => navigate(-1)}
      />
      <div className="play-stage play-stage--story">
        <p className="play-hint">Story Branch sample · Choices shape the ending</p>
        <div className="story-bubble">
          <div className="story-speaker">{node.speaker}</div>
          <p className="story-text">{node.text}</p>
        </div>
        {node.choices && (
          <div className="play-choices">
            {node.choices.map((c) => (
              <button
                key={c.label}
                type="button"
                className="play-choice story-choice"
                onClick={() => choose(c.next)}
              >
                {c.label}
              </button>
            ))}
          </div>
        )}
        {node.ending && !node.choices && (
          <button
            type="button"
            className="btn-play"
            style={{ marginTop: "1rem" }}
            onClick={claimEnding}
          >
            Complete story · see results
          </button>
        )}
      </div>
    </div>
  );
}

/* ─── Generic short play ─── */

function GenericPlay({ experienceId }: { experienceId: string }) {
  const navigate = useNavigate();
  const exp = getExperienceById(experienceId)!;
  const [step, setStep] = useState(0);

  function advance() {
    if (step >= 2) {
      finish(navigate, buildGenericResult(exp, step * 10));
    } else {
      setStep((s) => s + 1);
    }
  }

  return (
    <div className="page play-page">
      <PlayChrome
        title={exp.title}
        emoji={exp.emoji}
        liveResonance={step * 20}
        onExit={() => navigate(-1)}
      />
      <div className="play-stage">
        <p className="play-hint">{typeLabel(exp.type)} · Short sample session</p>
        <h2 className="play-question">{exp.description}</h2>
        <p className="play-foot">Step {step + 1} of 3 — full systems coming later; this still grants mock Resonance.</p>
        <button type="button" className="btn-play" onClick={advance}>
          {step >= 2 ? "Finish" : "Continue"}
        </button>
      </div>
    </div>
  );
}
