export interface Player {
    id: string;
    paddleY: number;
    score: number;
}

export interface GameState {
    ballX: number;
    ballY: number;
    ballVelocityX: number;
    ballVelocityY: number;
    players: { [playerId: string]: Player };
}

export interface Room {
    name: string;
    players: string[];
    gameState: GameState;
    interval?: NodeJS.Timeout;
    playersReady?: Set<string>;
}