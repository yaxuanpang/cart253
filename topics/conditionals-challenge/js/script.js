/**
 * Puck
 * Yaxuan, ashmitha, Nerly
 * 
 *  This will be a program in which the user can push a circle
 * on the canvas using their own circle.
 */

"use strict";

const puck = {
    x: 200,
    y: 200,
    size: 100,
    fill: "#ff0000"
};

const user = {
    x: undefined, // will be mouseX
    y: undefined, // will be mouseY
    size: 75,
    fill: "#000000"
};


/**
 * Create canvas
*/
function setup() {
    createCanvas(400, 400);
}


/**
 * We draw a puck
*/
function draw() {
    background("#aaaaaa");

    // Move user circle
    moveUser();

    // Draw the user and puck
    drawPuck();
    drawUser();

}

/**
 * Sets the user position to the mouse position
 */
function moveUser() {
    user.x = mouseX;
    user.y = mouseY;
}

// Displays the puck circle
function drawPuck() {
    push();
    noStroke();
    fill(puck.fill);
    ellipse(puck.x, puck.y, puck.size);
    pop()
}

/**
 * Displays the user circle
 */
function drawUser() {
    push();
    noStroke();
    fill(user.fill);
    ellipse(user.x, user.y, user.size);
    pop();
}