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
    tickMS = 200
  ) {
    this.width = width;
    this.height = height;
    this.blockSize = blockSize;
    this.snakeDirection = snakeDirection;
    this.tickMS = tickMS;
    this.svgNamespace = "http://www.w3.org/2000/svg";
    this.boardElement = document.createElementNS(this.svgNamespace, "svg");
    this.snakeElement = document.createElementNS(this.svgNamespace, "g");
    this.snake = [];
    this.food = null;
    this.setUpBoard(borderColour, backgroundColour, backgroundImage);
    this.setUpSnake();
    this.displaySnake();
    this.setUpKeyboardListeners();
    // this.tick = setInterval(this.gameLoop.bind(this), tickMS);
  }

  setUpBoard(borderColour, backgroundColour, backgroundImage) {
    // Get reference to root element for setting css variables
    const docRoot = document.querySelector("html");

    // Set block size, border style and background colour css variables
    docRoot.style.setProperty("--block-size", `${this.blockSize}px`);
    docRoot.style.setProperty("--board-border-color", borderColour);
    docRoot.style.setProperty("--board-bg-color", backgroundColour);
    docRoot.style.setProperty("--tick-ms", `${this.tickMS}ms`);

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
    // Iterate backwards through snake array and create svg elements for each part
    this.snake.reduceRight((_, part) => {
      const svgCircle = document.createElementNS(this.svgNamespace, "circle");

      let cssAnimation;

      switch (part.direction) {
        case Direction.up:
          cssAnimation = "animate-up";
          break;
        case Direction.down:
          cssAnimation = "animate-down";
          break;
        case Direction.left:
          cssAnimation = "animate-left";
          break;
        case Direction.right:
          cssAnimation = "animate-right";
          break;
      }

      svgCircle.setAttributeNS(null, "cx", part.x * this.blockSize);
      svgCircle.setAttributeNS(null, "cy", part.y * this.blockSize);
      svgCircle.setAttributeNS(null, "r", this.blockSize / 2);

      svgCircle.setAttributeNS(
        null,
        "class",
        `${part.partName} ${cssAnimation}`
      );

      if (part.partName === "snake-head") {
        svgCircle.addEventListener("animationend", () => {
          this.gameLoop();
        });
      }

      this.snakeElement.appendChild(svgCircle);
    },null);

    this.boardElement.appendChild(this.snakeElement);
  }

  gameLoop() {
    // Remove event listener from head element
    const oldSnakeHeadElement = document.querySelector(".snake-head");
    oldSnakeHeadElement.removeEventListener("animationend", this.gameLoop);
    // Update next position of old snake head
    const oldSnakeHead = this.snake[0];

    // Get the x and y increments for the snake's direction
    const increment = this.getXYIncrement(this.snakeDirection);
    const nextX = this.snake[0].x + increment.x;
    const nextY = this.snake[0].y + increment.y;

    // Remove the tail element from the snake array
    this.snake.pop();
    // Set the old head element to be a body part and remove event listener
    oldSnakeHead.partName = "snake-body";
    // Add a new head element to the snake array

    const newSnakeHead = new SnakePart(
      nextX,
      nextY,
      "snake-head",
      this.snakeDirection
    );
    if (oldSnakeHead.direction !== this.snakeDirection) {
      newSnakeHead.x += this.getXYIncrement(oldSnakeHead.direction).x;
      newSnakeHead.y += this.getXYIncrement(oldSnakeHead.direction).y;
      switch (this.snakeDirection) {
        case Direction.up:
          newSnakeHead.y += 1;
          break;
        case Direction.down:
          newSnakeHead.y -= 1;
          break;
        case Direction.left:
          newSnakeHead.x += 1;
          break;
        case Direction.right:
          newSnakeHead.x -= 1;
          break;
      }
    }

    this.snake.unshift(newSnakeHead);
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

  getXYIncrement(direction) {
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
}

function SnakePart(x, y, partName, direction) {
  this.x = x;
  this.y = y;
  this.partName = partName;
  this.direction = direction;
}
