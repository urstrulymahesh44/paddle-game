"use strict";

defineGame("Paddle", "My Name", "H", undefined, undefined, 
    undefined, undefined, undefined, 60, "arcade");

gamepadArray[0].left.gamePurpose  = "Left";
gamepadArray[0].right.gamePurpose = "Right";

// Leave the background a little transparent so that the ball
// leaves a glowing trail
var BACKGROUND_COLOR = makeColor(0.1, 0.2, 0.2, 0.7);

var PADDLE_SPEED     = 1000; // pixels per second
var PADDLE_COLOR     = makeColor(0.2, 1.0, 1.0);

var BALL_COLOR       = makeColor(1.0, 1.0, 0.3);

var ball;
var paddle;

function onInit() {
//    setUIMode(UIMode.PLAYING);
}

function onGameStart() {
    ball = {
        // in pixels
        position:     {x: screenWidth / 2, 
                       y: screenHeight / 2},
        radius:       30,

        // pixels/second
        velocity:     {x: +500,
                       y: -500}};

    paddle = {
        position:     {x: screenWidth / 2,
                       y: screenHeight - 200},
        width:        100,
        height:       20};
}


function onSimulation() {
    var time = 1.0 / 60.0;

    // Move the paddle
    paddle.position.x += PADDLE_SPEED * time * gamepadArray[0].currentDirection().x;

    // Restrict the paddle to the screen
    paddle.position.x = clamp(paddle.position.x, paddle.width / 2, screenWidth - paddle.width / 2);

    // Move the ball
    ball.position.x = ball.position.x + ball.velocity.x * time;
    ball.position.y = ball.position.y + ball.velocity.y * time;

    // Bounce off walls if the ball is overlapped with a wall AND it
    // is still moving in that direction.  If we don't test the velocity,
    // we could get stuck bouncing back and forth inside of a wall.
    if (((ball.position.x < ball.radius) && (ball.velocity.x < 0)) ||
        ((ball.position.x > screenWidth - ball.radius) && (ball.velocity.x > 0))) {
        ball.velocity.x = -ball.velocity.x;
    }

    if (((ball.position.y < ball.radius) && (ball.velocity.y < 0)) ||
        ((ball.position.y > screenHeight - ball.radius) && (ball.velocity.y > 0))) {
        ball.velocity.y = -ball.velocity.y;
    }

    // Bounce the ball off the paddle if it is overlapped AND moving down on the screen.
    if ((abs(ball.position.x - paddle.position.x) <= ball.radius + paddle.width / 2) &&
        (abs(ball.position.y - paddle.position.y) <= ball.radius + paddle.height / 2) &&
        (ball.velocity.y > 0)) {
        ball.velocity.y = -ball.velocity.y;
    }
}

function onGameDraw() {
    // Draw background
    fillRectangle(0, 0, screenWidth, screenHeight, BACKGROUND_COLOR);

    // Draw the ball
    fillCircle(ball.position.x, ball.position.y, ball.radius, BALL_COLOR);

    // Draw the paddle
    fillRectangle(paddle.position.x - paddle.width / 2, paddle.position.y - paddle.height / 2, 
                  paddle.width, paddle.height, PADDLE_COLOR);
}
