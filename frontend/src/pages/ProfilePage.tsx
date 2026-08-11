import PageHeader from "../components/layoutComponents/PageHeader.tsx";
import ProfilePicture from "../components/profileComponents/ProfilePicture.tsx";
import ProfileInfoContainer from "../components/profileComponents/ProfileInfoContainer.tsx";
import PowerupAchievement from "../components/profileComponents/PowerupAchievement.tsx";
import GameAchievement from "../components/profileComponents/GameAchievement.tsx";
import useCurrentUser from "../hooks/useCurrentUser.ts";

export default function ProfilePage() {
  const currentUser = useCurrentUser();

  return (
    <main className="page-shell">
      <PageHeader backTo="/home">Profile</PageHeader>
      <section className="page-card-grid">
        <ProfileInfoContainer title="Identity">
          <div className="stack">
            <ProfilePicture username={currentUser?.username ?? "P"} />
            <p>{currentUser?.username ?? "Player One"}</p>
          </div>
        </ProfileInfoContainer>
        <ProfileInfoContainer title="Achievements">
          <div className="stack">
            <PowerupAchievement />
            <GameAchievement />
          </div>
        </ProfileInfoContainer>
      </section>
    </main>
  );
}