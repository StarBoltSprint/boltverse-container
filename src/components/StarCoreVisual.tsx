interface Props {
  percent: number;
  size?: "hero" | "sm";
}

export function StarCoreVisual({ percent, size = "hero" }: Props) {
  const clamped = Math.max(0, Math.min(100, percent));
  return (
    <div
      className={`star-core-visual star-core-visual--${size}`}
      style={{ ["--core-pct" as string]: `${clamped}%` }}
      aria-hidden
    >
      <div className="star-core-ring star-core-ring--outer" />
      <div className="star-core-ring star-core-ring--mid" />
      <div className="star-core-ring star-core-ring--inner" />
      <div className="star-core-orb">
        <div className="star-core-orb-shine" />
        <div className="star-core-orb-veins" />
      </div>
      <div className="star-core-spark star-core-spark--1" />
      <div className="star-core-spark star-core-spark--2" />
      <div className="star-core-spark star-core-spark--3" />
    </div>
  );
}
