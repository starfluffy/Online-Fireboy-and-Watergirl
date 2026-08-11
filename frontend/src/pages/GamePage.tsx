import { useContext } from "react";
import PageHeader from "../components/layoutComponents/PageHeader.tsx";
import GameCanvasArea from "../components/gameComponents/GameCanvasArea.tsx";
import GameStatusBar from "../components/gameComponents/GameStatusBar.tsx";
import WordSelection from "../components/gameComponents/WordSelection.tsx";
import { GameStateContext } from "../context/GameStateContext.tsx";

export default function GamePage() {
  const { isSelectingWord, phrases, setWordToGuess, setIsSelectingWord } = useContext(GameStateContext);

  return (
    <main className="page-shell">
      <PageHeader backTo="/lobby">Game</PageHeader>
      <GameStatusBar />
      {isSelectingWord ? (
        <WordSelection
          phrases={phrases}
          onSelect={(phrase) => {
            setWordToGuess(phrase);
            setIsSelectingWord(false);
          }}
        />
      ) : (
        <GameCanvasArea />
      )}
    </main>
  );
}