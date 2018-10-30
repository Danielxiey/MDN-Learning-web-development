var canvas = document.querySelector('canvas');
var ballCount = document.querySelector('p');
var count = 0;
var ctx = canvas.getContext('2d');
width = canvas.width = window.innerWidth;
height = canvas.height = window.innerHeight;

function random(min, max) {
    var num = Math.floor(Math.random() * (max - min)) + min;
    return num;
}

function Shape(x, y, velx, vely, exit) {
    this.x = x;
    this.y = y;
    this.velx = velx;
    this.vely = vely;
    this.exit = exit;
}

function Ball(x, y, velx, vely, color, size) {
    Shape.call(this, x, y, velx, vely, exit);
    this.color = color;
    this.size = size;
}

Ball.prototype = Object.create(Shape.prototype);
Ball.prototype.constructor = Ball;

Ball.prototype.draw = function() {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.fill();
}

Ball.prototype.update = function() {
    if((this.x + this.size) >= width) {
        this.velx = -(this.velx);
    }
    if((this.x - this.size) <= 0) {
        this.velx = -(this.velx);
    }
    if((this.y + this.size) >= height) {
        this.vely = -(this.vely);
    }
    if((this.y - this.size) <= 0) {
        this.vely = -(this.vely);
    }

    this.x += this.velx;
    this.y += this.vely;
}

Ball.prototype.collisionDetect = function() {
    for(var i = 0; i < balls.length; i++) {
        if(this !== balls[i]) {
            var x = Math.abs(this.x - balls[i].x);
            var y = Math.abs(this.y - balls[i].y);
            var distance = Math.sqrt(x * x + y * y);
            if(distance <= (this.size + balls[i].size)) {
                 this.color = balls[i].color = 'rgb(' + random(0, 255) + ',' + random(0, 255) + ',' + random(0, 255) + ')';
            }
        }
    }
}

function EvilCircle(x, y, exit, color, size) {
    Shape.call(this, x, y, 20, 20, exit);
    this.color = color;
    this.size = size;
}

EvilCircle.prototype = Object.create(Shape.prototype);
EvilCircle.prototype.constructor = EvilCircle;

EvilCircle.prototype.draw = function() {
    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.strokeStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.stroke();
}

EvilCircle.prototype.checkBounds = function() {
    if((this.x + this.size) >= width) {
        this.x -= this.size;
    }
    if((this.x - this.size) <= 0) {
        this.x += this.size;
    }
    if((this.y + this.size) >= height) {
        this.y -= this.size;
    }
    if((this.y - this.size) <= 0) {
        this.y += this.size;
    }
}

EvilCircle.prototype.setControls = function() {
    var _this = this;                   //将外部函数的this传给_this保存，方便内部函数读取
    window.onkeydown = function (e) {
        if (e.keyCode === 65) {
            _this.x -= _this.velx;
        } else if (e.keyCode === 68) {
            _this.x += _this.velx;
            console.log(x);
        } else if (e.keyCode === 87) {
            _this.y -= _this.vely;
        } else if (e.keyCode === 83) {
            _this.y += _this.vely;
        }
    }
}

EvilCircle.prototype.collisionDetect = function() {
    for(var i = 0; i < balls.length; i++) {
        if(balls[i].exit == true) {
            var x = Math.abs(this.x - balls[i].x);
            var y = Math.abs(this.y - balls[i].y);
            var distance = Math.sqrt(x * x + y * y);
            if(distance <= (this.size + balls[i].size) && balls[i].exit == true) {
                 balls[i].exit = false;
                 count--;
                 ballCount.innerHTML = 'Ball count: ' + count;
            }
        }
    }
}


var balls = [];
for(var i = 0; i < 100; i++) {
    var x = random(0, width);
    var y = random(0, height);
    var velx = random(-7, 7);
    var vely = random(-7, 7);
    var color = 'rgb(' + random(0, 255) + ',' + random(0, 255) + ',' + random(0, 255) + ')';
    var size = random(10, 20);
    var exit = true;
    var newBall = new Ball(x, y, velx, vely, color, size, exit);
    balls.push(newBall);
    count++;
}
ballCount.innerHTML = 'Ball count: ' + count;

var evil = new EvilCircle(50, 50, true, 'white', 10);
evil.setControls();

function loop() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.rect(0, 0, width, height);
    ctx.fill();
    for(var i = 0; i < balls.length; i++) {
        if(balls[i].exit == true) {
            balls[i].draw();
            balls[i].update();
            balls[i].collisionDetect();
        }
    }

    evil.draw();
    evil.checkBounds();
    evil.collisionDetect();

    requestAnimationFrame(loop);
}

loop();