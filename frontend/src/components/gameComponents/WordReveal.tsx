type WordRevealProps = {
  word?: string;
};

export default function WordReveal({ word = "hidden word" }: WordRevealProps) {
  return <div className="surface-card">Word reveal: {word}</div>;
}