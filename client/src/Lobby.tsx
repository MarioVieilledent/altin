import { useState } from "react";
import type { Game } from "./types";
import type { Socket } from "./socket";
import ServerInfo from "./ServerInfo";

const CIVILIZATIONS = [
  "Chads",
  "Jews",
  "Pepos",
  "Ching chongs",
  "Niggers",
  "Sand niggers",
  "Jeets",
  "NPCs",
];

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Crimson+Text:ital,wght@0,400;0,600;1,400&display=swap');

  .aoe-root {
    min-height: 100vh;
    background:
      repeating-linear-gradient(
        0deg,
        rgba(0,0,0,0.03) 0px,
        rgba(0,0,0,0.03) 1px,
        transparent 1px,
        transparent 4px
      ),
      linear-gradient(160deg, #1a1208 0%, #2e1f0a 40%, #1a120a 100%);
    font-family: 'Crimson Text', serif;
    color: #d4a84b;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
  }

  /* ── Stone border panel ── */
  .panel {
    background:
      linear-gradient(180deg, #2b1e0e 0%, #1e1407 100%);
    border: 3px solid #5a3e1b;
    border-image:
      repeating-linear-gradient(
        90deg,
        #7a5a2a 0px, #c8922a 4px, #7a5a2a 8px
      ) 3;
    box-shadow:
      inset 0 0 24px rgba(0,0,0,0.7),
      0 0 0 1px #1a0e04,
      0 4px 24px rgba(0,0,0,0.8);
    padding: 20px 24px;
    position: relative;
  }

  .panel::before {
    content: '';
    position: absolute;
    inset: 4px;
    border: 1px solid rgba(180,120,30,0.2);
    pointer-events: none;
  }

  /* ── Title bar ── */
  .title-bar {
    width: 100%;
    max-width: 860px;
    margin: 28px 0 0;
    text-align: center;
    position: relative;
  }

  .title-bar h1 {
    font-family: 'Cinzel', serif;
    font-size: 38px;
    font-weight: 700;
    color: #e8b84b;
    text-shadow:
      0 0 12px rgba(220,140,20,0.6),
      2px 2px 0 #3a2000,
      -1px -1px 0 #3a2000;
    letter-spacing: 4px;
    margin: 0 0 4px;
    text-transform: uppercase;
  }

  .title-bar .subtitle {
    font-family: 'Crimson Text', serif;
    font-style: italic;
    font-size: 16px;
    color: #9a7030;
    letter-spacing: 2px;
  }

  .divider {
    width: 100%;
    height: 2px;
    background: linear-gradient(90deg, transparent, #7a5520 20%, #c8922a 50%, #7a5520 80%, transparent);
    margin: 12px 0;
    position: relative;
  }

  .divider::before,
  .divider::after {
    content: '◆';
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    color: #c8922a;
    font-size: 10px;
  }
  .divider::before { left: 18%; }
  .divider::after  { right: 18%; }

  /* ── Main layout ── */
  .main-layout {
    display: flex;
    gap: 16px;
    width: 100%;
    max-width: 860px;
    margin: 16px 0 28px;
    align-items: flex-start;
  }

  /* ── Game list panel ── */
  .game-list-panel {
    flex: 1.2;
  }

  .panel-title {
    font-family: 'Cinzel', serif;
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: #c8922a;
    margin: 0 0 12px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .panel-title::before,
  .panel-title::after {
    content: '';
    flex: 1;
    height: 1px;
    background: linear-gradient(90deg, transparent, #5a3e1b);
  }
  .panel-title::before { background: linear-gradient(90deg, #5a3e1b, transparent); }

  .game-list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-height: 180px;
  }

  .game-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 12px;
    cursor: pointer;
    border: 1px solid transparent;
    transition: background 0.1s, border-color 0.1s;
    font-size: 15px;
  }

  .game-row:hover {
    background: rgba(200,146,42,0.08);
    border-color: rgba(200,146,42,0.3);
  }

  .game-row.selected {
    background: rgba(200,146,42,0.15);
    border-color: #c8922a;
    box-shadow: inset 0 0 8px rgba(200,146,42,0.1);
  }

  .game-row .game-name {
    color: #d4a84b;
    font-family: 'Crimson Text', serif;
    font-size: 16px;
  }

  .game-row .game-meta {
    font-size: 12px;
    color: #7a5a2a;
    font-style: italic;
    display: flex;
    gap: 12px;
  }

  .no-games {
    color: #5a3e1b;
    font-style: italic;
    font-size: 15px;
    text-align: center;
    margin-top: 40px;
  }

  /* ── Create game panel ── */
  .create-panel {
    flex: 1;
  }

  /* ── AOE inputs ── */
  .field-group {
    margin-bottom: 14px;
  }

  .field-label {
    display: block;
    font-family: 'Cinzel', serif;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: #8a6030;
    margin-bottom: 5px;
  }

  .aoe-input {
    width: 100%;
    background: rgba(0,0,0,0.5);
    border: 1px solid #5a3e1b;
    border-bottom-color: #3a2000;
    border-right-color: #3a2000;
    color: #d4a84b;
    font-family: 'Crimson Text', serif;
    font-size: 16px;
    padding: 7px 10px;
    box-sizing: border-box;
    outline: none;
    transition: border-color 0.15s, box-shadow 0.15s;
  }

  .aoe-input:focus {
    border-color: #c8922a;
    box-shadow: 0 0 8px rgba(200,146,42,0.25);
  }

  .aoe-input::placeholder {
    color: #4a3010;
    font-style: italic;
  }

  /* range slider */
  .range-wrapper {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .aoe-range {
    flex: 1;
    -webkit-appearance: none;
    appearance: none;
    height: 6px;
    background: linear-gradient(90deg, #3a2000, #5a3e1b);
    border: 1px solid #3a2000;
    outline: none;
    cursor: pointer;
  }

  .aoe-range::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 16px;
    height: 20px;
    background: linear-gradient(180deg, #e0a030 0%, #9a6010 100%);
    border: 1px solid #3a2000;
    cursor: pointer;
    box-shadow: 1px 1px 0 #1a0e04;
  }

  .range-value {
    font-family: 'Cinzel', serif;
    font-size: 15px;
    font-weight: 600;
    color: #e8b84b;
    min-width: 36px;
    text-align: right;
  }

  /* ── Buttons ── */
  .aoe-btn {
    font-family: 'Cinzel', serif;
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 2px;
    text-transform: uppercase;
    padding: 9px 18px;
    background: linear-gradient(180deg, #5a3e10 0%, #2e1e06 50%, #3a2800 100%);
    border: 2px solid #7a5520;
    border-bottom-color: #2a1800;
    border-right-color: #2a1800;
    color: #d4a84b;
    cursor: pointer;
    box-shadow:
      inset 1px 1px 0 rgba(255,200,80,0.1),
      1px 1px 0 #1a0e04;
    transition: filter 0.1s, transform 0.08s;
    text-shadow: 1px 1px 0 #1a0e04;
    white-space: nowrap;
  }

  .aoe-btn:hover {
    filter: brightness(1.2);
    color: #ffdf80;
  }

  .aoe-btn:active {
    transform: translate(1px, 1px);
    box-shadow: inset 1px 1px 4px rgba(0,0,0,0.5);
    filter: brightness(0.95);
  }

  .aoe-btn.primary {
    background: linear-gradient(180deg, #8a5a18 0%, #4a2e08 50%, #5a3a10 100%);
    border-color: #c8922a;
    border-bottom-color: #3a2000;
    border-right-color: #3a2000;
    color: #ffe080;
  }

  .aoe-btn.danger {
    background: linear-gradient(180deg, #5a1a10 0%, #2e0e06 50%, #3a1800 100%);
    border-color: #7a3520;
    color: #e8885a;
  }

  .aoe-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
    filter: none;
    transform: none;
  }

  .btn-row {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    margin-top: 14px;
  }

  /* ── Game detail panel ── */
  .game-detail {
    width: 100%;
    max-width: 860px;
    margin-bottom: 28px;
  }

  .game-detail-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
  }

  .game-detail-title {
    font-family: 'Cinzel', serif;
    font-size: 20px;
    font-weight: 700;
    color: #e8b84b;
    text-shadow: 1px 1px 0 #1a0e04;
  }

  .game-detail-title span {
    font-size: 13px;
    color: #7a5a2a;
    margin-left: 12px;
    font-weight: 400;
  }

  /* ── Players table ── */
  .players-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 10px;
    margin-top: 10px;
  }

  .player-card {
    background: rgba(0,0,0,0.35);
    border: 1px solid #3a2800;
    padding: 10px 12px;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .player-slot-label {
    font-family: 'Cinzel', serif;
    font-size: 10px;
    letter-spacing: 2px;
    color: #6a4820;
    text-transform: uppercase;
  }

  .player-name-input {
    background: rgba(0,0,0,0.4);
    border: 1px solid #4a3010;
    color: #d4a84b;
    font-family: 'Crimson Text', serif;
    font-size: 15px;
    padding: 4px 8px;
    outline: none;
    width: 100%;
    box-sizing: border-box;
  }

  .player-name-input:focus {
    border-color: #c8922a;
  }

  .civ-select {
    background: rgba(0,0,0,0.5);
    border: 1px solid #4a3010;
    color: #d4a84b;
    font-family: 'Cinzel', serif;
    font-size: 12px;
    padding: 5px 8px;
    outline: none;
    width: 100%;
    cursor: pointer;
    box-sizing: border-box;
    letter-spacing: 1px;
  }

  .civ-select:focus {
    border-color: #c8922a;
  }

  .civ-select option {
    background: #1e1407;
    color: #d4a84b;
  }

  /* ── Map preview ── */
  .map-preview-row {
    display: flex;
    gap: 16px;
    align-items: flex-start;
    margin-top: 10px;
  }

  .map-canvas-wrap {
    flex-shrink: 0;
  }

  .map-canvas {
    display: block;
    image-rendering: pixelated;
    border: 2px solid #5a3e1b;
    box-shadow: inset 0 0 8px rgba(0,0,0,0.6);
  }

  .map-info {
    flex: 1;
    font-size: 14px;
    color: #8a6030;
    line-height: 1.7;
  }

  .map-info strong {
    color: #c8922a;
    font-family: 'Cinzel', serif;
    font-size: 12px;
    letter-spacing: 1px;
  }

  /* ── Toast / status bar ── */
  .status-bar {
    width: 100%;
    max-width: 860px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 6px 0;
    margin-bottom: 8px;
  }

  .status-text {
    font-style: italic;
    font-size: 14px;
    color: #6a4820;
  }

  .status-text.active {
    color: #c8922a;
  }

  /* ── Corner ornaments ── */
  .panel::after {
    content: '❖';
    position: absolute;
    bottom: 8px;
    right: 10px;
    font-size: 12px;
    color: #3a2800;
    pointer-events: none;
  }
`;

interface MapPreviewProps {
  size: number;
}

function MapPreview({ size }: MapPreviewProps) {
  const canvasSize = 96;
  const tileSize = Math.max(1, Math.floor(canvasSize / size));
  const cols = Math.floor(canvasSize / tileSize);
  const rows = Math.floor(canvasSize / tileSize);

  const tiles = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const v = Math.sin(r * 0.7 + c * 0.5) * Math.cos(r * 0.3 - c * 0.8);
      let color: string;
      if (v > 0.4) color = "#3a5c1a";
      else if (v > 0.1) color = "#4a7a22";
      else if (v > -0.1) color = "#6b9c2e";
      else if (v > -0.3) color = "#c8a84a";
      else color = "#2a5888";
      tiles.push(
        <rect
          key={`${r}-${c}`}
          x={c * tileSize}
          y={r * tileSize}
          width={tileSize}
          height={tileSize}
          fill={color}
        />,
      );
    }
  }

  return (
    <svg
      className="map-canvas"
      width={canvasSize}
      height={canvasSize}
      viewBox={`0 0 ${canvasSize} ${canvasSize}`}
    >
      {tiles}
    </svg>
  );
}

interface AddGameFormProps {
  onAdd: (a: string, b: number) => void;
  onCancel: React.MouseEventHandler;
}

function AddGameForm({ onAdd, onCancel }: AddGameFormProps) {
  const [name, setName] = useState("");
  const [mapSize, setMapSize] = useState(64);

  return (
    <div
      className="panel"
      style={{ marginBottom: 16, maxWidth: 860, width: "100%" }}
    >
      <div className="panel-title">Create New Game</div>
      <div className="field-group">
        <label className="field-label">Game Name</label>
        <input
          className="aoe-input"
          type="text"
          placeholder="Enter a name for your match…"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={40}
        />
      </div>
      <div className="field-group">
        <label className="field-label">
          Map Size — {mapSize} × {mapSize}
        </label>
        <div className="range-wrapper">
          <input
            className="aoe-range"
            type="range"
            min={16}
            max={256}
            step={1}
            value={mapSize}
            onChange={(e) => setMapSize(Number(e.target.value))}
          />
          <span className="range-value">{mapSize}</span>
        </div>
      </div>
      <div className="map-preview-row">
        <div className="map-canvas-wrap">
          <MapPreview size={mapSize} />
        </div>
        <div className="map-info">
          <strong>Map Preview</strong>
          <br />
          Size: {mapSize} × {mapSize} tiles
          <br />
          Area: {mapSize * mapSize} tiles
          <br />
          <span style={{ fontSize: 12, color: "#5a3e1b" }}>
            {mapSize < 40
              ? "Tiny — close combat"
              : mapSize < 100
                ? "Medium — balanced"
                : mapSize < 180
                  ? "Large — room to expand"
                  : "Huge — epic scale"}
          </span>
        </div>
      </div>
      <div className="btn-row">
        <button
          className="aoe-btn primary"
          disabled={!name.trim()}
          onClick={() => onAdd(name.trim(), mapSize)}
        >
          Create Game
        </button>
        <button className="aoe-btn" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
}

const COLORS = [
  "#e84040",
  "#4080e8",
  "#40c840",
  "#e8c040",
  "#c040e8",
  "#40c8c8",
  "#e88040",
  "#c8c8c8",
];

interface GameDetailProps {
  game: Game;
  onClose: React.MouseEventHandler;
  setCurrentPage: any;
}

function GameDetail({ game, onClose, setCurrentPage }: GameDetailProps) {
  const [players, setPlayers] = useState(
    Array.from({ length: 2 }, (_, i) => ({
      name: i === 0 ? "Player 1" : "",
      civ: CIVILIZATIONS[i % CIVILIZATIONS.length],
    })),
  );

  const updatePlayer = (i: number, field: string, value: string) => {
    setPlayers((prev) =>
      prev.map((p, idx) => (idx === i ? { ...p, [field]: value } : p)),
    );
  };

  return (
    <div className="game-detail">
      <div className="panel">
        <div className="game-detail-header">
          <div className="game-detail-title">
            {game.name}
            <span>
              Map: {game.map.size} × {game.map.size}
            </span>
          </div>
          <button className="aoe-btn" onClick={onClose}>
            ← Back
          </button>
        </div>

        <div className="divider" />

        <div
          style={{
            display: "flex",
            gap: 20,
            flexWrap: "wrap",
            alignItems: "flex-start",
          }}
        >
          <div style={{ flex: 2, minWidth: 280 }}>
            <div className="panel-title">Players</div>
            <div className="players-grid">
              {players.map((p, i) => (
                <div
                  className="player-card"
                  key={i}
                  style={{ borderLeft: `3px solid ${COLORS[i]}` }}
                >
                  <div
                    className="player-slot-label"
                    style={{ color: COLORS[i] + "99" }}
                  >
                    Slot {i + 1}
                  </div>
                  <input
                    className="player-name-input"
                    type="text"
                    placeholder={`Player ${i + 1}`}
                    value={p.name}
                    onChange={(e) => updatePlayer(i, "name", e.target.value)}
                  />
                  <select
                    className="civ-select"
                    value={p.civ}
                    onChange={(e) => updatePlayer(i, "civ", e.target.value)}
                  >
                    {CIVILIZATIONS.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>

          <div style={{ flex: 1, minWidth: 140 }}>
            <div className="panel-title">Map</div>
            <MapPreview size={game.map.size} />
            <div
              style={{
                marginTop: 8,
                fontSize: 13,
                color: "#6a4820",
                fontStyle: "italic",
              }}
            >
              {game.map.size}×{game.map.size} tiles
            </div>
          </div>
        </div>

        <div className="divider" style={{ marginTop: 18 }} />

        <div className="btn-row">
          <button
            className="aoe-btn primary"
            style={{ fontSize: 15, padding: "11px 28px", letterSpacing: 4 }}
            onClick={() => setCurrentPage("inGame")}
          >
            ▶ Play
          </button>
          <button className="aoe-btn danger" onClick={onClose}>
            Leave Game
          </button>
        </div>
      </div>
    </div>
  );
}

interface LobbyProps {
  socket: Socket;
  game: Game | null;
  setCurrentPage: React.Dispatch<React.SetStateAction<"lobby" | "inGame">>;
}

export default function Lobby({ socket, game, setCurrentPage }: LobbyProps) {
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [statusMsg, setStatusMsg] = useState(
    "Select a game to join, or create a new one.",
  );

  const handleAdd = (name: string, mapSize: number) => {
    socket.send({ name, mapSize });
  };

  const handleSelectGame = (g: Game) => {
    setSelectedGame(g);
    setShowCreate(false);
    setStatusMsg(`Joined "${g.name}" — ${g.map.size}×${g.map.size} map.`);
  };

  return (
    <div className="aoe-root">
      <style>{css}</style>

      {/* Title */}
      <div className="title-bar">
        <div className="divider" />
        <h1>Altin</h1>
        <div className="subtitle">Server status</div>
        <ServerInfo socket={socket} />
        <div className="divider" />
      </div>

      {/* Status bar */}
      <div
        className="status-bar"
        style={{ maxWidth: 860, width: "100%", padding: "0 0 4px" }}
      >
        <span
          className={`status-text ${statusMsg !== "Select a game to join, or create a new one." ? "active" : ""}`}
        >
          {statusMsg}
        </span>
        {game && (
          <span style={{ fontSize: 12, color: "#4a3010", fontStyle: "italic" }}>
            {game.name} available
          </span>
        )}
      </div>

      {/* Create game form (shown inline above list) */}
      {showCreate && (
        <AddGameForm onAdd={handleAdd} onCancel={() => setShowCreate(false)} />
      )}

      {/* Game detail */}
      {selectedGame && !showCreate && (
        <GameDetail
          game={selectedGame}
          onClose={() => {
            setSelectedGame(null);
            setStatusMsg("Select a game to join, or create a new one.");
          }}
          setCurrentPage={setCurrentPage}
        />
      )}

      {/* Main panels (list + create button) — always visible if no game selected */}
      {selectedGame === null && !showCreate && (
        <div className="main-layout">
          {/* Game list */}
          <div className="game-list-panel">
            <div className="panel">
              <div className="panel-title">Available Games</div>
              <ul className="game-list">
                {game === null && (
                  <li className="no-games">
                    No game found.
                    <br />
                    Create one to begin.
                  </li>
                )}
                {game && (
                  <li
                    key={game.name}
                    className="game-row"
                    onClick={() => handleSelectGame(game)}
                  >
                    <span className="game-name">⚔ {game.name}</span>
                    <span className="game-meta">
                      <span>
                        {game.map.size}×{game.map.size}
                      </span>
                      <span>{game.players.length}p</span>
                    </span>
                  </li>
                )}
              </ul>
              <div className="btn-row" style={{ marginTop: 16 }}>
                <button
                  className="aoe-btn primary"
                  onClick={() => setShowCreate(true)}
                >
                  ＋ Create Game
                </button>
              </div>
            </div>
          </div>

          {/* Side info */}
          <div className="create-panel">
            <div className="panel">
              <div className="panel-title">Civilisations</div>
              {CIVILIZATIONS.map((c, i) => (
                <div
                  key={c}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "6px 0",
                    borderBottom: "1px solid #2a1800",
                  }}
                >
                  <span style={{ color: COLORS[i], fontSize: 16 }}>◆</span>
                  <span
                    style={{
                      fontFamily: "'Cinzel', serif",
                      fontSize: 14,
                      color: "#c8922a",
                      letterSpacing: 1,
                    }}
                  >
                    {c}
                  </span>
                </div>
              ))}
              <div
                style={{
                  marginTop: 16,
                  fontSize: 13,
                  color: "#5a3e1b",
                  fontStyle: "italic",
                  lineHeight: 1.7,
                }}
              >
                Choose your civilisation when you enter a game lobby. Each has
                unique units and bonuses.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div
        style={{
          maxWidth: 860,
          width: "100%",
          textAlign: "center",
          paddingBottom: 20,
        }}
      >
        <div className="divider" />
        <div
          style={{
            fontSize: 12,
            color: "#3a2800",
            fontStyle: "italic",
            letterSpacing: 2,
            marginTop: 8,
          }}
        >
          Altin — Multiplayer Lobby
        </div>
      </div>
    </div>
  );
}
