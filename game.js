const canvas = document.getElementById('canvas');
const canvasContext = canvas.getContext('2d');

const pacmanFrames = document.getElementById('animation');
const ghostFrames = document.getElementById('ghosts');

let createRect = (x, y, width, height, color) => {
    canvasContext.fillStyle = color
    canvasContext.fillRect(x, y, width, height);
}

// game
let fps = 120;
let oneBlockSize = 20;
let wallColor = '#342DCA';
let wallSpaceWidth = oneBlockSize / 1.6;
let wallOffset = (oneBlockSize - wallSpaceWidth) / 2;
let wallInnerColor = 'black';
let foodColor = '#FEB897';
let score = 0;

// movement
const direction_right = 4;
const direction_up = 3;
const direction_left = 2;
const direction_bottom = 1;

// ghosts
let ghosts = [];
let ghostCount = 4;
let ghostLocations = [
    {x:0, y:0},
    {x:176, y:0},
    {x:0, y:121},
    {x:176, y:121}
]

let map = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1],
    [1, 1, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 2, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 1, 1, 1, 1, 2, 1, 2, 1, 2, 2, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1],
    [1, 1, 1, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 2, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

let randomTargetForGhosts = [
    {x: 1 * oneBlockSize, y: 1 * oneBlockSize},
    {x: 1 * oneBlockSize, y: (map.length - 2) * oneBlockSize},
    {x: (map[0].length - 2) * oneBlockSize, y: oneBlockSize},
    {x: (map[0].length - 2) * oneBlockSize, y: (map.length - 2) * oneBlockSize}
]

let gameLoop = () => {
    update();
    draw();
};

let update = () => {
    pacman.moveProcess();
    pacman.eat();
    for (let i = 0; i < ghosts.length; i++) {
        ghosts[i].moveProcess();
    }
};

let drawFoods = () => {
    for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map[0].length; j++) {
            if (map[i][j] == 2) {
                createRect(j * oneBlockSize + oneBlockSize / 3,
                           i * oneBlockSize + oneBlockSize / 3,
                           oneBlockSize / 3,
                           oneBlockSize / 3,
                           foodColor
                        );
            }
        }
    }
}

let drawScore = () => {
    canvasContext.font = '25px Emulogic';
    canvasContext.fillStyle = 'white';
    canvasContext.fillText(
        'Score: ' + score,
        0,
        oneBlockSize * (map.length + 1) + 10
        );
}

let drawGhosts = () => {
    for (let i = 0; i < ghosts.length; i++) {
        ghosts[i].draw();
    }
}

let draw = () => {
    createRect(0, 0, canvas.width, canvas.height, 'black');
    drawWalls();
    drawFoods();
    drawGhosts();
    pacman.draw();
    drawScore();
};

let gameInterval = setInterval(gameLoop, 1000 / fps);

let drawWalls = () => {
    for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map[0].length; j++) {
            if (map[i][j] == 1) { // it´s a wall
                createRect(
                    j * oneBlockSize,
                    i * oneBlockSize,
                    oneBlockSize,
                    oneBlockSize,
                    wallColor
                    );
                    if (j > 0 && map[i][j - 1] == 1) {
                        createRect(
                            j * oneBlockSize,
                            i * oneBlockSize + wallOffset,
                            wallSpaceWidth + wallOffset,
                            wallSpaceWidth,
                            wallInnerColor
                        );
                    }
                    if (j < map[0].length - 1 && map[i][j + 1] == 1) {
                        createRect(
                            j * oneBlockSize + wallOffset,
                            i * oneBlockSize + wallOffset,
                            wallSpaceWidth + wallOffset,
                            wallSpaceWidth,
                            wallInnerColor
                        );
                    }
                    if (i > 0 && map[i - 1][j] == 1) {
                        createRect(
                            j * oneBlockSize + wallOffset,
                            i * oneBlockSize,
                            wallSpaceWidth,
                            wallSpaceWidth + wallOffset,
                            wallInnerColor
                        );
                    }
                    if (i < map.length - 1 && map[i + 1][j] == 1) {
                        createRect(
                            j * oneBlockSize + wallOffset,
                            i * oneBlockSize + wallOffset,
                            wallSpaceWidth,
                            wallSpaceWidth + wallOffset,
                            wallInnerColor
                        );
                    }
            }
        }
    }
};

let createNewPacman = () => {
    pacman = new Pacman(
        oneBlockSize,
        oneBlockSize,
        oneBlockSize,
        oneBlockSize,
        oneBlockSize / 20
    );
};

let createGhosts = () => {
    ghosts = [];
    for (let i = 0; i < ghostCount * 2; i++) {
        let newGhost = new Ghost(
            9 * oneBlockSize + (i % 2 == 0 ? 0 : 1) * oneBlockSize,
            10 * oneBlockSize + (i % 2 == 0 ? 0 : 1) * oneBlockSize,
            oneBlockSize,
            oneBlockSize,
            pacman.speed / 2,
            ghostLocations[i % 4].x,
            ghostLocations[i % 4].y,
            124,
            116,
            6 + i
        );
        ghosts.push(newGhost);
    }
};

createNewPacman();
createGhosts();
gameLoop();

window.addEventListener('keydown', (event) => {
    let k = event.keyCode

    setTimeout(() => {
        if (k == 37 || k == 65) { // left
            pacman.nextDirection = direction_left
        } else if (k == 38 || k == 87) { // up
            pacman.nextDirection = direction_up
        } else if (k == 39 || k == 68) { // right
            pacman.nextDirection = direction_right
        } else if (k == 40 || k == 83) { // bottom
            pacman.nextDirection = direction_bottom
        }
    }, 1)
})