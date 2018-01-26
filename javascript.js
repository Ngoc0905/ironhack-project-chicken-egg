var audio = new Audio();
audio.src = './images/musicbackground.mp3';

window.onload = function () {
    var canvas = document.getElementById("canvas");
    canvas.style.display = 'none';
    document.getElementById("start-button").onclick = function () {
        
        document.getElementById("main").style.display = 'none';
        canvas.style.display = 'block';
        canvas.addEventListener('mousemove', canvasMouseMove, false);

        function canvasMouseMove(evt) {
            var rectangle = canvas.getBoundingClientRect();
            var x = evt.clientX - rectangle.left;
            if (x > canvas.width - player.width) {
                x = canvas.width - player.width;
            }
            player.x = x;
        }

        var ctx = canvas.getContext('2d');
        var img = new Image();
        img.src = "./images/bg.web.png";
        var imgNest = new Image();
        imgNest.src = "./images/nest.png";
        var imgWhiteEgg = new Image();
        imgWhiteEgg.src = "./images/whiteegg.png";
        var imgGoldEgg = new Image();
        imgGoldEgg.src = "./images/goldegg.png";
        var imgBlackEgg = new Image();
        imgBlackEgg.src = "./images/blackEgg.png";
        var imgChicken = new Image();
        imgChicken.src = "./images/chicken1.png";
        var imgChicken2 = new Image();
        imgChicken2.src = './images/chicken2.png';
        var backgroundImage = {
            img: img,
            x: 0,
            draw: function () {
                ctx.drawImage(this.img, this.x, 0);
            },
            drawChicken: function () {
                var chickenX = canvas.width / 6;
                var chickenY = 80;
                var chicken = [
                    true,
                    true,
                    true,
                    true,
                    true
                ];

                egg.eggs.forEach(function (e) {
                    if (e.y >= 150 && e.y < 200) {
                        chicken[e.position - 1] = false;
                    }
                });

                chicken.forEach(function (p, index) {
                    var img = p ? imgChicken : imgChicken2;
                    ctx.drawImage(img, (index + 1) * chickenX - 40, chickenY);
                });
            }
        };

        var player = {
            x: canvas.width / 2,
            y: canvas.height,
            width: 130,
            height: 86,
            speed: 5,
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
                ctx.fillStyle = 'green';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.font = '40px serif';
                ctx.fillStyle = 'red';
                ctx.fillText('Game Over!', 300, 200);
                ctx.fillStyle = 'white';
                ctx.fillText('Your final score: ' + this.score, 270, 300);
            },
            restartGame: function () {
                setTimeout(function () {
                    document.getElementById('canvas').style.display = 'none';
                    document.getElementById('main').style.display = 'flex';
                    canvas.removeEventListener('mousemove', canvasMouseMove, false);
                }, 2000);
            },
            gameOver: function () {
                this.clear();
                this.drawFinalPoints();
                audio.pause();
                this.restartGame();
            }
        };
        var egg = { // eggConstructor
            eggs: [],
            minSpeed: 1.5,
            gravity: 0.5,
            eggId: 0,
            width: 20,
            height: 20,
            y: 150,
            createEgg: function () {
                var randomPosition = Math.floor(Math.random() * 5) + 1;

                var eggColors = ['WhiteEgg', 'GoldEgg', 'BlackEgg'];
                var possibilities = [0, 0, 0, 0, 0, 0, 1, 1, 2, 2];
                var randomPossibility = Math.floor(Math.random() * possibilities.length);
                this.eggs.push({
                    id: this.eggId++,
                    position: randomPosition,
                    color: eggColors[possibilities[randomPossibility]],
                    x: randomPosition * canvas.width / 6,
                    y: this.y,
                    w: this.width,
                    h: this.height,
                    minSpeed: this.minSpeed
                });
            },
            draw: function () {
                this.eggs.forEach(function (e) {
                    if (egg.y === canvas.width) {
                        ctx.drawImage(imgGoldEgg, e.x, e.y);
                    } else if (e.color === "GoldEgg") {
                        ctx.drawImage(imgGoldEgg, e.x, e.y);
                    } else if (e.color === "BlackEgg") {
                        ctx.drawImage(imgBlackEgg, e.x, e.y);
                    } else {
                        ctx.drawImage(imgWhiteEgg, e.x, e.y);
                    }

                });
            },
            moveEgg: function (egg) {
                egg.y += egg.minSpeed;
                if (egg.y >= canvas.height - (player.height / 2) - egg.h)
                    this.check(egg);
            },
            move: function () {
                this.eggs.forEach(this.moveEgg.bind(this));
            },
            check: function (egg) {
                //miss or caught
                var caught = player.x + 15 <= egg.x && egg.x <= player.x + player.width - egg.w - 15;
                if (caught) {
                    if (egg.color === "WhiteEgg") {
                        player.score++;
                    } else if (egg.color === "GoldEgg") {
                        player.score += 3;
                    } else if (egg.color === "BlackEgg") {
                        player.score--;
                        if (player.score < 0) {
                            player.isGameOver = true;
                            return 'Game over';
                        }
                    }
                } else {
                    if (egg.color !== 'BlackEgg') {
                        player.brokenEggs--;
                        if (player.brokenEggs <= 0) {
                            player.isGameOver = true;
                            return 'Game over';
                        }
                    }
                }

                for (let i = 0; i < this.eggs.length; i++) {
                    if (this.eggs[i].id === egg.id) {
                        this.eggs.splice(i, 1);
                        break;
                    }
                }
            }


        };
        var keysPressed = {
            left: false,
            right: false,
        };
        var intervalSpeed = setInterval(function () {
            egg.minSpeed += 0.5;
        }, 8000);
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
            
            backgroundImage.draw();
            player.drawScore();
            backgroundImage.drawChicken();
            player.draw();
            egg.draw();
            egg.move();
            player.drawEggBroken();
            audio.play();

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