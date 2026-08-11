type LoadingSpinnerProps = {
  fullScreen?: boolean;
};

export default function LoadingSpinner({ fullScreen = false }: LoadingSpinnerProps) {
  return (
    <div className={fullScreen ? "surface-card spinner-frame full-screen" : "surface-card spinner-frame"}>
      <div className="spinner" aria-hidden="true" />
      <p className="muted-text">Loading scaffold...</p>
    </div>
  );
}