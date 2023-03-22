// Set up game attributes
const SVG_NAMESPACE = "http://www.w3.org/2000/svg";

const BOARD_WIDTH = 50;      // Width of board in blocks
const BOARD_HEIGHT = 30;     // Height of board in blocks
const BLOCK_SIZE = 16;       // Size of one block in pixels
const TICK_MS = 250;         // Time in milliseconds for each game tick
const SNAKE_START_LENGTH = 5; // Initial length of snake

function SnakePart(xpos, ypos, blockSize, part) {
    this.xpos = xpos;
    this.ypos = ypos;
    this.radius = blockSize * 1.2;
    this.part = part;

    this.element = document.createElementNS(
        SVG_NAMESPACE,
        "circle",
    );
    this.element.setAttributeNS(null, "cx", xpos * blockSize);
    this.element.setAttributeNS(null, "cy", ypos * blockSize);
    this.element.setAttributeNS(null, "r", this.radius);
    this.element.setAttributeNS(null, "class", part);
}

const board = setUpBoard(BOARD_WIDTH, BOARD_HEIGHT, BLOCK_SIZE);

const snake = setUpSnake(SNAKE_START_LENGTH);

document.body.appendChild(board);



document.addEventListener("keydown", (event) => {
  const key = event.key;

  if (key === "ArrowLeft") x -= 1;
  if (key === "ArrowRight") x += 1;
  if (key === "ArrowUp") y -= 1;
  if (key === "ArrowDown") y += 1;

  circle.setAttributeNS(null, "cx", x * BLOCK_SIZE);
  circle.setAttributeNS(null, "cy", y * BLOCK_SIZE);
  const randColour = Math.floor(Math.random() * 16777215).toString(16);
  circle.setAttributeNS(null, "style", `fill: #${randColour}`);
});

function setUpBoard() {
  const board = document.createElementNS(SVG_NAMESPACE, "svg");
  board.setAttributeNS(null, "width", BOARD_WIDTH * BLOCK_SIZE);
  board.setAttributeNS(null, "height", BOARD_HEIGHT * BLOCK_SIZE);
  board.setAttributeNS(
    null,
    "class",
    "board"
  );

  return board;
}

function setUpSnake(length) {
    const snake = [];
    const x = Math.floor(BOARD_WIDTH / 2);
    const y = Math.floor(BOARD_HEIGHT / 2);

    for (let i = 0; i < length; i++) {
        const part = (i === 0) ? "snake-head" : "snake-body";
        snake.push(
            new SnakePart(
                x,
                y,
                BLOCK_SIZE,
                part
            )
        );
    }
    return snake;
}

// Next steps:
// Refactor snakepart object into separate file
// Probably board too?
// Pass in function args rather than relying on constants