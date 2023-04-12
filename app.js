import { Board } from "./modules/board.js";

const SVG_NAMESPACE = "http://www.w3.org/2000/svg";

// Set up game attributes
const BOARD_WIDTH = 50; // Width of board in blocks
const BOARD_HEIGHT = 30; // Height of board in blocks
const BLOCK_SIZE = 16; // Size of one block in pixels
const TICK_MS = 250; // Time in milliseconds for each game tick
const SNAKE_START_LENGTH = 3; // Initial length of snake

// Create snake Direction enum for readability
const Direction = Object.freeze({
  up: 0,
  down: 1,
  left: 2,
  right: 3,
});

const board = new Board(
  BOARD_WIDTH,
  BOARD_HEIGHT,
  BLOCK_SIZE,
  "./images/bg-space.jpg"
);
document.body.appendChild(board.element);

// Set initial direction of snake
let snakeDirection = Direction.right;

// Build snake (array of SnakePart)
let snake = setUpSnake(SNAKE_START_LENGTH);

document.body.appendChild(board);

// Generate food
// Generate random x and y coords
// Check if coords are occupied by snake
// If not, create food at coords


// Display snake
displaySnake();
let food = new Food();

document.addEventListener("keydown", (event) => {
  const key = event.key;

  if (key === "ArrowLeft") snakeDirection = Direction.left;
  if (key === "ArrowRight") snakeDirection = Direction.right;
  if (key === "ArrowUp") snakeDirection = Direction.up;
  if (key === "ArrowDown") snakeDirection = Direction.down;
});

// Set up game loop timer
setInterval(gameLoop, TICK_MS);

function Food() {
  this.xPos = 0;
  this.yPos = 0;
  const radius = BLOCK_SIZE / 2;

  let squareIsOccupied = true;

  while (squareIsOccupied) {
    this.xPos = generateRandomLocation(BOARD_WIDTH, BLOCK_SIZE);
    this.yPos = generateRandomLocation(BOARD_HEIGHT, BLOCK_SIZE);
    squareIsOccupied = isSquareOccupied(this.xPos, this.yPos);
  }

  this.svgGroup = document.createElementNS(SVG_NAMESPACE, "g");
  this.svgGroup.setAttributeNS(null, "class", "food-block");
  const circle = document.createElementNS(SVG_NAMESPACE, "circle");
  circle.setAttributeNS(null, "cx", this.xPos);
  circle.setAttributeNS(null, "cy", this.yPos);
  circle.setAttributeNS(null, "r", radius);
  circle.setAttributeNS(null, "class", "food"); // Set class name so it can be styled
  this.svgGroup.appendChild(circle);
  board.appendChild(this.svgGroup);
}

function isSquareOccupied(x,y) {
  for (let snakePart of snake) {
    if (snakePart.xPos === x && snakePart.yPos === y) {
      return true;
    }
  }
  return false;
}

function generateRandomLocation(boardSize, blockSize) {
  return Math.floor(Math.random() * boardSize) * blockSize;
}

function SnakePart(xPos, yPos, partName, direction) {
  this.xPos = xPos;
  this.yPos = yPos;
  this.partName = partName;
  this.direction = direction;
  const radiusEnlargement = 1.4; // Used to scale up circle sections from BLOCK_SIZE of snake so that they overlap

  // Create SVG group element
  // This will enable the development of more complex svg elements for snake parts
  this.svgGroup = document.createElementNS(SVG_NAMESPACE, "g");
  this.svgGroup.setAttributeNS(null, "class", "snake-body-block");

  const radius = (BLOCK_SIZE / 2) * radiusEnlargement; // Set radius of circle to overlap

  const circle = document.createElementNS(SVG_NAMESPACE, "circle");
  circle.setAttributeNS(null, "cx", this.xPos);
  circle.setAttributeNS(null, "cy", this.yPos);
  circle.setAttributeNS(null, "r", radius);
  circle.setAttributeNS(null, "class", partName); // Set class name so it can be styled

  if (this.partName === "snake-head") {
    // Add head styling (eyes etc.)
  }

  this.svgGroup.appendChild(circle);

  this.setX = function (x) {
    this.xPos = x;
    this.svgGroup.firstElementChild.setAttributeNS(null, "cx", this.xPos);
  };

  this.setY = function (y) {
    this.yPos = y;
    this.svgGroup.firstElementChild.setAttributeNS(null, "cy", this.yPos);
  };
}

function setUpBoard() {
  const board = document.createElementNS(SVG_NAMESPACE, "svg");
  board.setAttributeNS(null, "width", BOARD_WIDTH * BLOCK_SIZE);
  board.setAttributeNS(null, "height", BOARD_HEIGHT * BLOCK_SIZE);
  board.setAttributeNS(null, "class", "board");

  return board;
}

function setUpSnake(length) {
  const snake = [];
  let x = Math.floor(BOARD_WIDTH / 2);
  let y = Math.floor(BOARD_HEIGHT / 2);
  const increment = getXYIncrement(snakeDirection);

  for (let i = 0; i < length; i++) {
    const part = i === length - 1 ? "snake-head" : "snake-body"; // Set the last snake part to be a 'head'
    snake.push(new SnakePart(x, y, part, snakeDirection));
    x += BLOCK_SIZE * increment.x;
    y += BLOCK_SIZE * increment.y;
  }
  return snake;
}

function getXYIncrement(direction) {
  let increment;
  switch (direction) {
    case Direction.up:
      increment = { x: 0, y: -1 };
      break;
    case Direction.down:
      increment = { x: 0, y: 1 };
      break;
    case Direction.left:
      increment = { x: -1, y: 0 };
      break;
    case Direction.right:
      increment = { x: 1, y: 0 };
  }
  return increment;
}

function moveSnake() {
  const snakeLength = snake.length;

  // Get reference to old snake head and old snake tail
  const oldSnakeHead = snake[snakeLength - 1];
  const oldSnakeTail = snake[0];

  // Clone old snake head into new snake head so that
  // it can be added to the front of the snake

  // Set class of old snake-head element to be snake-body
  oldSnakeHead.partName = "snake-body";
  oldSnakeHead.svgGroup.firstElementChild.setAttributeNS(
    null,
    "class",
    "snake-body"
  );

  // Get x y coords of new snake section travelling in current direction
  const increment = getXYIncrement(snakeDirection);

  // Set position of new snake head and display it
  const oldX = oldSnakeHead.xPos;
  const oldY = oldSnakeHead.yPos;
  const newX = oldX + BLOCK_SIZE * increment.x;
  const newY = oldY + BLOCK_SIZE * increment.y;

  const newSnakeHead = new SnakePart(
    newX,
    newY,
    "snake-head",
    snakeDirection
  );

  snake.push(newSnakeHead);
  board.appendChild(newSnakeHead.svgGroup);
  console.log(newSnakeHead);

  // Remove end of snake
  oldSnakeTail.svgGroup.remove();
  snake.shift();
}

function growSnake(snake, direction, numberOfBlocks) {}

function displaySnake() {
  snake.forEach((snakePart) => {
    board.appendChild(snakePart.svgGroup);
  });
}
function gameLoop() {
  moveSnake();
}
