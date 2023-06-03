// selecting elements

let board;
let context;
let boardHeight = 648;
let boardWidth = 350;

let birdWidth = 34;
let birdHeight = 24;
let birdX = boardWidth / 7.5;
let birdY = boardHeight / 2;
let birdImg;

let bird = {
  x: birdX,
  y: birdY,
  width: birdWidth,
  height: birdHeight,
};

let pipeArr = [];
let pipeWidth = 64;
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;

let velocityX = -2;

let velocityY = 0;

let gravity = 0.4;

let gameOver = false;
let score = 0;

let die, flap, hit, point,swosh;
window.onload = function () {
  flap = document.querySelector("audio[data-sound='flap']");
  hit = document.querySelector("audio[data-sound='hit']");
  die = document.querySelector("audio[data-sound='die']");
  point = document.querySelector("audio[data-sound='point']");
  swosh = document.querySelector("audio[data-sound='swosh']");
  board = document.querySelector("canvas#canvas");
  board.height = boardHeight;
  board.width = boardWidth;
  context = board.getContext("2d");

  // context.fillStyle = "yellow";
  // context.fillRect(bird.x, bird.y, bird.width, bird.height);

  birdImg = new Image();
  birdImg.src = "./imgs/flappybird.png";

  topPipeImg = new Image();
  topPipeImg.src = "./imgs/toppipe.png";
  bottomPipeImg = new Image();
  bottomPipeImg.src = "./imgs/bottompipe.png";

  requestAnimationFrame(update);
  setInterval(placePipes, 1500);

  document.addEventListener("keydown", moveBird);
  board.addEventListener("click", moveBird);
};

// adding functions
function update() {
  requestAnimationFrame(update);
  if (gameOver) return;
  context.clearRect(0, 0, board.width, board.height);

  context.drawImage(birdImg, bird.x, bird.y, birdWidth, birdHeight);
  velocityY += gravity;
  // bird.y+=velocityY;

  if (bird.y > board.height) {
    gameOver = true;
    die.currentTime = 0;
    die.play();
  }

  bird.y = Math.max(bird.y + velocityY, 0);
  birdImg.onload = function () {
    context.drawImage(birdImg, bird.x, bird.y, birdWidth, birdHeight);
  };

  for (let i = 0; i < pipeArr.length; i++) {
    let pipe = pipeArr[i];
    pipe.x += velocityX;
    context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

    if (!pipe.passed && bird.x > pipe.x + pipe.width) {
      score += 1 / 2;
      point.currentTime = 0;
      point.play();
      swosh.currentTime=0;
      swosh.play();
      pipe.passed = true;
    }

    if (detectCollision(bird, pipe)) {
      gameOver = true;
      hit.currentTime = 0;
      hit.play();
    }
  }

  while (pipeArr.length > 0 && pipeArr[0].x + pipeWidth < 0) {
    pipeArr.shift();
  }

  // score
  context.fillStyle = "white";
  context.font = "45px sans-serif";
  context.fillText(score, 5, 45);

  if (gameOver) {
    context.fillText("GAME OVER", 34, 302);
  }
  context.fillStyle = "#0000ff";
  context.font = "16px sans-serif";
  if (gameOver) {
    context.fillText("TO RESTART PRESS ARROW DOWN ↓", 5, 100);
    context.fillText("OR CLICK HERE", 5, 495);
  }
}

function placePipes() {
  if (gameOver) return;
  let randomYPosition =
    pipeY - pipeHeight / 4 - Math.random() * (pipeHeight / 2);
  let topPipe = {
    img: topPipeImg,
    x: pipeX,
    y: randomYPosition,
    width: pipeWidth,
    height: pipeHeight,
    passed: false,
  };
  pipeArr.push(topPipe);

  let openingSpace = boardHeight / 4;

  let bottomPipe = {
    img: bottomPipeImg,
    x: pipeX,
    y: randomYPosition + pipeHeight + openingSpace,
    width: pipeWidth,
    height: pipeHeight,
    passed: false,
  };
  pipeArr.push(bottomPipe);
}

function moveBird(e) {
  if (
    e.code == "Space" ||
    e.code == "ArrowUp" ||
    e.type == "click" ||
    e.code == "KeyX"
  ) {
    // console.log(flap);
    if (!gameOver) {
      flap.currentTime = 0;
      flap.play();
      velocityY = -6;
    }
  }
  if (e.code == "ArrowDown" || e.type == "click") {
    if (gameOver) {
      bird.y = birdY;
      pipeArr = [];
      score = 0;
      gameOver = false;
      velocityY=0;
    }
  }
}

function detectCollision(a, b) {
  // Logic for collision between two rectangles
  return (
    a.x < b.x + b.width && // tale-top
    a.x + a.width > b.x && //mouth-top
    a.y < b.y + b.height && // top-pipe
    a.y + a.height > b.y //bottom-pipe
  );
}
