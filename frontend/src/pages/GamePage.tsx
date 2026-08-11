import GameCanvasArea from "../components/gameComponents/GameCanvasArea.tsx";
import GameStatusBar from "../components/gameComponents/GameStatusBar.tsx";

export default function GamePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 flex flex-col items-center justify-center">
      <GameStatusBar />
      <GameCanvasArea />
    </main>
  );
}