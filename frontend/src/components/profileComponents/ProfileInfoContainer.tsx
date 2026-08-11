import type { CSSProperties, ReactNode } from "react";

type InfoContainerProps = {
  title: string;
  children: ReactNode;
  pillStyles?: CSSProperties;
  containerStyles?: CSSProperties;
};

export default function ProfileInfoContainer({
  title,
  children,
  pillStyles,
  containerStyles,
}: InfoContainerProps) {
  return (
    <section className="surface-card stack" style={containerStyles}>
      <span className="section-label" style={pillStyles}>{title}</span>
      <div>{children}</div>
    </section>
  );
}