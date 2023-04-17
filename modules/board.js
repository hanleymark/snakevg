import { Direction } from "./direction.js";

export class Board {
  constructor(
    width,
    height,
    blockSize,
    backgroundImage = null,
    borderColour = "turquoise",
    backgroundColour = "#000",
    snakeDirection = Direction.right,
    tickMS = 250
  ) {
    this.width = width;
    this.height = height;
    this.blockSize = blockSize;
    this.snakeDirection = snakeDirection;
    this.svgNamespace = "http://www.w3.org/2000/svg";
    this.boardElement = document.createElementNS(this.svgNamespace, "svg");
    this.snakeElement = document.createElementNS(this.svgNamespace, "g");
    this.snake = [];
    this.food = null;
    this.setUpBoard(borderColour, backgroundColour, backgroundImage);
    this.setUpSnake(10);
    this.displaySnake();
    this.setUpKeyboardListeners();
    this.tick = setInterval(this.gameLoop.bind(this), tickMS);
  }

  setUpBoard(borderColour, backgroundColour, backgroundImage) {
    // Get reference to root element for setting css variables
    const docRoot = document.querySelector("html");

    // Set block size, border style and background colour css variables
    docRoot.style.setProperty("--block-size", `${this.blockSize}px`);
    docRoot.style.setProperty("--board-border-color", borderColour);
    docRoot.style.setProperty("--board-bg-color", backgroundColour);

    // Set board svg element size
    this.boardElement.setAttributeNS(
      null,
      "width",
      this.width * this.blockSize
    );
    this.boardElement.setAttributeNS(
      null,
      "height",
      this.height * this.blockSize
    );
    this.boardElement.setAttributeNS(null, "class", "board");

    // Add snake element to board
    this.boardElement.appendChild(this.snakeElement);

    // Set background image if it exists
    if (backgroundImage) {
      this.boardElement.style.backgroundImage = `url(${backgroundImage})`;
      this.boardElement.style.backgroundSize = "cover";
    }
  }

  setUpSnake(length = 3) {
    let x = Math.floor(this.width / 2);
    let y = Math.floor(this.height / 2);

    for (let i = 0; i < length; i++) {
      const part = i === 0 ? "snake-head" : "snake-body"; // Set the last snake part to be a 'head'
      this.snake.push(new SnakePart(x - i, y, part, this.snakeDirection));
    }
  }

  moveSnake(direction) {}

  render() {
    const svgNamespace = "http://www.w3.org/2000/svg";

    // Clear board svg element of all children
    this.boardElement.innerHTML = "";
    // console.log(this.element);
    return this.boardElement;
  }

  displaySnake() {
    // Clear snake element of all children
    this.snakeElement.innerHTML = "";
    // Iterate through snake array and create svg elements for each part
    this.snake.forEach((part) => {
      const svgCircle = document.createElementNS(this.svgNamespace, "circle");

      svgCircle.setAttributeNS(null, "class", part.partName);
      svgCircle.setAttributeNS(null, "cx", part.x * this.blockSize);
      svgCircle.setAttributeNS(null, "cy", part.y * this.blockSize);
      svgCircle.setAttributeNS(null, "r", this.blockSize / 2);

      this.snakeElement.appendChild(svgCircle);
    });

    this.boardElement.appendChild(this.snakeElement);
  }

  gameLoop() {
    // Get the x and y increments for the snake's direction
    const increment = this.getXYIncrement();
    const nextX = this.snake[0].x + increment.x;
    const nextY = this.snake[0].y + increment.y;
    
    // Remove the tail element from the snake array
    this.snake.pop(); 
    // Set the old head element to be a body part
    this.snake[0].partName = "snake-body"; 
    // Add a new head element to the snake array
    this.snake.unshift(new SnakePart(nextX, nextY, "snake-head", this.snakeDirection));

    // Display snake
    this.displaySnake();
  }

  setUpKeyboardListeners() {
    // Add event listener for keydown events
    document.addEventListener("keydown", (event) => {
      // Get the key code of the key that was pressed
      const key = event.key;

      // Set the snake's direction based on the key pressed
      switch (key) {
        case "ArrowLeft":
          this.snakeDirection = Direction.left;
          break;
        case "ArrowUp":
          this.snakeDirection = Direction.up;
          break;
        case "ArrowRight":
          this.snakeDirection = Direction.right;
          break;
        case "ArrowDown":
          this.snakeDirection = Direction.down;
          break;
      }
    });
  }

  getXYIncrement() {
    let increment;
    switch (this.snakeDirection) {
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
}

function SnakePart(x, y, partName, direction) {
  this.x = x;
  this.y = y;
  this.partName = partName;
  this.direction = direction;
}