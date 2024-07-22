class Ghost {
    constructor(x,
                y,
                width,
                height,
                speed,
                imageX,
                imageY,
                imageWidth,
                imageHeight,
                range
            ) {
                this.x = x;
                this.y = y;
                this.width = width;
                this.height = height;
                this.speed = speed;
                this.direction = direction_right;
                this.imageX = imageX;
                this.imageY = imageY;
                this.imageHeight = imageHeight;
                this.imageWidth = imageWidth;
                this.range = range;
                this.randomTargetIndex = parseInt(Math.random() * randomTargetForGhosts.length);

                setInterval(() => {
                    this.changeRandomDirection();
                }, 10000);
    }

    changeRandomDirection() {
        let addition = 1;
        this.randomTargetIndex += addition;
        this.randomTargetIndex = this.randomTargetIndex % 4;
    }

    moveProcess() {
        if (this.isInRangedOfPacman()) {
            target = pacman;
        } else {
            this.target = randomTargetForGhosts[this.randomTargetInxed];
        }
        this.changeDirectionIfPossible();
        this.moveForward();
        if (this.checkCollision()) {
            this.moveBackwards();
        }
    }

    moveBackwards() {
        switch(this.direction) {
            case direction_right:
                this.x -= this.speed;
                break;
            case direction_up:
                this.y += this.speed;
                break;
            case direction_left:
                this.x += this.speed;
                break;
            case direction_bottom:
                this.y -= this.speed;
                break;
        }
    }

    moveForward() {
        switch(this.direction) {
            case 4: //direction_right:
                this.x += this.speed;
                break;
            case 3: //direction_up:
                this.y -= this.speed;
                break;
            case 2: //direction_left:
                this.x -= this.speed;
                break;
            case 1: //direction_bottom:
                this.y += this.speed;
                break;
        }
    }

    checkCollision() {
        if (
            map[this.getMapY()][this.getMapX()] == 1 ||
            map[this.getMapYRight()][this.getMapX()] == 1 ||
            map[this.getMapY()][this.getMapXRight()] == 1 ||
            map[this.getMapYRight()][this.getMapXRight()] == 1
        ) {
            return true;
        }
        return false;
    }

    isInRangedOfPacman() {
        let xDistance = Math.abs(pacman.getMapX() - this.getMapX());
        let yDistance = Math.abs(pacman.getMapY() - this.getMapY());
        if (Math.sqrt(xDistance * xDistance + yDistance * yDistance) <= this.range) {
            return true;
        }
        return false;
    }

    changeDirectionIfPossible() {
        let tempDirection = this.direction;

        this.direction = this.calculateNewDirection(
            map,
            parseInt(this.target.x / oneBlockSize),
            parseInt(this.target.y / oneBlockSize)
        );

        if (typeof this.direction == 'undefined') {
            this.direction = tempDirection;
            return;
        }

        this.moveForward();

        if (this.checkCollision()) {
            this.moveBackwards();
            this.direction = tempDirection;
        } else {
            this.moveBackwards();
        }
    }

    calculateNewDirection() {
        let mp = []

        for (let i = 0; i < map.length; i++) {
            mp[i] = map[i].slice()
        }

        let queue = [{
            x: this.getMapX(),
            y: this.getMapY(),
            moves: []
        }]

        while (queue.length > 0) {
            let poped = queue.shift()
            if (poped.x == destX && poped.y == destY) {
                return poped.moves[0]
            } else {
                mp[poped.y][poped.x] = 1
                let neighborList = this.addNeighbors(poped, mp);
                for (let i = 0; i < neighborList.length; i++) {
                    queue.push(neighborList[i]);
                }
            }
        }
        return direction_up // default value

    }

    addNeighbors(poped, mp) {
        let queue = []
        let numOfRows = mp.length
        let numOfColumns = mp[0].length

        if (poped.x - 1 >= 0 && poped.x - 1 < numOfRows && mp[poped.y][poped.x - 1] != 1) {
            let tempMoves = poped.moves.slice()
            tempMoves.push(direction_left)
            queue.push({x: poped.x - 1, y: poped.y, moves: tempMoves})
        }
        if (poped.x + 1 >= 0 && poped.x + 1 < numOfRows && mp[poped.y][poped.x + 1] != 1) {
            let tempMoves = poped.moves.slice()
            tempMoves.push(direction_right)
            queue.push({x: poped.x + 1, y: poped.y, moves: tempMoves})
        }
        if (poped.y - 1 >= 0 && poped.y - 1 < numOfRows && mp[poped.y - 1][poped.x] != 1) {
            let tempMoves = poped.moves.slice()
            tempMoves.push(direction_up)
            queue.push({x: poped.x, y: poped.y - 1, moves: tempMoves})
        }
        if (poped.y + 1 >= 0 && poped.y + 1 < numOfRows && mp[poped.y + 1][poped.x] != 1) {
            let tempMoves = poped.moves.slice()
            tempMoves.push(direction_bottom)
            queue.push({x: poped.x, y: poped.y + 1, moves: tempMoves})
        }
        return queue;      
    }

    changeAnimation() {
        this.currentFrame =
            this.currentFrame == this.frameCount ? 1: this.currentFrame + 1;
    }

    draw() {
        canvasContext.save();
        canvasContext.drawImage(
            ghostFrames,
            this.imageX,
            this.imageY,
            this.imageWidth,
            this.imageHeight,
            this.x,
            this.y,
            this.width,
            this.height
        );

        canvasContext.restore();
    }

    getMapX() {
        return parseInt(this.x / oneBlockSize);
    }

    getMapY() {
        return parseInt(this.y / oneBlockSize);
    }

    getMapXRight() {
        return parseInt((this.x + 0.9999 * oneBlockSize) / oneBlockSize);
    }

    getMapYRight() {
        return parseInt((this.y + 0.9999 * oneBlockSize) / oneBlockSize);
    }
}
