// Setup for canvas

const canvas = document.getElementById("canvas");
const ctx    = canvas.getContext("2d");

// Width and height

const width = window.innerWidth;

let height = 1000;

function setCellSize() {
	if (window.innerWidth >= 1920) {
		return 20;
	}
	if (window.innerWidth >= 1680) {
		height = 920;
		return 10;
	}
	if (window.innerWidth >= 1536) {
    height = 924;
    return 12;
  }
	if (window.innerWidth >= 1440) {
		height = 900;
		return 10;
	}
	if (window.innerWidth >= 768) {
		return 14;
	}
	if (window.innerWidth < 768) {
		return 12;
	}
}

canvas.width  = width
canvas.height = height

const cellSize     = setCellSize();
const widthInCell  = width / cellSize;
const heightInCell = height / cellSize;

// Set score 0

let score = 0;

// Border

function drawBorder() {
	ctx.fillStyle = "#303030";
	ctx.fillRect(0, 0, width, cellSize);
	ctx.fillRect(0, height - cellSize, width, cellSize);
	ctx.fillRect(0, 0, cellSize, height);
	ctx.fillRect(width - cellSize, 0, cellSize, height);
}

// Output text on screen

function drawScore() {
	ctx.font = "64px Lato";
	ctx.fillStyle = "#303030";
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	ctx.fillText(score, width / 30, height / 20);
}

// Game over

function gameOver() {
	clearInterval(loop);
	ctx.font = "78px Lato";
	ctx.fillStyle = "#303030";
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	ctx.fillText("Game Over", width / 2, height / 2);
}

// Draw a circle

function circle(x, y, radius, fillCircle) {
	ctx.beginPath();
	ctx.arc(x, y, radius, 0, Math.PI * 2, false);
	if (fillCircle) {
		ctx.fill();
	} else {
		ctx.stroke();
	}
}

// Set cell

function cell(col, row) {
	this.col = col;
	this.row = row;
}

// Set square in cell

cell.prototype.drawSquare = function (color) {
	let x = this.col * cellSize;
	let y = this.row * cellSize;
	ctx.fillStyle = color;
	ctx.fillRect(x, y, cellSize, cellSize);
};

// Set circle in cell

cell.prototype.drawCircle = function (color) {
	let centerX = this.col * cellSize + cellSize / 2;
	let centerY = this.row * cellSize + cellSize / 2;
	ctx.fillStyle = color;
	circle(centerX, centerY, cellSize / 2, true);
};

cell.prototype.equal = function (otherCell) {
	return this.col === otherCell.col && this.row === otherCell.row;
};

class Apple {
	constructor() {
		this.position = new cell(30, 7);
	}
	draw() {
		this.position.drawCircle("#FFBD39");
	}
	update() {
		let randomCol = Math.floor(Math.random() * (widthInCell - 2)) + 2;
		let randomRow = Math.floor(Math.random() * (heightInCell - 2)) + 2;
		this.position = new cell(randomCol, randomRow);
	}
}

apple = new Apple();

class Snake {
	constructor() {
		this.reset();
		this.listenToKey();
	}
	reset() {
		this.data = [new cell(7, 5), new cell(6, 5), new cell(5, 5)];
		this.direction = { col: 1, row: 0 };
		this.nextDirection = { col: 1, row: 0 };
	};
	draw() {
		for (var i = 0; i < this.data.length; i++) {
			this.data[i].drawSquare("#a275e3");
			if (score >= 10) {
				this.data[i].drawSquare("#dcaee8");
			}
			if (score >= 25) {
				this.data[i].drawSquare("#ffe0e0");
			}
			if (score >= 40) {
				this.data[i].drawSquare("#c5c5c5");
			}
			if (score >= 75) {
				this.data[i].drawSquare("#7d7d7d");
			}
			if (score >= 100) {
        this.data[i].drawSquare("#303030");
      }
		}
	}
	listenToKey() {
		document.addEventListener("keydown", e => {
			if (e.key === "w" || e.key === "ArrowUp") {
				snake.direction = new cell(0, -1);
			} else if (e.key === "s" || e.key === "ArrowDown") {
				snake.direction = new cell(0, 1);
			} else if (e.key === "a" || e.key === "ArrowLeft") {
				snake.direction = new cell(-1, 0);
			} else if (e.key === "d" || e.key === "ArrowRight") {
				snake.direction = new cell(1, 0);
			}
		});
	}
	update() {
		let head = this.data[0];
		let newHead = new cell(
			(head.col + this.direction.col + widthInCell) % widthInCell,
			(head.row + this.direction.row + heightInCell) % heightInCell
		);
		if (this.direction === "ArrowRight") {
			newHead = new cell(head.col + 1, head.row);
		} else if (this.direction === "ArrowDown") {
			newHead = new cell(head.col, head.row + 1);
		} else if (this.direction === "ArrowLeft") {
			newHead = new cell(head.col - 1, head.row);
		} else if (this.direction === "ArrowUp") {
			newHead = new cell(head.col, head.row - 1);
		}
		if (this.checkCollision(newHead)) {
			gameOver();
			return;
		}

		this.data.unshift(newHead);

		if (newHead.equal(apple.position)) {
			score++;
			apple.update();
		} else {
			this.data.pop();
		}
	}
	checkCollision(elem) {
		elem = this.data[0];
		let leftCollision = elem.col === + 1;
		let topCollision = elem.row === + 1;
		let rightCollision = elem.col === widthInCell - 2;
		let bottomCollision = elem.row === heightInCell - 2;
		let wallCollision = leftCollision || topCollision || rightCollision || bottomCollision;
		let selfCollision = false;
		for (var i = 0; i < this.data.length; i++) {
			if (elem.equal(this.data[2])) {
				selfCollision = true;
			}
		}
		return wallCollision || selfCollision;
	}
}

var snake = new Snake();

// Restart

// function restart() {
//   snake.reset();
// }

// Request to animation

function loop() {
	setTimeout(() => {
		requestAnimationFrame(loop);
	}, 45);
	ctx.clearRect(0, 0, width, height);
	drawScore();
	drawBorder();
  snake.update();
	apple.draw();
	snake.draw();
}

requestAnimationFrame(loop);