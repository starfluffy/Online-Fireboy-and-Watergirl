type InfoPopupProps = {
  onClose: () => void;
};

export default function InfoPopup({ onClose }: InfoPopupProps) {
  return (
    <div className="surface-card info-popup">
      <div className="stack">
        <span className="section-label">Info</span>
        <p>This scaffold keeps the Inky-style app structure but leaves the gameplay open for your own build.</p>
      </div>
      <button type="button" className="muted-button" onClick={onClose}>
        Close
      </button>
    </div>
  );
}