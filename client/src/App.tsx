import { useMemo, useState } from "react";
import GameCanvas from "./GameCanvas";
import type { Game } from "./types";
import { Socket } from "./socket";
import Lobby from "./Lobby";

function App() {
  const [game, setGame] = useState<Game | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState<"lobby" | "inGame">("lobby");

  const socket = useMemo<Socket>(
    () =>
      new Socket((game: Game) => {
        setGame(game);
      }),
    [],
  );

  if (currentPage === "inGame") {
    return <GameCanvas game={game} />;
  } else {
    return (
      <Lobby socket={socket} game={game} setCurrentPage={setCurrentPage} />
    );
  }
}

export default App;
