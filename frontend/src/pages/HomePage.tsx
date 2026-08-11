import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import AnimatedLogo from "../components/homeComponents/AnimatedLogo.tsx";
import InfoPopup from "../components/homeComponents/InfoPopup.tsx";
import { AuthContext } from "../context/AuthContext.tsx";
import useCurrentUser from "../hooks/useCurrentUser.ts";

export default function HomePage() {
  const navigate = useNavigate();
  const currentUser = useCurrentUser();
  const { clearJwt, setIsAuthenticated } = useContext(AuthContext);
  const [showInfo, setShowInfo] = useState(false);

  return (
    <main className="page-shell">
      <section className="hero-card">
        <p className="eyebrow">Home</p>
        <AnimatedLogo size={110} />
        <h1>Welcome, {currentUser?.username ?? "Guest"}.</h1>
        <p className="lede">This home page is a scaffolded landing area for the app's main flow.</p>
        <div className="hero-actions">
          <button type="button" className="primary-action" onClick={() => navigate("/lobby")}>
            Enter lobby
          </button>
          <button type="button" className="secondary-action" onClick={() => navigate("/profile")}>
            Profile
          </button>
          <button type="button" className="secondary-action" onClick={() => navigate("/leaderboard")}>
            Leaderboard
          </button>
          <button
            type="button"
            className="secondary-action"
            onClick={() => {
              clearJwt();
              setIsAuthenticated(false);
              navigate("/login");
            }}
          >
            Logout
          </button>
        </div>
      </section>

      <section className="page-card-grid">
        <article className="surface-card stack">
          <span className="section-label">Structure</span>
          <p>The routed pages, contexts, hooks, and services now match the Inky-style shape.</p>
        </article>
        <article className="surface-card stack">
          <span className="section-label">Next</span>
          <p>Replace the placeholder screens with your actual app content and business logic.</p>
        </article>
      </section>

      {showInfo ? <InfoPopup onClose={() => setShowInfo(false)} /> : null}
    </main>
  );
}