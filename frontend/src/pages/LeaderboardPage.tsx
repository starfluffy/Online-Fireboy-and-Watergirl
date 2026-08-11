import PageHeader from "../components/layoutComponents/PageHeader.tsx";

export default function LeaderboardPage() {
  return (
    <main className="page-shell">
      <PageHeader backTo="/home">Leaderboard</PageHeader>
      <section className="surface-card stack">
        <span className="section-label">Scaffold</span>
        <p>Replace this leaderboard shell with the real ranking view.</p>
      </section>
    </main>
  );
}