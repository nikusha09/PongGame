# 📝 Multiplayer Ping Pong Game — To-Do List

---

## 📦 Project Setup
- [ ] Initialize **frontend** with Vite + React + TypeScript.
- [ ] Initialize **backend** with Node.js + TypeScript + Express.
- [ ] Install dependencies:
  - Frontend: `react`, `vite`, `typescript`, `socket.io-client`
  - Backend: `express`, `typescript`, `ts-node-dev`, `cors`, `socket.io`
- [ ] Configure `tsconfig.json` for both frontend and backend.
- [ ] Set up `.env` file for server settings (if needed).

---

## 🔌 Real-Time Communication (Socket.IO)
- [ ] Setup Socket.IO server instance on backend.
- [ ] Handle player connection and disconnection.
- [ ] Implement basic room management (pair 2 players in a game).
- [ ] Broadcast game state updates to both players in the same room.
- [ ] Set up Socket.IO client connection in React frontend.
- [ ] Emit player paddle movement events from client to server.
- [ ] Listen for ball position, score updates, and game over events on client.

---

## 🖥️ Backend Game Logic (Node.js + TypeScript)
- [ ] Create basic HTTP + WebSocket server.
- [ ] Define types/interfaces for game state, players, rooms.
- [ ] Handle ball physics:
  - [ ] Ball movement logic.
  - [ ] Ball collision detection with walls.
  - [ ] Ball collision detection with paddles.
- [ ] Implement scoring system.
- [ ] Detect game over condition (player reaches 5 points).
- [ ] Emit game state updates to clients at fixed intervals (game loop using `setInterval`).

---

## 💻 Frontend UI (React + TypeScript)
- [ ] Design responsive game canvas.
- [ ] Draw paddles, ball, and scores using HTML Canvas or styled div elements.
- [ ] Capture player input (keyboard events: ArrowUp / ArrowDown).
- [ ] Emit player input events to server via Socket.IO.
- [ ] Update game state in real-time based on events from server.
- [ ] Display final score and winner when game ends.
- [ ] Implement **"Leave" button** functionality:
  - [ ] Notify server of player leaving.
  - [ ] Return player to start/waiting screen.

---

## 🛠️ TypeScript Integration
- [ ] Define shared types/interfaces (optional shared `types/` folder).
- [ ] Type safety for all Socket.IO events and payloads.
- [ ] Type-safe state management in both frontend and backend.

---

## 📑 Final Touches
- [ ] Add optional enhancements:
  - [ ] Game Over screen with "Play Again" option.
  - [ ] Sound effects.
  - [ ] Room URLs (e.g., `/game/:roomId`).
- [ ] Test on multiple browser tabs/devices.

---

## 📌 Done ✅
- [ ] All game features working.
- [ ] Codebase clean and well-typed.
- [ ] Project documented.
- [ ] Final run-through for grading criteria.

