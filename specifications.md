# Multiplayer Ping Pong Game — Project Specifications

## 📌 Project Overview

This project is a real-time, interactive multiplayer Ping Pong game built using React, Node.js, TypeScript, and Socket.IO. Two players will connect to a central server to play a classic ping pong match, with the game state synchronized in real-time between clients via WebSockets.

---

## 📚 Learning Objectives

- Implement real-time communication using Socket.IO on both client and server sides.
- Manage full game logic, sessions, and real-time events on a Node.js backend.
- Develop an interactive, responsive frontend with React and TypeScript.
- Ensure type safety and clean integration of a full-stack application using TypeScript.

---

## 📖 Functional Specifications

### 🎮 Game Rules
- **Two players** per game session.
- The ball moves and bounces off paddles and walls.
- A player scores a point when their opponent misses the ball.
- The first player to **reach 5 points wins**.
- Players can leave the game at any time via a **"Leave" button**.

---

### 🔌 Real-Time Communication (30 points)
- Integrate Socket.IO on both client and server.
- Establish and manage WebSocket connections.
- Synchronize paddle movements, ball position, and score updates in real-time.

---

### 🖥️ Backend Development (30 points)
- Create a Node.js backend with TypeScript.
- Implement game session/room management to pair two players.
- Develop core game mechanics:
  - Ball movement and physics.
  - Collision detection (ball with paddles and walls).
  - Scoring and win conditions.

---

### 💻 Frontend Development (25 points)
- Build an interactive, responsive UI using React and TypeScript.
- Implement the game interface with:
  - Game area.
  - Paddles and ball visualization.
  - Scoreboard.
  - "Leave" button.
- Capture player input (keyboard events).
- Display game state updates in real-time from server events.

---

### 🛠️ TypeScript & Full-Stack Integration (15 points)
- Use TypeScript for type safety across frontend and backend.
- Optionally share types via a shared module.
- Cleanly integrate both parts for a fully playable real-time game.

---

## 📡 Socket.IO Usage Overview

### Backend
- Initialize server and Socket.IO instance.
- Handle connection, disconnection, player moves, leave game, and game state updates.

### Frontend
- Connect to server via Socket.IO.
- Emit player input events.
- Listen for real-time updates: game state, scores, game over notifications.

---

## 📑 Deliverables
- Full multiplayer ping pong game.
- Working real-time multiplayer functionality.
- Clean, readable, type-safe code.

---

## 📅 Game Ending Condition
- The game ends when a player reaches **5 points**.
- Players can leave by clicking the **"Leave"** button, which ends the game session.

---

## 📄 Optional Enhancements (if time allows)
- Game over screen.
- Play again functionality.
- Basic matchmaking (queue if one player waits for another).
- Room IDs in URL.
- Sound effects for bounces, scores, win.

---

## ✅ Technologies
- **Frontend:** React, TypeScript
- **Backend:** Node.js, TypeScript, Express, Socket.IO
- **WebSocket Communication:** Socket.IO
- **Package Managers:** npm
