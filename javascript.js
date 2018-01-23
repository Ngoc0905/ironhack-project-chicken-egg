window.onload = function () {
    var canvas = document.getElementById("canvas");
    canvas.style.display = 'none';
    document.getElementById("start-button").onclick = function () {
        document.getElementById("main").style.display = 'none';
        canvas.style.display = 'block';
        var ctx = canvas.getContext('2d');
        var img = new Image();
        img.src = "./images/bg.web.png";
        var imgNest = new Image();
        imgNest.src = "./images/nest.png";
        var imgWhiteEgg = new Image();
        imgWhiteEgg.src = "./images/whiteegg.png";
        var imgChicken = new Image();
        imgChicken.src = "./images/chicken1.png";
        var imgChicken2 = new Image();
        imgChicken2.srv = './images/chicken2.png';
        var backgroundImage = {
            img: img,
            x: 0,
            draw: function () {
                ctx.drawImage(this.img, this.x, 0);
            },
            drawChicken: function () {
                var chickenX = canvas.width / 6;
                var chickenY = 80;
                ctx.drawImage(imgChicken, chickenX - 40, chickenY);
                ctx.drawImage(imgChicken, 2 * chickenX - 40, chickenY);
                ctx.drawImage(imgChicken, 3 * chickenX - 40, chickenY);
                ctx.drawImage(imgChicken, 4 * chickenX - 40, chickenY);
                ctx.drawImage(imgChicken, 5 * chickenX - 40, chickenY);
            }
        };

        var player = {
            x: canvas.width / 2,
            y: canvas.height,
            width: 130,
            height: 86,
            speed: 4,
            brokenEggs: 5,
            score: 0,
            isGameOver: false,
            move: function (direction) {
                if (direction === 'left') {
                    this.x -= this.speed;
                } else if (direction === 'right') {
                    this.x += this.speed;
                }
                this.x = Math.min(canvas.width - this.width, Math.max(0, this.x));
                this.y = Math.min(canvas.height - this.height, Math.max(0, this.y));
            },
            draw: function () {
                ctx.drawImage(imgNest, this.x, canvas.height - player.height);
            },
            drawScore: function () {
                ctx.font = "40px Pacifico";
                ctx.fillStyle = "red";
                ctx.fillText('Score: ' + this.score, canvas.width / 2, 50);
            },
            drawEggBroken: function () {
                for (let i = 0; i < this.brokenEggs; i++) {
                    ctx.drawImage(imgWhiteEgg, canvas.width / 2 + i * 30 + 200, 20);
                }
            },
            clear: function () {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            },
            drawFinalPoints: function () {
                ctx.fillStyle = 'black';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.font = '38px serif';
                ctx.fillStyle = 'red';
                ctx.fillText('Game Over!', 350, 230);
                ctx.fillStyle = 'white';
                ctx.fillText('Your final score: ' + this.score, 300, 280);
            },
            restartGame: function () {
                setTimeout(function () {
                    document.getElementById('canvas').style.display = 'none';
                    document.getElementById('main').style.display = 'flex';
                }, 1500);
            },
            gameOver: function () {
                this.clear();
                this.drawFinalPoints();
                this.restartGame();
            }
        };
        var egg = {
            eggs: [],
            minSpeed: 2,
            maxSpeed: 5,
            gravity: 0.5,
            eggId: 0,
            width: 20,
            height: 20,
            y: 150,
            createEgg: function () {
                this.eggs.push({
                    id: this.eggId++,
                    x: Math.ceil(Math.random() * 5) * canvas.width / 6,
                    y: this.y,
                    w: this.width,
                    h: this.height,
                    speed: this.minSpeed,
                });
            },
            moveEgg: function (egg) {
                egg.y += egg.speed;
                if (egg.y >= canvas.height - (player.height / 2) - egg.h)
                    this.check(egg);
            },
            check: function (egg) {
                //miss or caught
                var caught = player.x + 20 <= egg.x && egg.x <= player.x + player.width - egg.w - 20;
                if (!caught) {
                    player.brokenEggs--;
                    if (player.brokenEggs <= 0) {
                        player.isGameOver = true;
                        return 'Game over';
                    }
                } else {
                    player.score++;
                }

                for (let i = 0; i < this.eggs.length; i++) {
                    if (this.eggs[i].id === egg.id) {
                        this.eggs.splice(i, 1);
                        break;
                    }
                }
            },
            move: function () {
                this.eggs.forEach(this.moveEgg.bind(this));
            },
            drawRectangle: function (eggs) {
                ctx.drawImage(imgWhiteEgg, eggs.x, eggs.y);
            },
            draw: function () {
                this.eggs.forEach(this.drawRectangle);
            },
        };
        var keysPressed = {
            left: false,
            right: false,
        };

        var interval = setInterval(function () {
            egg.createEgg();
        }, 1000);

        function updateCanvas() {
            if (player.isGameOver) {
                player.gameOver();
                return;
            }

            Object.keys(keysPressed).forEach(function (direction) {
                if (keysPressed[direction]) {
                    player.move(direction);
                }
            });
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            backgroundImage.draw();
            player.drawScore();
            backgroundImage.drawChicken();
            player.draw();
            egg.draw();
            egg.move();
            player.drawEggBroken();
            requestAnimationFrame(updateCanvas);
        }
        img.onload = updateCanvas;

        var LEFT_KEY = 37;
        var RIGHT_KEY = 39;
        document.onkeydown = function (event) {
            switch (event.keyCode) {
                case LEFT_KEY:
                    keysPressed.left = true;
                    break;
                case RIGHT_KEY:
                    keysPressed.right = true;
                    break;
            }
        };
        document.onkeyup = function (event) {
            switch (event.keyCode) {
                case LEFT_KEY:
                    keysPressed.left = false;
                    break;
                case RIGHT_KEY:
                    keysPressed.right = false;
                    break;
            }
        };

        updateCanvas();
    };


};