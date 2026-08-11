type AnimatedLogoProps = {
  size?: number;
  hoverThreshold?: number;
};

export default function AnimatedLogo({ size = 120 }: AnimatedLogoProps) {
  return (
    <div
      className="animated-logo"
      style={{ width: size, height: size }}
      aria-label="Fire Water logo"
      role="img"
    >
      FW
    </div>
  );
}