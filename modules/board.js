import { Direction } from "./direction.js";

export class Board {
  constructor(
    width,
    height,
    blockSize,
    backgroundImage = null,
    borderColour = "#00f7ff",
    backgroundColour = "#000",
    snakeDirection = Direction.right,
    tickMS = 250
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
    this.allFoodItems = this.setUpFoodItems();
    this.foodItemIterator = 0;
    this.score = 0;
    this.growSnake = false;
    this.colliding = false;
    this.setUpBoard(borderColour, backgroundColour, backgroundImage);
    this.setUpSnake();
    this.displaySnake();
    this.displayFood();
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
    docRoot.style.setProperty(
      "--centre-x",
      `${(this.width * this.blockSize) / 2}`
    );
    docRoot.style.setProperty(
      "--centre-y",
      `${(this.height * this.blockSize) / 2}`
    );

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
    return this.boardElement;
  }

  displaySnake() {
    // Clear snake element of all children
    this.snakeElement.innerHTML = "";
    // Declare eye elements
    let svgLeftEyeGroup;
    let svgRightEyeGroup;
    let svgEyeWhite;
    let svgEyeBlack;

    // Iterate through snake array and create svg elements for each part
    this.snake.reduceRight((_, part) => {
      const svgSnakeSectionGroup = document.createElementNS(
        this.svgNamespace,
        "g"
      );
      const svgCircle = document.createElementNS(this.svgNamespace, "circle");

      svgCircle.setAttributeNS(null, "cx", part.x * this.blockSize);
      svgCircle.setAttributeNS(null, "cy", part.y * this.blockSize);
      svgCircle.setAttributeNS(null, "r", this.blockSize / 1.75);
      //
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

      if (this.colliding) {
        cssAnimation = "";
      }

      svgSnakeSectionGroup.setAttributeNS(
        null,
        "class",
        `${part.partName} ${cssAnimation}`
      );

      // Set up animation end event listener to head element to call game loop iteration
      if (part.partName === "snake-head") {
        // Set up eye svg elements for snake head

        // Set up position shift for eyes based on direction
        const isUpDown =
          part.direction === Direction.up || part.direction === Direction.down;
        const eyeOffset = {
          x: isUpDown ? this.blockSize / 3 : 0,
          y: isUpDown ? 0 : this.blockSize / 3,
        };

        let nudge = this.blockSize / 4;
        let eyesToFrontX = 0;
        let eyesToFrontY = 0;

        // Add in extra shift to move eyes to front of head
        switch (part.direction) {
          case Direction.up:
            eyesToFrontY = -nudge;
            break;
          case Direction.down:
            eyesToFrontY = nudge;
            break;
          case Direction.left:
            eyesToFrontX = -nudge;
            break;
          case Direction.right:
            eyesToFrontX = nudge;
            break;
        }

        svgLeftEyeGroup = document.createElementNS(this.svgNamespace, "g");

        svgEyeWhite = document.createElementNS(this.svgNamespace, "circle");
        svgEyeBlack = document.createElementNS(this.svgNamespace, "circle");
        svgEyeWhite.setAttributeNS(null, "r", this.blockSize / 4);
        svgEyeBlack.setAttributeNS(null, "r", this.blockSize / 8);
        svgEyeWhite.setAttributeNS(null, "class", "snake-eye-white");
        svgEyeBlack.setAttributeNS(null, "class", "snake-eye-black");
        svgEyeWhite.setAttributeNS(
          null,
          "cx",
          part.x * this.blockSize - eyeOffset.x + eyesToFrontX
        );
        svgEyeWhite.setAttributeNS(
          null,
          "cy",
          part.y * this.blockSize - eyeOffset.y + eyesToFrontY
        );
        svgEyeBlack.setAttributeNS(
          null,
          "cx",
          part.x * this.blockSize - eyeOffset.x + eyesToFrontX
        );
        svgEyeBlack.setAttributeNS(
          null,
          "cy",
          part.y * this.blockSize - eyeOffset.y + eyesToFrontY
        );
        svgLeftEyeGroup.appendChild(svgEyeWhite);
        svgLeftEyeGroup.appendChild(svgEyeBlack);

        svgRightEyeGroup = svgLeftEyeGroup.cloneNode(true);
        svgRightEyeGroup.childNodes[0].setAttributeNS(
          null,
          "cx",
          part.x * this.blockSize + eyeOffset.x + eyesToFrontX
        );
        svgRightEyeGroup.childNodes[1].setAttributeNS(
          null,
          "cx",
          part.x * this.blockSize + eyeOffset.x + eyesToFrontX
        );
        svgRightEyeGroup.childNodes[0].setAttributeNS(
          null,
          "cy",
          part.y * this.blockSize + eyeOffset.y + eyesToFrontY
        );
        svgRightEyeGroup.childNodes[1].setAttributeNS(
          null,
          "cy",
          part.y * this.blockSize + eyeOffset.y + eyesToFrontY
        );
        // Set up animation end event listener to head element to call game loop iteration
        if (!this.colliding) {
          svgSnakeSectionGroup.addEventListener("animationend", () => {
            this.gameLoop();
          });
        }
      }
      this.snakeElement.appendChild(svgCircle);
      svgSnakeSectionGroup.appendChild(svgCircle);
      if (svgLeftEyeGroup) {
        svgSnakeSectionGroup.appendChild(svgLeftEyeGroup);
        svgSnakeSectionGroup.appendChild(svgRightEyeGroup);
        const svgLeftEyelid = svgLeftEyeGroup.childNodes[0].cloneNode(true);
        const svgRightEyelid = svgRightEyeGroup.childNodes[0].cloneNode(true);
        svgLeftEyelid.setAttributeNS(null, "class", "snake-eyelid invisible");
        svgRightEyelid.setAttributeNS(null, "class", "snake-eyelid invisible");
        svgSnakeSectionGroup.appendChild(svgLeftEyelid);
        svgSnakeSectionGroup.appendChild(svgRightEyelid);
        // Randomly decide whether to blink eyes
        if (Math.random() < 0.1) {
          svgLeftEyelid.setAttributeNS(null, "class", "visible snake-eyelid");
          svgRightEyelid.setAttributeNS(null, "class", "visible snake-eyelid");
        }
      }

      this.snakeElement.appendChild(svgSnakeSectionGroup);
    }, null);

    this.boardElement.appendChild(this.snakeElement);
    if (this.colliding) {
      this.gameOver();
    }
  }

  gameLoop() {
    // Remove event listener from head element
    const oldSnakeHeadElement = document.querySelector(".snake-head");
    oldSnakeHeadElement.removeEventListener("animationend", this.gameLoop);
    // Update next position of old snake head
    const oldSnakeHead = this.snake[0];

    // Get the x and y increments for the snake's direction
    const increment = this.getXYIncrement(this.snakeDirection);
    let nextX = this.snake[0].x + increment.x;
    let nextY = this.snake[0].y + increment.y;

    if (nextX > this.width + 1) {
      nextX = -1;
    }
    if (nextX < -1) {
      nextX = this.width + 1;
    }
    if (nextY > this.height + 1) {
      nextY = -1;
    }
    if (nextY < -1) {
      nextY = this.height + 1;
    }

    // Remove the tail element from the snake array if snake has not just eaten food
    if (!this.growSnake) {
      this.snake.pop();
    } else {
      this.growSnake = false;
    }
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

    // Check if snake has collided with itself
    if (!this.isPositionEmpty(newSnakeHead.x, newSnakeHead.y)) {
      this.colliding = true;
    }

    this.snake.unshift(newSnakeHead);

    // Check if snake has collided with food item
    const currentFoodItem = this.allFoodItems[this.foodItemIterator];
    if (
      this.snake[0].x === currentFoodItem.x &&
      this.snake[0].y === currentFoodItem.y
    ) {
      this.score += 100;
      this.tickMS -= 5;
      if (this.tickMS < 50) {
        this.tickMS = 50;
      }
      const docRoot = document.querySelector("html");
      docRoot.style.setProperty("--tick-ms", `${this.tickMS}ms`);
      this.growSnake = true;
      this.foodItemIterator =
        (this.foodItemIterator + 1) % this.allFoodItems.length;
      this.displayFood();
    }

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

  setUpFoodItems() {
    const allTechImagePaths = [
      "./images/tech-icons/aws.svg",
      "./images/tech-icons/css.svg",
      "./images/tech-icons/docker.svg",
      "./images/tech-icons/eslint.svg",
      "./images/tech-icons/git.svg",
      "./images/tech-icons/github.svg",
      "./images/tech-icons/graphql.svg",
      "./images/tech-icons/html.svg",
      "./images/tech-icons/js.svg",
      "./images/tech-icons/json.svg",
      "./images/tech-icons/kubernetes.svg",
      "./images/tech-icons/linux.svg",
      "./images/tech-icons/netlify.svg",
      "./images/tech-icons/nextjs.svg",
      "./images/tech-icons/node.svg",
      "./images/tech-icons/npm.svg",
      "./images/tech-icons/openai.svg",
      "./images/tech-icons/postgresql.svg",
      "./images/tech-icons/prettier.svg",
      "./images/tech-icons/react.svg",
      "./images/tech-icons/vscode.svg",
    ];

    const foodItems = [];
    for (let imagePath of allTechImagePaths) {
      const foodItem = new FoodItem(
        null, // Leave out x position for now
        null, // Leave out y position for now
        imagePath,
        this.svgNamespace,
        this.blockSize * 2
      );
      foodItems.push(foodItem);
    }
    return foodItems;
  }

  displayFood() {
    // Remove any food items from the board
    const oldFoodItems = document.querySelectorAll(".food-item");
    if (oldFoodItems) {
      for (let foodItem of oldFoodItems) {
        foodItem.remove();
      }
    }

    // Display food item
    const newFoodItem = this.allFoodItems[this.foodItemIterator];
    const position = this.getRandomEmptyPosition();
    newFoodItem.x = position.x;
    newFoodItem.y = position.y;
    const newFoodItemElement = newFoodItem.imageElement();
    newFoodItemElement.setAttributeNS(
      null,
      "class",
      "food-item animate-food-in"
    );
    setTimeout(() => {
      this.boardElement.appendChild(newFoodItemElement);
    }, 1000);
  }

  getRandomEmptyPosition() {
    let xCoord, yCoord;
    let positionIsEmpty = false;
    while (!positionIsEmpty) {
      xCoord = Math.floor(Math.random() * (this.width - 2)) + 1;
      yCoord = Math.floor(Math.random() * (this.height - 2)) + 1;
      positionIsEmpty = this.isPositionEmpty(xCoord, yCoord);
    }
    return { x: xCoord, y: yCoord };
  }

  isPositionEmpty(x, y) {
    let isPositionEmpty = true;
    for (let snakePart of this.snake) {
      if (snakePart.x === x && snakePart.y === y) {
        isPositionEmpty = false;
        break;
      }
    }
    return isPositionEmpty;
  }

  gameOver() {
    let animationPauseMS = 500;

    const snakeElements = document.querySelectorAll(".snake-body");
    const snakeHeadElement = document.querySelector(".snake-head");
    console.log(snakeHeadElement);
    snakeElements.forEach((element) => {
      setTimeout(() => {
        element.setAttributeNS(null, "class", "snake-body snake-collision");
      }, animationPauseMS);
      animationPauseMS += 50;
    });
    setTimeout(() => {
      snakeHeadElement.setAttributeNS(
        null,
        "class",
        "snake-head snake-collision"
      );
    }, animationPauseMS);
  }
}

function SnakePart(x, y, partName, direction) {
  this.x = x;
  this.y = y;
  this.partName = partName;
  this.direction = direction;
}

function FoodItem(x, y, path, svgNamespace, blockSize) {
  this.x = x;
  this.y = y;
  this.path = path;
  this.svgNamespace = svgNamespace;
  this.blockSize = blockSize;
  this.imageElement = () => {
    const svgImageElement = document.createElementNS(svgNamespace, "image");
    svgImageElement.setAttributeNS(null, "href", this.path);
    svgImageElement.setAttributeNS(
      null,
      "x",
      ((this.x - 1) * this.blockSize) / 2
    );
    svgImageElement.setAttributeNS(
      null,
      "y",
      ((this.y - 1) * this.blockSize) / 2
    );
    svgImageElement.setAttributeNS(null, "width", blockSize);
    svgImageElement.setAttributeNS(null, "height", blockSize);
    svgImageElement.setAttributeNS(null, "class", "food-item");
    return svgImageElement;
  };
}
