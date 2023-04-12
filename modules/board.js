export class Board {
  constructor(
    width,
    height,
    blockSize,
    backgroundImage = null,
    borderColour = "#888",
    backgroundColour = "#000"
  ) {
    this.width = width;
    this.height = height;
    this.blockSize = blockSize;
    this.borderColour = borderColour;
    this.backgroundColour = backgroundColour;
    // Create 2D array of size width x height and fill with null
    this.grid = new Array(width)
      .fill(null)
      .map(() => new Array(height).fill(null));
    this.backgroundImage = backgroundImage;
    this.svgNamespace = "http://www.w3.org/2000/svg";
    this.element = document.createElementNS(this.svgNamespace, "svg");
    this.snake = [];
    this.food = null;
    this.setUpBoard();
  }

  setUpBoard() {
    // Get reference to root element for setting css variables
    const docRoot = document.querySelector("html");
    
    // Set block size, border style and background colour css variables
    docRoot.style.setProperty("--block-size", `${this.blockSize}px`);
    this.element.style.setProperty("--board-border-color", this.borderColour);
    this.element.style.setProperty("--board-bg-color", this.backgroundColour);

    // Set board svg element size
    this.element.setAttributeNS(null, "width", this.width * this.blockSize);
    this.element.setAttributeNS(
      null,
      "height",
      this.height * this.blockSize
    );
    this.element.setAttributeNS(null, "class", "board");

    // Set background image if it exists
    if (this.backgroundImage) {
      this.element.style.backgroundImage = `url(${this.backgroundImage})`;
      this.element.style.backgroundSize = "cover";
    }
  }

  render() {
    const svgNamespace = "http://www.w3.org/2000/svg";

    // Clear board svg element of all children
    this.element.innerHTML = "";
    return this.element;
  }
}
