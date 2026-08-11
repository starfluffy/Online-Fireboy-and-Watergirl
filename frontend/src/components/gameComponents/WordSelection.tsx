type WordSelectionProps = {
  phrases?: string[];
  onSelect?: (phrase: string) => void;
};

export default function WordSelection({ phrases = [], onSelect }: WordSelectionProps) {
  return (
    <div className="surface-card stack">
      <span className="section-label">Choose a word</span>
      <div className="page-actions">
        {phrases.map((phrase) => (
          <button key={phrase} type="button" className="muted-button" onClick={() => onSelect?.(phrase)}>
            {phrase}
          </button>
        ))}
      </div>
    </div>
  );
}