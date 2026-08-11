type TurnEndProps = {
  timeOut?: boolean;
  drawerLeft?: boolean;
};

export default function TurnEnd({ timeOut = false, drawerLeft = false }: TurnEndProps) {
  return <div className="surface-card">Turn end: {timeOut ? "time out" : drawerLeft ? "drawer left" : "turn finished"}</div>;
}