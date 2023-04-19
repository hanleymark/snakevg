import { Board } from "./modules/board.js";

const gameElement = document.querySelector("#game");

// Set up game attributes
const BOARD_WIDTH = 10; // Width of board in blocks
const BOARD_HEIGHT = 10; // Height of board in blocks
const BLOCK_SIZE = 50; // Size of one block in pixels
const TICK_MS = 250; // Time in milliseconds for each game tick
const SNAKE_START_LENGTH = 3; // Initial length of snake

const board = new Board(
  BOARD_WIDTH,
  BOARD_HEIGHT,
  BLOCK_SIZE,
  "./images/bg-space.jpg"
);

gameElement.appendChild(board.boardElement);

