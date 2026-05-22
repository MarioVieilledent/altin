import { useMemo, useState } from "react";
import GameCanvas from "./GameCanvas";
import type { Game } from "./types";
import { Socket } from "./socket";

function App() {
  const [game, setGame] = useState<Game | undefined>(undefined);

  const socket = useMemo<Socket>(
    () =>
      new Socket((game: Game) => {
        setGame(game);
      }),
    [],
  );

  if (game) {
    return <GameCanvas game={game} />;
  } else {
    return (
      <div>
        <p>No game revieved from server.</p>
      </div>
    );
  }
}

export default App;
