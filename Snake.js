// Modified from tutorial by M. Andres Pagella <andres.pagella at gmail dot com>
//
var bey = new Image();
var grammy = new Image();
bey.src ='Public/img/beyhead.jpg'
grammy.src = 'Public/img/grammy.png';

document.getElementById('score').appendChild(document.createTextNode('Score: 0 - Level 0'));

var cnvs = document.getElementById('canvas'),
canvas = document.createElement('canvas');
canvas.setAttribute('class', 'col-lg-offset-2 img-responsive');

var ctx = canvas.getContext('2d'),
boardSize = 70,
snake = new Array(5),
direction = 0,
speed = 100, 
score = 0,
level = 0,
pause = true,
finished = false;

//Note: "num" to px need to multiple by 10 

// Initialize the matrix/board.
var map = new Array(boardSize);
for (var i = 0; i < map.length; i++) {
    map[i] = new Array(boardSize);
}

//add canvas to Body of html file
var body = document.getElementById('game');
body.appendChild(canvas);


window.addEventListener('keydown', function(e) {
    var key = e.which;
    switch(key){
        case 13:
            active = true;
            playLoop();
            break;
        case 32:
            pauseGame();
            break;
        case 37:
            if (direction !== 0) direction = 1; // Left
             break;
        case 38:
            if (direction !== 3) direction = 2; // Up
            break;
        case 39:
            if (direction !== 1) direction = 0; // Right
            break;
        case 40:
            if (direction !== 2) direction = 3; // Down
            break;
    }
});

window.onload = function(){
    //Create snake and food
    map = generateSnake(map);
    map = generateFood(map);

    startGame();
}

function startGame(){
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Traverse all the body pieces of the snake, starting from the last one
    for (var i = snake.length - 1; i >= 0; i--) {

        // collision detection based on snake head
        if (i === 0) {
            switch(direction) {
                case 0: // Right
                    snake[0] = { x: snake[0].x + 1, y: snake[0].y }
                    break;
                case 1: // Left
                    snake[0] = { x: snake[0].x - 1, y: snake[0].y }
                    break;
                case 2: // Up
                    snake[0] = { x: snake[0].x, y: snake[0].y - 1 }
                    break;
                case 3: // Down
                    snake[0] = { x: snake[0].x, y: snake[0].y + 1 }
                    break;
            }

            // check if snake is out of bound
            if (snake[0].x < 0 || snake[0].x >= boardSize - 8||
                snake[0].y < 0 || snake[0].y >= boardSize - 7) {
                showGameOver();
                return;
            }

            //updates if snake eats food
            if (map[snake[0].x][snake[0].y] === 1) {
                updateScore()
            }
            // check for body collision
            else if (map[snake[0].x][snake[0].y] === 2) {
                showGameOver();
                return;
            }

            map[snake[0].x][snake[0].y] = 2;

        } else {

            //update snake positions to remove end of snake
            if (i === (snake.length - 1)) {
                map[snake[i].x][snake[i].y] = null;
            }

            snake[i] = { x: snake[i - 1].x, y: snake[i - 1].y };
            map[snake[i].x][snake[i].y] = 2;
        }
    }

    drawMain();

    //populate board with snake and food
    for (var x = 0; x < map.length; x++) {
        for (var y = 0; y < map[0].length; y++) {
            if (map[x][y] === 1) {
                ctx.drawImage(grammy,x*10,y*10, 22, 22);
            } else if (map[x][y] === 2) {
                ctx.drawImage(bey,x*10,y*10, 22, 22); 
            }
        }
    }  
    
    playLoop();
}
    
function generateFood(map){
    // Generate a random position for the rows and the columns.
    rn = boardSize-15;
    var randX = Math.round(Math.random() * rn),
        randY = Math.round(Math.random() * rn);

    //avoid placing food on snake       
    while (map[randX][randY] === 2) {
        randX = Math.round(Math.random() * rn);
        randY = Math.round(Math.random() * rn);
    }

    map[randX][randY] = 1;

    return map;
}

function generateSnake(map){
    // Generate a random position for snake head.
    var randX = Math.round(Math.random() * 19),
        randY = Math.round(Math.random() * 19);

    while ((randX - snake.length) < 0) {
        randX = Math.round(Math.random() * 19);
    }

    for (var i = 0; i < snake.length; i++) {
        snake[i] = { x: randX - i, y: randY };
        map[randX - i][randY] = 2;
    } 
    active = false;
    return map;
}

function drawMain() {
    //game area
    canvas.width = 614;
    canvas.height = 634;
    ctx.fillStyle = 'pink';
    ctx.fillRect(0, 10, canvas.width, canvas.height);
}

function playLoop(){        
    //starts game loop
    if (active) { 
        if (level < 5){
            game = setTimeout(startGame, speed - (level * 10));
        } else {
            game = setTimeout(startGame, 40);
        }
    }   
}

function updateScore(){
    //update score and add new food
    score += 5;
    map = generateFood(map);

    // Add a new body piece to the array 
    snake.push({ x: snake[snake.length - 1].x, y: snake[snake.length - 1].y });
    map[snake[snake.length - 1].x][snake[snake.length - 1].y] = 2;

    // speed up game based on level
    if ((score % 5) == 0) {
        level += 1;
    }    
    var currScore = document.createTextNode('Score: ' + score + ' - Level: ' + level);
    var scoreInfo = document.getElementById('score');
    scoreInfo.replaceChild(currScore, scoreInfo.childNodes[0]);
}

function pauseGame() {
    if (!pause){
        playLoop();
        pause = true;
    }
    else if(pause){
        game = clearTimeout(game);
        pause = false;
    }
   // allowedPressKeys = true;
}

function showGameOver(){
    // Disable the game.
    active = false;
    finished = true;
    // Clear the canvas
    ctx.fillStyle = 'pink';
    ctx.fillRect(0, 10, canvas.width, canvas.height);

    ctx.fillStyle = 'white';
    ctx.font = '40px impact';

    ctx.fillText('Game Over!', ((canvas.width / 2) - (ctx.measureText('Game Over!').width / 2)), canvas.height/2 - 100);
    ctx.font = '42px impact';
    ctx.fillText('Your Score Was: ' + score, ((canvas.width / 2) - (ctx.measureText('Your Score Was: ' + score).width / 2)), canvas.height/2 - 50);

    if (finished){ 
        document.getElementById('score').setAttribute('class', 'hidden');      
        document.getElementById('restart').removeAttribute('class', 'hidden');   
    }
}

//restart
function restart(){
    console.log('finished');
    window.location.reload(); 
}