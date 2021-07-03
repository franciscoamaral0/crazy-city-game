// I need to write victory score. Use dom for it.
window.onload = () => {
  document.getElementById("start-button").onclick = () => {
    startGame();
  };

  document.addEventListener("keydown", (e) => {
    switch (e.code) {
      case "ArrowRight":
      case "KeyD":
        car.moveFront();
        break;
      case "ArrowLeft":
      case "KeyA":
        car.moveBack();
        break;
      case "ArrowUp":
      case "KeyW":
        car.moveLeft();
        break;
      case "ArrowDown":
      case "KeyS":
        car.moveRight();
        break;
    }
  });
  // CREATE CANVAS
  const canvasArea = {
    canvas: document.createElement("canvas"),
    
  };

  function displayNone(element) {
    let displayNone = (document.querySelector(element).style.display = "none");
  }

  function hiddenButton() {
    let button = (document.getElementById("start-button").style.visibility =
      "hidden");
  }

  function unHideButton() {
    let button = (document.getElementById("start-button").style.visibility =
      "visible");
  }

  // START GAME FUNCTION
  function startGame() {
    displayNone(".startScreen");
    (canvasArea.canvas.width = 650),
    (canvasArea.canvas.height = 430),
    (canvasArea.ctx = canvasArea.canvas.getContext("2d"));
    document.querySelector(".container").appendChild(canvasArea.canvas);
    marioKartTheme.play();
    hiddenButton();
    countDown();
    updateCanvas();
  }


  let animationId = null;

  function updateCanvas() {
    clearCanvas();
    background.draw();
    car.draw();
    icons[0].controlIcons();
    iconTurtle.draw();
    iconOldMan.controlIcons();
    iconOldMan.draw();
    iconDinoFanho.controlIcons();
    iconDinoFanho.draw();
    iconRedShell.controlIcons();
    iconRedShell.draw();
    timerIcon.draw()
    checkGameOver();
    showTime();
    checkFinishGame();
  }

  // FUNCTION CLEAR CANVAS
  function clearCanvas() {
    canvasArea.ctx.clearRect(
      0,
      0,
      canvasArea.canvas.width,
      canvasArea.canvas.height
    );
  }

  // BACKGROUND AND METHODS
  class Background {
    constructor(source) {
      this.posX = 0;
      this.posY = 0;
      const img = new Image();
      img.src = source;
      img.onload = () => {
        this.img = img;
      };
    }
    draw() {
      canvasArea.ctx.drawImage(
        this.img,
        this.posX,
        this.posY,
        canvasArea.canvas.width,
        485
      );
    }
  }

  const background = new Background("/images/background2.PNG");

  // ICONS AND METHODS
  class Icons {
    constructor(source, posX, posY, w, h, speed) {
      this.width = w;
      this.height = h;
      this.posX = posX;
      this.posY = posY;
      this.speed = speed;
      this.direction = "down";

      const image = new Image();
      image.src = source;
      image.onload = () => {
        this.image = image;
      };
    }
    draw() {
      canvasArea.ctx.drawImage(
        this.image,
        this.posX,
        this.posY,
        this.width,
        this.height
      );
    }

    top() {
      return this.posY;
    }

    bottom() {
      return this.posY + this.height;
    }

    left() {
      return this.posX;
    }

    right() {
      return this.posX + this.width;
    }

    moveFront() {
      this.posX += this.speed;
    }

    moveBack() {
      if (this.posX > 10) this.posX -= this.speed;
    }

    moveLeft() {
      if (this.posY >= 235) this.posY -= this.speed;
    }

    moveRight() {
      if (this.posY < 385) this.posY += this.speed;
    }

    controlIcons() {
      if (this.direction === "down") {
        this.posY += this.speed;
      }
      if (this.direction === "up") {
        this.posY -= this.speed;
      }
      if (this.posY >= 420 - this.height) {
        this.direction = "up";
      }
      if (this.posY <= 255 - this.height) {
        this.direction = "down";
      }
    }

    checkCollision(icon) {
      return !(
        this.top() > icon.bottom() ||
        this.bottom() < icon.top() ||
        this.left() > icon.right() ||
        this.right() < icon.left()
      );
    }
  }

  // INSTANCE OF ICONS
  const car = new Icons("/images/marioKart.png", 50, 330, 32, 30, 10);
  const iconTurtle = new Icons(
    "/images/RedShellMK8.png",
    200,
    250,
    25,
    20,
    0.8
  );
  const iconOldMan = new Icons("/images/old-man2.png", 320, 230, 35, 30, 1);
  const iconDinoFanho = new Icons("/images/dinoFanho.png", 436, 230, 35, 35, 2);
  const iconRedShell = new Icons("/images/turtle2.png", 559, 230, 25, 20, 2.2);
  const timerIcon = new Icons("/images/timer.png", 270, 6, 26,26 )
  const icons = [iconTurtle, iconOldMan, iconDinoFanho, iconRedShell];
  
  // FUNCTION COLLISION
  function collision() {
    for (let icon of icons) {
      if (car.checkCollision(icon)) {
        setTimeout(newSound.crashSound, 1000);
        return true;
      }
    }
  }
  // FUNCTION RESET GAME
  function resetGame() {
    car.posX = 50;
    car.posY = 330;
    timeLeft = 35;
  }

  // FUNCTION STOPGAME
  function stopGame() {
    cancelAnimationFrame(animationId);
    clearInterval(intervalId);
    marioKartTheme.pause();
    marioKartTheme.currentTime = 0;
  }
  // FUNCTION CHECKGAMEOVER
  function checkGameOver() {
    if (!collision() && timeLeft > 0) {
      animationId = requestAnimationFrame(updateCanvas);
    } else {
      newScreen.gameOver();
      gameOverAudio.play();
      setTimeout(unHideButton, 2800)
      stopGame();
      resetGame();
      
    }
  }

  // FUNCTION CHECK GAME FINISH
  function checkFinishGame() {
    if (car.right() >= canvasArea.canvas.width) {
      
      stopGame();
      newScreen.winScren();
      setTimeout(unHideButton, 2000);
      setTimeout(resetGame, 1000);
    }
  }

  // SCREENS THE GAME
  class Screens {
    gameOver() {
      const img = new Image();
      img.src = "/images/finalGameOverScreen.PNG";
      img.onload = () =>
        canvasArea.ctx.drawImage(
          img,
          0,
          0,
          canvasArea.canvas.width,
          canvasArea.canvas.height
        );
    }

    winScren() {
      youWinAudio.play();
      const img = new Image();
      img.src = "/images/winScreen.jpg";
      img.onload = function () {
        canvasArea.ctx.drawImage(
          img,
          0,
          0,
          canvasArea.canvas.width,
          canvasArea.canvas.height
        );
        canvasArea.ctx.fillStyle = "white";
        canvasArea.ctx.font = "20px Games";
        canvasArea.ctx.textAlign = "center";
        canvasArea.ctx.fillText(
          `CONGRATULATIONS, YOU SCORE IS ${timeLeft}`,
          320,
          80
        );
      };
    }
  }

  const newScreen = new Screens();

  // SOUNDS GAME
  class Sounds {
    crashSound() {
      const audio = new Audio();
      audio.src = "/sounds/carCrash.mp3";
      audio.play();
    }
  }
  const newSound = new Sounds();
  

  // SOUNDS OUTSIDE THE INSTANCES
  const marioKartTheme = new Audio("/sounds/marioKartTheme.mp3");
  marioKartTheme.volume = 0.2
  const gameOverAudio = new Audio("/sounds/atariGameOverBoom.wav");
  gameOverAudio.volume = 0.3
  const youWinAudio = new Audio("/sounds/youWin.mp3");

  // TIME ON THE SCREEN
  let timeLeft = 35;
  function showTime() {
    canvasArea.ctx.fillStyle = "gray";
    canvasArea.ctx.font = "25px Games";
    canvasArea.ctx.fillText(timeLeft, 300, 30);
  }

  let intervalId = null;

  // COUNTDOWN FUNCTION
  function countDown() {
    intervalId = setInterval(function () {
      timeLeft -= 1;
    }, 1000);
  }
};
