import { useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ExperienceCard } from "../components/ExperienceCard";
import { useContent } from "../content/ContentContext";
import type { ExperienceType } from "../data/mock";
import { typeLabel } from "../data/mock";

const filters: { value: "" | ExperienceType | "mine"; label: string }[] = [
  { value: "", label: "All" },
  { value: "mine", label: "My publishes" },
  { value: "mini-quest", label: "Mini-Quests" },
  { value: "story-branch", label: "Story Branches" },
  { value: "ar", label: "AR" },
  { value: "sprint", label: "Sprint" },
  { value: "social", label: "Social" },
];

export function Discover() {
  const { discoverFeed, published } = useContent();
  const [params, setParams] = useSearchParams();
  const type = (params.get("type") ?? "") as "" | ExperienceType | "mine";

  const items = useMemo(() => {
    if (type === "mine") return published;
    if (!type) return discoverFeed;
    return discoverFeed.filter((e) => e.type === type);
  }, [type, discoverFeed, published]);

  return (
    <div className="page">
      <h1 className="page-title">Discover</h1>
      <p className="page-sub">
        Community creations · including anything you publish from Create.
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

      {type && type !== "mine" && (
        <p className="page-sub" style={{ marginTop: "-0.5rem" }}>
          Showing: {typeLabel(type)}
        </p>
      )}
      {type === "mine" && (
        <p className="page-sub" style={{ marginTop: "-0.5rem" }}>
          Showing: your published creations ({published.length})
        </p>
      )}

      <div className="stack">
        {items.map((exp) => (
          <ExperienceCard key={exp.id} experience={exp} />
        ))}
        {items.length === 0 && (
          <div className="stub-note">
            Nothing here yet.{" "}
            <Link to="/create" style={{ color: "var(--cyan)" }}>
              Create and publish
            </Link>{" "}
            for the Pack.
          </div>
        )}
      </div>
    </div>
  );
}
