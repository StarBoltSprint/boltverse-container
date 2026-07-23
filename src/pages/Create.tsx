import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useContent } from "../content/ContentContext";
import type { ExperienceType } from "../data/mock";
import { typeLabel } from "../data/mock";
import { ExperienceCard } from "../components/ExperienceCard";

const TEMPLATES: {
  type: ExperienceType;
  emoji: string;
  label: string;
  title: string;
  description: string;
  durationMin: number;
}[] = [
  {
    type: "mini-quest",
    emoji: "⚡",
    label: "Mini-Quest",
    title: "Lightning Lap",
    description: "Sprint a short loop and collect glowing shards before the timer ends.",
    durationMin: 4,
  },
  {
    type: "story-branch",
    emoji: "📖",
    label: "Story Branch",
    title: "Echo at the Gate",
    description: "A choice-driven tale at the Thunderwolf Gate. Speak with Bolt and decide.",
    durationMin: 10,
  },
  {
    type: "ar",
    emoji: "🌀",
    label: "AR Portal",
    title: "Pocket Rift",
    description: "Open a temporary AR portal on any flat surface and close three micro-rifts.",
    durationMin: 3,
  },
  {
    type: "social",
    emoji: "🐺",
    label: "Pack Howl",
    title: "Synchronized Howl",
    description: "Call the Pack to howl together and push shared Resonance into the Star Core.",
    durationMin: 2,
  },
];

const EMOJIS = ["⚡", "🌱", "🌀", "🐺", "📜", "🐾", "💎", "✨", "🔥", "🏰"];

export function Create() {
  const {
    drafts,
    published,
    saveDraft,
    deleteDraft,
    publishDraft,
    publishNew,
    displayName,
  } = useContent();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [type, setType] = useState<ExperienceType>("mini-quest");
  const [description, setDescription] = useState("");
  const [emoji, setEmoji] = useState("⚡");
  const [durationMin, setDurationMin] = useState(5);
  const [draftId, setDraftId] = useState<string | undefined>();
  const [banner, setBanner] = useState<string | null>(null);

  function applyTemplate(t: (typeof TEMPLATES)[number]) {
    setType(t.type);
    setTitle(t.title);
    setDescription(t.description);
    setEmoji(t.emoji);
    setDurationMin(t.durationMin);
    setDraftId(undefined);
    setBanner(`Template loaded: ${t.label}`);
  }

  function loadDraft(id: string) {
    const d = drafts.find((x) => x.id === id);
    if (!d) return;
    setDraftId(d.id);
    setTitle(d.title);
    setType(d.type);
    setDescription(d.description);
    setEmoji(d.emoji);
    setDurationMin(d.durationMin);
    setBanner("Draft loaded");
  }

  function onSaveDraft() {
    const d = saveDraft({
      id: draftId,
      title,
      type,
      description,
      emoji,
      durationMin,
    });
    setDraftId(d.id);
    setBanner("Draft saved — not on Discover yet. Publish when ready.");
  }

  function onPublish() {
    if (!title.trim()) {
      setBanner("Add a title before publishing.");
      return;
    }
    let exp;
    if (draftId && drafts.some((d) => d.id === draftId)) {
      exp = publishDraft(draftId);
    } else {
      exp = publishNew({ title, type, description, emoji, durationMin });
    }
    if (!exp) {
      setBanner("Could not publish.");
      return;
    }
    setDraftId(undefined);
    setTitle("");
    setDescription("");
    setBanner(`Published “${exp.title}” — live on Discover as ${displayName}.`);
    window.setTimeout(() => navigate("/discover"), 700);
  }

  return (
    <div className="page">
      <h1 className="page-title">Create</h1>
      <p className="page-sub">
        Forge an experience, save a draft, then <strong>Publish to the Pack</strong> — it appears on
        Discover immediately (mock local publish).
      </p>

      {banner && (
        <div className="success-banner" role="status">
          {banner}
        </div>
      )}

      <div className="stack">
        <section className="panel">
          <h2 className="panel-title">Templates</h2>
          <div className="quick-actions">
            {TEMPLATES.map((t) => (
              <button key={t.label} type="button" className="qa-btn" onClick={() => applyTemplate(t)}>
                <span className="qa-icon">{t.emoji}</span>
                <span className="qa-label">{t.label}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="panel create-form">
          <h2 className="panel-title">Forge with the Pack</h2>

          <label className="field">
            <span>Title</span>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Name your creation"
              maxLength={60}
            />
          </label>

          <label className="field">
            <span>Type</span>
            <select value={type} onChange={(e) => setType(e.target.value as ExperienceType)}>
              {(
                [
                  "mini-quest",
                  "story-branch",
                  "ar",
                  "sprint",
                  "social",
                ] as ExperienceType[]
              ).map((t) => (
                <option key={t} value={t}>
                  {typeLabel(t)}
                </option>
              ))}
            </select>
          </label>

          <label className="field">
            <span>Description</span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What does the player do? What does Bolt say?"
              rows={3}
              maxLength={280}
            />
          </label>

          <div className="field-row">
            <label className="field">
              <span>Duration (min)</span>
              <input
                type="number"
                min={1}
                max={30}
                value={durationMin}
                onChange={(e) => setDurationMin(Number(e.target.value) || 5)}
              />
            </label>
            <div className="field">
              <span>Emoji</span>
              <div className="emoji-row">
                {EMOJIS.map((e) => (
                  <button
                    key={e}
                    type="button"
                    className={`emoji-pick${emoji === e ? " on" : ""}`}
                    onClick={() => setEmoji(e)}
                  >
                    {e}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="create-actions">
            <button type="button" className="btn-ghost" onClick={onSaveDraft}>
              Save draft
            </button>
            <button type="button" className="btn-play" onClick={onPublish}>
              Publish to the Pack
            </button>
          </div>
        </section>

        <section className="panel">
          <h2 className="panel-title">Your drafts ({drafts.length})</h2>
          {drafts.length === 0 ? (
            <div className="stub-note" style={{ marginBottom: 0 }}>
              No drafts yet. Use a template or fill the form and save.
            </div>
          ) : (
            <div className="stack">
              {drafts.map((d) => (
                <div key={d.id} className="draft-row">
                  <div>
                    <strong>
                      {d.emoji} {d.title || "Untitled"}
                    </strong>
                    <p>
                      {typeLabel(d.type)} · {d.durationMin} min
                    </p>
                  </div>
                  <div className="draft-row-actions">
                    <button type="button" className="btn-ghost" onClick={() => loadDraft(d.id)}>
                      Edit
                    </button>
                    <button
                      type="button"
                      className="btn-play"
                      onClick={() => {
                        const exp = publishDraft(d.id);
                        if (exp) {
                          setBanner(`Published “${exp.title}”`);
                          navigate("/discover");
                        }
                      }}
                    >
                      Publish
                    </button>
                    <button type="button" className="btn-ghost" onClick={() => deleteDraft(d.id)}>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="panel">
          <h2 className="panel-title">Your published ({published.length})</h2>
          {published.length === 0 ? (
            <div className="stub-note" style={{ marginBottom: 0 }}>
              Nothing published yet. Publish to see cards on Discover.
            </div>
          ) : (
            <div className="stack">
              {published.map((exp) => (
                <ExperienceCard key={exp.id} experience={exp} />
              ))}
              <Link to="/discover" className="btn-ghost" style={{ alignSelf: "flex-start" }}>
                Open Discover →
              </Link>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
