import Timer from "./Timer.tsx";
import WordReveal from "./WordReveal.tsx";

export default function GameStatusBar() {
  return (
    <div className="surface-card page-actions">
      <Timer />
      <WordReveal />
    </div>
  );
}