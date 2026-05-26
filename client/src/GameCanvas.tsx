import { useEffect, useRef, useState } from "react";
import type { Game } from "./types";
import npc from "/npc.webp";

// Grid Configuration
const tileWidth = 128; // Width of the isometric diamond
const tileHeight = 64; // Height of the isometric diamond (2:1 ratio)

// Color palette for the grid
const strokeColor = "#444444";
const fillColors = ["#1a2a1a", "#1f331f"]; // Checkerboard pattern tones

// Images
const npcImage = new Image();
npcImage.src = npc;

export default function GameCanvas({ game }: { game: Game }) {
  const canvas = useRef(null);
  const ctx = useRef(null);

  const gridSize = game.map.size;

  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [startX, setStartX] = useState<number>(0);
  const [startY, setStartY] = useState<number>(0);
  const [currentX, setCurrentX] = useState<number>(0);
  const [currentY, setCurrentY] = useState<number>(0);

  /**
   * Resizes the canvas buffer to match the window size accurately
   * and triggers a redraw to keep the grid perfectly centered.
   */
  function resizeCanvas() {
    canvas.current.width = window.innerWidth;
    canvas.current.height = window.innerHeight;
    drawIsoMap();
  }

  /**
   * Converts standard 2D grid coordinates (row, col) into
   * Isometric screen coordinates (x, y).
   */
  function isoProject(
    col: number,
    row: number,
    gridSize: number,
  ): { x: number; y: number } {
    // Calculate the total pixel dimensions of the isometric bounding area
    const totalHeight = (gridSize + gridSize) * (tileHeight / 2);

    // Find the center offsets to pin the grid to the middle of the screen
    const offsetX = canvas.current.width / 2;
    const offsetY = (canvas.current.height - totalHeight) / 2 + tileHeight / 2;

    const isoX = (col - row) * (tileWidth / 2) + offsetX;
    const isoY = (col + row) * (tileHeight / 2) + offsetY;

    return { x: isoX, y: isoY };
  }

  /**
   * Converts Isometric screen coordinates (x, y) back into
   * standard 2D grid coordinates (row, col).
   */
  /*
  function isoUnproject(
    x: number,
    y: number,
    gridSize: number,
  ): { col: number; row: number } {
    // Recalculate the exact same offsets used during projection
    const totalHeight = (gridSize + gridSize) * (tileHeight / 2);
    const offsetX = canvas.current.width / 2;
    const offsetY = (canvas.current.height - totalHeight) / 2 + tileHeight / 2;

    // Remove the screen offsets to get raw isometric positions
    const isoX = x - offsetX;
    const isoY = y - offsetY;

    // Invert the isometric transformation matrix
    const col = (isoX / (tileWidth / 2) + isoY / (tileHeight / 2)) / 2;
    const row = (isoY / (tileHeight / 2) - isoX / (tileWidth / 2)) / 2;

    return { col, row };
  }
    */

  /**
   * Renders the entire 21x21 grid centered on the canvas.current.
   */
  function drawIsoMap() {
    // Clear the canvas with absolute black
    ctx.current.fillStyle = "#000000";
    ctx.current.fillRect(0, 0, canvas.current.width, canvas.current.height);

    // Draw the grid from back to front (row by row, col by col)
    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        // Get screen coordinates for the top corner of the current tile
        const screenPos = isoProject(c, r, gridSize);
        const cx = screenPos.x;
        const cy = screenPos.y;

        // Draw the diamond shape
        ctx.current.setLineDash([]);
        ctx.current.beginPath();
        ctx.current.moveTo(cx, cy); // Top corner
        ctx.current.lineTo(cx + tileWidth / 2, cy + tileHeight / 2); // Right corner
        ctx.current.lineTo(cx, cy + tileHeight); // Bottom corner
        ctx.current.lineTo(cx - tileWidth / 2, cy + tileHeight / 2); // Left corner
        ctx.current.closePath();

        // Apply a subtle checkerboard pattern fill
        ctx.current.fillStyle = fillColors[(r + c) % 2];
        ctx.current.fill();

        // Draw the grid lines
        ctx.current.strokeStyle = strokeColor;
        ctx.current.lineWidth = 0.5;
        ctx.current.stroke();
      }
    }

    // Draw structures

    // Draw units
    if (game) {
      game.players.forEach((player) => {
        player.units.forEach((unit) => {
          const unitPos = isoProject(unit.x, unit.y, game.map.size);
          ctx.current.drawImage(npcImage, unitPos.x, unitPos.y, 32, 32);
        });
      });
    }

    // Draw selection rectangle
    if (isDragging) {
      drawSelectionRectangle();
    }
  }

  function drawSelectionRectangle() {
    // Calculate box dimensions
    const width = currentX - startX;
    const height = currentY - startY;

    // 1. Draw a transparent blue fill (Windows/RTS style)
    ctx.current.fillStyle = "rgba(0, 0, 0, 0)";
    ctx.current.fillRect(startX, startY, width, height);

    // 2. Draw thin stripped (dashed) border
    ctx.current.strokeStyle = "#ffffff";
    ctx.current.lineWidth = 1;

    // [dash length, space length] -> creates the "stripped" look
    ctx.current.setLineDash([4, 4]);

    ctx.current.strokeRect(startX, startY, width, height);
  }

  function isInsideSelection({ x, y }: { x: number; y: number }): boolean {
    const minX = Math.min(startX, currentX);
    const maxX = Math.max(startX, currentX);
    const minY = Math.min(startY, currentY);
    const maxY = Math.max(startY, currentY);

    return x >= minX && x <= maxX && y >= minY && y <= maxY;
  }

  function selectUnits() {
    game.players[0].units.forEach((unit) => {
      const isoProjectUnit = isoProject(unit.x, unit.y, gridSize);
      if (isInsideSelection(isoProjectUnit)) {
        console.log("yes");
      }
    });
  }

  // Get exact mouse position relative to the canvas bounding box
  function getMousePos(e: MouseEvent) {
    const rect = canvas.current.getBoundingClientRect();
    return {
      x: Math.round(e.clientX - rect.left),
      y: Math.round(e.clientY - rect.top),
    };
  }

  const mouseupHandler = () => {
    if (!isDragging) return;
    setIsDragging(false);
    selectUnits();
    drawIsoMap();
  };

  const mousedownHandler = (e: MouseEvent) => {
    setIsDragging(true);
    const pos = getMousePos(e);
    setStartX(pos.x);
    setStartY(pos.y);
    setCurrentX(pos.x);
    setCurrentY(pos.y);
  };

  const mousemoveHandler = (e: MouseEvent) => {
    if (!isDragging) return;

    const pos = getMousePos(e);
    setCurrentX(pos.x);
    setCurrentY(pos.y);

    // Redraw scene
    drawIsoMap();
  };

  useEffect(() => {
    if (canvas.current) {
      ctx.current = canvas.current.getContext("2d");
      canvas.current.addEventListener("mousedown", mousedownHandler);
      canvas.current.addEventListener("mousemove", mousemoveHandler);
      window.addEventListener("mouseup", mouseupHandler);
      window.addEventListener("resize", resizeCanvas);
      resizeCanvas();
    }

    return () => {
      if (canvas.current) {
        canvas.current.removeEventListener("mousedown", mousedownHandler);
        canvas.current.removeEventListener("mousemove", mousemoveHandler);
        window.removeEventListener("mouseup", mouseupHandler);
        window.removeEventListener("resize", resizeCanvas);
      }
    };
  }, [canvas.current, isDragging, drawIsoMap]);

  return <canvas ref={canvas} id="isoCanvas"></canvas>;
}
