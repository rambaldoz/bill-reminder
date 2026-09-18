export function DonutChart({
  segments,
  size = 176,
  thickness = 26,
  centerLabel,
}: {
  segments: { key: string; value: number; color: string }[];
  size?: number;
  thickness?: number;
  centerLabel?: React.ReactNode;
}) {
  const total = segments.reduce((sum, seg) => sum + seg.value, 0);
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--border)"
          strokeWidth={thickness}
        />
        {total > 0 &&
          segments.map((seg) => {
            const fraction = seg.value / total;
            const dash = fraction * circumference;
            const dashOffset = -offset;
            offset += dash;
            return (
              <circle
                key={seg.key}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={seg.color}
                strokeWidth={thickness}
                strokeDasharray={`${dash} ${circumference - dash}`}
                strokeDashoffset={dashOffset}
              />
            );
          })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        {centerLabel}
      </div>
    </div>
  );
}
