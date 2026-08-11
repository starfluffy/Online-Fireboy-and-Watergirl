import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/layoutComponents/PageHeader.tsx";
import { GameStateContext } from "../context/GameStateContext.tsx";

export default function LobbyPage() {
  const navigate = useNavigate();
  const { lobbyPlayers, setIsSelectingWord } = useContext(GameStateContext);

  return (
    <main className="page-shell">
      <PageHeader backTo="/home" exitLobby>
        Lobby
      </PageHeader>
      <section className="surface-card stack">
        <span className="section-label">Players</span>
        <p>{lobbyPlayers.map((player) => player.username).join(", ")}</p>
        <div className="page-actions">
          <button
            type="button"
            className="primary-action"
            onClick={() => {
              setIsSelectingWord(true);
              navigate("/play");
            }}
          >
            Start game
          </button>
        </div>
      </section>
    </main>
  );
}