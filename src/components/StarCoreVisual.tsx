interface Props {
  percent: number;
  size?: "hero" | "sm" | "pill";
}

/** Crystal heart Star Core — uses provided art asset */
export function StarCoreVisual({ percent, size = "hero" }: Props) {
  const clamped = Math.max(0, Math.min(100, percent));
  return (
    <div
      className={`star-core-visual star-core-visual--${size}`}
      style={{ ["--core-pct" as string]: `${clamped}%` }}
      aria-hidden
    >
      <div className="star-core-bloom" />
      <img
        className="star-core-heart-img"
        src={`${import.meta.env.BASE_URL}images/star-core-heart.png`}
        alt=""
        draggable={false}
      />
      <div className="star-core-spark star-core-spark--1" />
      <div className="star-core-spark star-core-spark--2" />
    </div>
  );
}

/** Circular progress ring for 74% display */
export function CoreProgressRing({ percent, size = 44 }: { percent: number; size?: number }) {
  const r = 16;
  const c = 2 * Math.PI * r;
  const clamped = Math.max(0, Math.min(100, percent));
  const offset = c - (clamped / 100) * c;
  return (
    <svg
      className="core-progress-ring"
      width={size}
      height={size}
      viewBox="0 0 40 40"
      aria-hidden
    >
      <circle className="core-progress-track" cx="20" cy="20" r={r} fill="none" strokeWidth="3" />
      <circle
        className="core-progress-value"
        cx="20"
        cy="20"
        r={r}
        fill="none"
        strokeWidth="3"
        strokeDasharray={c}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform="rotate(-90 20 20)"
      />
    </svg>
  );
}
