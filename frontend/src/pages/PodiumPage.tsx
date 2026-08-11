import PageHeader from "../components/layoutComponents/PageHeader.tsx";

export default function PodiumPage() {
  return (
    <main className="page-shell">
      <PageHeader backTo="/home">Podium</PageHeader>
      <section className="surface-card stack">
        <span className="section-label">Results</span>
        <p>Show the top three finishers and the round summary here.</p>
      </section>
    </main>
  );
}