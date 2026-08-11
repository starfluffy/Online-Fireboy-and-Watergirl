type TimerProps = {
  seconds?: number;
};

export default function Timer({ seconds = 90 }: TimerProps) {
  return <span className="timer-badge">{seconds}s</span>;
}