import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { socket } from "../../services/socket.ts";
import useCurrentUser from "../../hooks/useCurrentUser.ts";

type PageHeaderProps = {
  children: ReactNode;
  backTo?: string;
  exitLobby?: boolean;
  marginTop?: string;
};

export default function PageHeader({
  children,
  backTo = "/home",
  exitLobby = false,
  marginTop = "",
}: PageHeaderProps) {
  const navigate = useNavigate();
  const currentUser = useCurrentUser();

  const handleBackButtonClick = () => {
    navigate(backTo);
    if (exitLobby && currentUser) {
      socket.emit("player-leave", currentUser);
    }
  };

  return (
    <header className="surface-card page-header" style={marginTop ? { marginTop } : undefined}>
      <button type="button" className="muted-button" onClick={handleBackButtonClick}>
        Back
      </button>
      <h1 className="page-title">{children}</h1>
      <span />
    </header>
  );
}