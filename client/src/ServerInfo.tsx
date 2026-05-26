import type { Socket } from "./socket";

const STATUS = {
  ok: { color: "#4caf50", label: "Connected" },
  fetching: { color: "#c8922a", label: "Connecting…" },
  error: { color: "#e84040", label: "Error" },
  closed: { color: "#5a3e1b", label: "Closed" },
};

export default function ServerInfo({ socket }: { socket: Socket }) {
  const s = STATUS[socket.status];
  const pulsing = socket.status === "fetching";

  return (
    <div
      title={socket.statusInfo}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 7,
        background: "rgba(0,0,0,0.4)",
        border: "1px solid #3a2800",
        padding: "3px 10px",
        fontFamily: "'Cinzel', serif",
      }}
    >
      <style>{`@keyframes aoe-pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }`}</style>
      <span
        style={{
          width: 7,
          height: 7,
          borderRadius: "50%",
          background: s.color,
          flexShrink: 0,
          boxShadow: pulsing ? `0 0 6px ${s.color}` : "none",
          animation: pulsing ? "aoe-pulse 1.2s ease-in-out infinite" : "none",
        }}
      />
      <span
        style={{
          fontSize: 11,
          letterSpacing: 2,
          color: s.color,
          textTransform: "uppercase",
        }}
      >
        {s.label}
      </span>
    </div>
  );
}
