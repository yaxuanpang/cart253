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
    fill: "#ff0000", // red to start
    fills: {
        noOverlap: "#ed15b4", // red for no overlap
        overlap: "#000000", //green for overlap
    }
};

const target = {
    x: 30,
    y: 300,
    size: 50,
    fill: "#ffffffff",
    fills: {
        overlap: "#000000",
    }


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

    // Draw the user and puck and target
    drawPuck();
    drawUser();
    //  MovePuck();
    drawTarget();
    movePuck();

    function movePuck() {
        const d = dist(user.x, user.y, puck.x, puck.y);
        const overlap = (d < user.size / 2);
        if (overlap) {
            user.fill = puck.fills.overlap;

            if (overlap && user.x < (puck.x)) {
                puck.x += 10;
            }

            if (overlap && user.y < (puck.y)) {
                puck.y += 10;
            }

            if (overlap && user.x > (puck.x)) {
                puck.x -= 10;
            }

            if (overlap && user.y > (puck.y)) {
                puck.y -= 10;
            }

        }
        else {
            user.fill = puck.fills.noOverlap;
        }



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

    function drawTarget() {
        push();
        noStroke();
        fill(target.fill);
        ellipse(target.x, target.y, target.size);
        pop();

    }

    function checkTarget() {


    }

}