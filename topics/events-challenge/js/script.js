/**
 * The Only Move Is Not To Play
 * Pippin Barr
 *
 * A game where your score increases so long as you do nothing.
 */

"use strict";

// Current score
let score = 0;

// Is the game over?
let gameOver = false;

/**
 * Create the canvas
 */
function setup() {
    createCanvas(400, 400);
}

/**
 * Update the score and display the UI
 */
function draw() {
    background("#87ceeb");

    center();

    // Only increase the score if the game is not over
    if (!gameOver) {
        // Score increases relatively slowly
        score += 0.05;
    }
    displayUI();




}

/**
 * Show the game over message if needed, and the current score
 */
function displayUI() {
    if (gameOver) {
        push();
        textSize(48);
        textStyle(BOLD);
        textAlign(CENTER, CENTER);
        text("You lose!", width / 2, height / 3);
        pop();
    }
    displayScore();
}

/**
 * Display the score
 */
function displayScore() {
    push();
    textSize(48);
    textStyle(BOLD);
    textAlign(CENTER, CENTER);
    text(floor(score), width / 2, height / 2);
    pop();
}
//function that calls sets gameOver to true, which displays the you lose! text
function lose() {
    gameOver = true;

}
//to check if the "a" or "A" is being pressed
function keyPressed(event) {

    if (event.keyCode === 65) {
        lose();
    }
}

//if the user clicks on the number they lose
function mousePressed() {
    if (mouseX, mouseY, width / 2, height / 2) {
        lose();
    }

}

//creating the circle where we will then check if mouse is being clicked inside
function center() {
    push();
    noStroke();
    fill("#87ceeb");
    circle(width / 2, height / 2, 50);
    pop();
}