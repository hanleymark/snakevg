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

let board = setUpBoard(BOARD_WIDTH, BOARD_HEIGHT, BLOCK_SIZE);
document.body.appendChild(board);

let snakeDirection = Direction.up;
let snake = setUpSnake(SNAKE_START_LENGTH);

document.body.appendChild(board);

snake.forEach((snakePart) => {
  board.appendChild(snakePart.svgGroup);
});

document.addEventListener("keydown", (event) => {
  const key = event.key;

  if (key === "ArrowLeft") x -= 1;
  if (key === "ArrowRight") x += 1;
  if (key === "ArrowUp") y -= 1;
  if (key === "ArrowDown") y += 1;
});

function SnakePart(xPos, yPos, partName, direction) {
  const circlesPerBlock = 4;
  this.xPos = xPos;
  this.yPos = yPos;
  this.partName = partName;
  this.direction = direction;

  // Create SVG group element
  this.svgGroup = document.createElementNS(SVG_NAMESPACE, "g");
  this.svgGroup.setAttributeNS(null, "class", "snake-body-block");

  if (this.partName === "snake-body") {
    // Create circle elements
    const radius = BLOCK_SIZE / 2; // Set radius of circle to overlap

    // Set increment direction for overlapping circles
    let increment = getXYIncrement(this.direction);

    for (let i = 0; i < circlesPerBlock; i++) {
      const x = this.xPos + ((i * increment.x) / circlesPerBlock);
      const y = this.yPos + ((i * increment.y) / circlesPerBlock);
      const circle = document.createElementNS(SVG_NAMESPACE, "circle");
      circle.setAttributeNS(null, "cx", x * BLOCK_SIZE);
      circle.setAttributeNS(null, "cy", y * BLOCK_SIZE);
      circle.setAttributeNS(null, "r", radius);
      circle.setAttributeNS(null, "class", "snake-body"); // Set class name so it can be styled
      this.svgGroup.appendChild(circle);
    }
  }

  if (this.partName === "snake-head") {
    // Create circle elements
    const radius = (BLOCK_SIZE / 2) * 1.4; // Set radius of circle to overlap

    for (let i = 0; i < circlesPerBlock; i++) {
      const x = xPos + i * increment.x;
      const y = yPos + i * increment.y;
      const circle = document.createElementNS(SVG_NAMESPACE, "circle");
      circle.setAttributeNS(null, "cx", this.xPos * BLOCK_SIZE);
      circle.setAttributeNS(null, "cy", this.yPos * BLOCK_SIZE);
      circle.setAttributeNS(null, "r", this.radius);
      circle.setAttributeNS(null, "class", this.partName); // Set class name so it can be styled
      svgGroup.appendChild(circle);
    }
  }
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
    // const part = i === length - 1 ? "snake-head" : "snake-body";
    const part = "snake-body";
    snake.push(new SnakePart(x, y, part, snakeDirection));
    console.log(`Before: x=${x} y=${y}`);
    x += (BLOCK_SIZE * increment.x);
    y += (BLOCK_SIZE * increment.y);
    console.log(`After: x=${x} y=${y}`);
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

// Next steps:
// Drop circles per block
// Make circles larger than block
// Add two eyes for head (in direction of travel) pre-make and transform rotate?
