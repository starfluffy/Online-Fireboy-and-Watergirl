import type { CSSProperties, ReactNode } from "react";

type InfoPillProps = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
};

export default function InfoPill({ children, className = "", style }: InfoPillProps) {
  return (
    <span className={`info-pill ${className}`.trim()} style={style}>
      {children}
    </span>
  );
}