import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { ExperienceCard } from "../components/ExperienceCard";
import { discoverFeed, type ExperienceType, typeLabel } from "../data/mock";

const filters: { value: "" | ExperienceType; label: string }[] = [
  { value: "", label: "All" },
  { value: "mini-quest", label: "Mini-Quests" },
  { value: "story-branch", label: "Story Branches" },
  { value: "ar", label: "AR" },
  { value: "sprint", label: "Sprint" },
  { value: "social", label: "Social" },
];

export function Discover() {
  const [params, setParams] = useSearchParams();
  const type = (params.get("type") ?? "") as "" | ExperienceType;

  const items = useMemo(() => {
    if (!type) return discoverFeed;
    return discoverFeed.filter((e) => e.type === type);
  }, [type]);

  return (
    <div className="page">
      <h1 className="page-title">Discover</h1>
      <p className="page-sub">
        Community creations · Mini-Quests, Story Branches, AR portals, and more.
      </p>

      <div className="exp-tags" style={{ marginBottom: "1.25rem" }}>
        {filters.map((f) => {
          const active = type === f.value;
          return (
            <button
              key={f.label}
              type="button"
              className="tag"
              style={{
                cursor: "pointer",
                opacity: active ? 1 : 0.65,
                background: active ? "rgba(34, 211, 238, 0.22)" : undefined,
              }}
              onClick={() => {
                if (f.value) setParams({ type: f.value });
                else setParams({});
              }}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      {type && (
        <p className="page-sub" style={{ marginTop: "-0.5rem" }}>
          Showing: {typeLabel(type)}
        </p>
      )}

      <div className="stack">
        {items.map((exp) => (
          <ExperienceCard key={exp.id} experience={exp} />
        ))}
        {items.length === 0 && (
          <div className="stub-note">No experiences in this filter yet. Create one for the Pack.</div>
        )}
      </div>
    </div>
  );
}
