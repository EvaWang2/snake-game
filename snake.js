const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');

const BLOCK_SIZE = 20;
const GAME_SPEED = 100;

// 游戏状态
let snake = {
    body: [{x: 400, y: 300}],
    direction: {x: 0, y: 0},
    newDirection: {x: 0, y: 0},
    length: 1,
    score: 0
};

let food = {
    x: 0,
    y: 0
};

// 生成随机食物位置
function generateFood() {
    food.x = Math.floor(Math.random() * (canvas.width / BLOCK_SIZE)) * BLOCK_SIZE;
    food.y = Math.floor(Math.random() * (canvas.height / BLOCK_SIZE)) * BLOCK_SIZE;
}

// 画蛇
function drawSnake() {
    ctx.fillStyle = '#00ff00';
    snake.body.forEach(segment => {
        ctx.fillRect(segment.x, segment.y, BLOCK_SIZE - 2, BLOCK_SIZE - 2);
    });
}

// 画食物
function drawFood() {
    ctx.fillStyle = '#ff0000';
    ctx.fillRect(food.x, food.y, BLOCK_SIZE - 2, BLOCK_SIZE - 2);
}

// 更新游戏状态
function update() {
    // 更新蛇的方向
    snake.direction = snake.newDirection;

    // 计算新的头部位置
    const head = {
        x: snake.body[0].x + snake.direction.x * BLOCK_SIZE,
        y: snake.body[0].y + snake.direction.y * BLOCK_SIZE
    };

    // 检查是否撞墙
    if (head.x < 0) head.x = canvas.width - BLOCK_SIZE;
    if (head.x >= canvas.width) head.x = 0;
    if (head.y < 0) head.y = canvas.height - BLOCK_SIZE;
    if (head.y >= canvas.height) head.y = 0;

    // 检查是否吃到自己
    if (snake.body.some(segment => segment.x === head.x && segment.y === head.y)) {
        resetGame();
        return;
    }

    // 添加新的头部
    snake.body.unshift(head);

    // 检查是否吃到食物
    if (head.x === food.x && head.y === food.y) {
        snake.score += 1;
        scoreElement.textContent = `分数: ${snake.score}`;
        generateFood();
    } else {
        snake.body.pop();
    }
}

// 游戏主循环
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    update();
    drawFood();
    drawSnake();
}

// 重置游戏
function resetGame() {
    snake = {
        body: [{x: 400, y: 300}],
        direction: {x: 0, y: 0},
        newDirection: {x: 0, y: 0},
        length: 1,
        score: 0
    };
    scoreElement.textContent = '分数: 0';
    generateFood();
}

// 键盘控制
document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowUp':
            if (snake.direction.y !== 1) {
                snake.newDirection = {x: 0, y: -1};
            }
            break;
        case 'ArrowDown':
            if (snake.direction.y !== -1) {
                snake.newDirection = {x: 0, y: 1};
            }
            break;
        case 'ArrowLeft':
            if (snake.direction.x !== 1) {
                snake.newDirection = {x: -1, y: 0};
            }
            break;
        case 'ArrowRight':
            if (snake.direction.x !== -1) {
                snake.newDirection = {x: 1, y: 0};
            }
            break;
    }
});

// 开始游戏
generateFood();
setInterval(gameLoop, GAME_SPEED); 