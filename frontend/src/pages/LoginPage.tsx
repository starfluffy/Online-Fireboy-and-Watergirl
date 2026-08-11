import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import AnimatedLogo from "../components/homeComponents/AnimatedLogo.tsx";
import GoogleSignInButton from "../components/signInComponents/GoogleSignInButton.tsx";
import { AuthContext } from "../context/AuthContext.tsx";
import { UsersContext } from "../context/UsersContext.tsx";

export default function LoginPage() {
  const navigate = useNavigate();
  const { setJwt, setIsAuthenticated, setProgress } = useContext(AuthContext);
  const { refreshUsers } = useContext(UsersContext);

  const handleGoogleResponse = async () => {
    setJwt("demo.jwt.token");
    setIsAuthenticated(true);
    setProgress(0);
    await refreshUsers();
    navigate("/home");
  };

  return (
    <main className="page-shell">
      <section className="surface-card stack">
        <AnimatedLogo size={128} />
        <span className="section-label">Login</span>
        <h1 className="page-title">Sign in to continue</h1>
        <p>This is the scaffolded sign-in screen. Swap this with your real auth flow later.</p>
        <GoogleSignInButton onSignInSuccess={handleGoogleResponse} />
      </section>
    </main>
  );
}