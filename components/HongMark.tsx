type Props = { className?: string; variant?: "navy" | "cream" };

export function HongMark({ className = "", variant = "navy" }: Props) {
  const ink = variant === "navy" ? "#1e2957" : "#f6f1e4";
  const bandana = "#dd1f26";
  return (
    <svg
      viewBox="0 0 64 64"
      role="img"
      aria-label="Hong for Wisconsin"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="32" cy="34" r="22" fill={ink} />
      <circle cx="32" cy="34" r="11" fill="none" stroke={variant === "navy" ? "#f6f1e4" : "#1e2957"} strokeWidth="6" />
      {/* bandana — knotted top */}
      <path
        d="M14 14 L32 6 L50 14 L46 22 Q32 16 18 22 Z"
        fill={bandana}
      />
      <path
        d="M50 14 L58 12 L54 22 Z"
        fill={bandana}
      />
      <path
        d="M14 14 L6 12 L10 22 Z"
        fill={bandana}
      />
      <path d="M22 17 L26 19 M30 16 L34 18 M38 17 L42 19" stroke="#f6f1e4" strokeWidth="1.2" strokeLinecap="round" opacity="0.7"/>
    </svg>
  );
}
