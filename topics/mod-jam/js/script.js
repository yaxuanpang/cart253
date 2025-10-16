/**
 * Frogfrogfrog
 * Yaxuan Pang
 * 
 * A game of catching flies with your frog-tongue
 * 
 * Instructions:
 * - Move the frog with your mouse
 * - Click space to launch the tongue
 * - Catch flies
 * 
 * Made with p5
 * https://p5js.org/
 */

"use strict";

//sky color
let r = 135; // red
let g = 207; // green
let b = 235; // blue
let a = 0; //alpha (the opacity)

//change the color of the sky
let change = 0.075;
let night = false;

// Our frog
const frog = {
    // The frog's body has a position and size
    body: {
        x: 320,
        y: 520,
        size: 150
    },
    // The frog's tongue has a position, size, speed, and state
    tongue: {
        x: undefined,
        y: 480,
        size: 20,
        speed: 30,
        // Determines how the tongue moves each frame
        state: "idle" // State can be: idle, outbound, inbound
    }
};

//a bird
//position. size, speed adn movement
const bird = {
    x: 0, // starts at 0
    y: 200, // will be random
    size: 40,
    speed: 2,
};

// Our fly
// Has a position, size, and speed of horizontal movement
const fly = {
    x: 0,
    y: 200, // Will be random
    size: 10,
    speed: 3
};

//faster fly
//position. size, speed adn movement
const fly2 = {
    x: 0,
    y: 200, // Will be random
    size: 10,
    speed: 5 //changed the speed of the second fly
};


/**
 * Creates the canvas and initializes the fly
 */
function setup() {
    createCanvas(700, 500);

    // Give the flies and birds its first random position
    resetFly();
    resetFly2();
    resetBird();
}

function draw() {
    background(r, g, b); // color of the background is light blue at the beginning
    drawNight(); // makes eveyrhting darker
    moveFly(); // moves the fly
    moveFly2(); // moves the second fly
    moveBird(); // moves the bird
    drawFly(); // draws the fly
    drawFly2(); // draws the second fly
    drawBird(); // draws the bird
    moveFrog(); // moves the frog
    moveTongue(); //moves the tongue of the frog
    drawFrog(); // draws the frog
    darkSky(); // makes the sky change colors (from light blue to dark blue)
    checkTongueFlyOverlap(); // tongue overlaps with the fly
    checkTongueFlyOverlap2(); // tongue overlaps with the second fly
}

// changes the color of the sky
function drawNight() {
    if (night) {
        // Nighttime colors
        r -= change; // less red
        g -= change; // less green
        b += change; // more blue

        // limits the green to 85 for the nighttime color
        if (g <= 85) {
            g = 85;
            night = false; // switch back to day
        }
    } else {
        // Daytime colors (the opposite of the nighttime colors)
        r += change;
        g += change;
        b -= change;

        // limits the green to 207 for the daytim color
        if (g >= 207) {
            g = 207;
            night = true; // switch to night
        }
    }
}

/**
 * Moves the fly according to its speed
 * Resets the fly if it gets all the way to the right
 */
function moveFly() {
    // Move the fly
    fly.x += fly.speed;
    // Handle the fly going off the canvas
    if (fly.x > width) {
        resetFly();
    }
}

//moves the second fly
function moveFly2() {
    // Move the fly
    fly2.x += fly2.speed;
    // Handle the fly going off the canvas
    if (fly2.x > width) {
        resetFly2();
    }
}

//moves the bird
function moveBird() {
    //move the bird
    bird.x += bird.speed;
    // Handle the fly going off the canvas
    if (bird.x > width) {
        resetBird();
    }
}

/**
 * Draws the fly as a black circle
 */
function drawFly() {
    push();
    noStroke();
    fill("#000000");
    ellipse(fly.x, fly.y, fly.size);
    pop();
}

//draws the second fly
function drawFly2() {
    push();
    noStroke();
    fill("#000000");
    ellipse(fly2.x, fly2.y, fly2.size);
    pop();
}

//draws the bird
function drawBird() {
    push();
    noStroke();

    // bird body
    fill("#fcec35");
    ellipse(bird.x, bird.y, bird.size);

    // the beak
    fill("#f0c330");
    triangle(
        bird.x + bird.size * 0.7, bird.y, //tip of the beak
        bird.x + bird.size * 0.35, bird.y - bird.size * 0.2, //top base
        bird.x + bird.size * 0.35, bird.y + bird.size * 0.2 //bottom base
    );

    pop();
}



/**
 * Resets the fly to the left with a random y
 */
function resetFly() {
    fly.x = 0;
    fly.y = random(0, 300);
}

//resets the second fly to the left
function resetFly2() {
    fly2.x = 0;
    fly2.y = random(0, 300);
}

//resets the bird to the left
function resetBird() {
    bird.x = 0;
    bird.y = random(0, 300);
}

/**
 * Moves the frog to the mouse position on x
 */
function moveFrog() {
    frog.body.x = mouseX;
}

/**
 * Handles moving the tongue based on its state
 */
function moveTongue() {
    // Tongue matches the frog's x
    frog.tongue.x = frog.body.x;
    // If the tongue is idle, it doesn't do anything
    if (frog.tongue.state === "idle") {
        // Do nothing
    }
    // If the tongue is outbound, it moves up
    else if (frog.tongue.state === "outbound") {
        frog.tongue.y += -frog.tongue.speed;
        // The tongue bounces back if it hits the top
        if (frog.tongue.y <= 0) {
            frog.tongue.state = "inbound";
        }
    }
    // If the tongue is inbound, it moves down
    else if (frog.tongue.state === "inbound") {
        frog.tongue.y += frog.tongue.speed;
        // The tongue stops if it hits the bottom
        if (frog.tongue.y >= height) {
            frog.tongue.state = "idle";
        }
    }
}

/**
 * Displays the tongue (tip and line connection) and the frog (body)
 */
function drawFrog() {
    // Draw the tongue tip
    push();
    fill("#ff0000");
    noStroke();
    ellipse(frog.tongue.x, frog.tongue.y, frog.tongue.size);
    pop();

    // Draw the rest of the tongue
    push();
    stroke("#ff0000");
    strokeWeight(frog.tongue.size);
    line(frog.tongue.x, frog.tongue.y, frog.body.x, frog.body.y);
    pop();

    // Draw the frog's body
    push();
    fill("#00ff00");
    noStroke();
    ellipse(frog.body.x, frog.body.y, frog.body.size);
    pop();
}

/**
 * Handles the tongue overlapping the fly
 */
function checkTongueFlyOverlap() {
    // Get distance from tongue to fly
    const d = dist(frog.tongue.x, frog.tongue.y, fly.x, fly.y);
    // Check if it's an overlap
    const eaten = (d < frog.tongue.size / 2 + fly.size / 2);
    if (eaten) {
        // Reset the fly
        resetFly();
        // Bring back the tongue
        frog.tongue.state = "inbound";
    }
}

// tongue overlapping with the second fly
function checkTongueFlyOverlap2() {
    // Get distance from tongue to fly
    const d = dist(frog.tongue.x, frog.tongue.y, fly2.x, fly2.y);
    // Check if it's an overlap
    const eaten = (d < frog.tongue.size / 2 + fly2.size / 2);
    if (eaten) {
        // Reset the fly
        resetFly2();
        // Bring back the tongue
        frog.tongue.state = "inbound";
    }
}

/**
 * Launch the tongue on click (if it's not launched yet)
 */
function keyPressed() {
    if (key === ' ' && frog.tongue.state === "idle") {
        frog.tongue.state = "outbound";
    }
}

//make the other objects darker to give the illusion of night
function darkSky() {
    push();
    noStroke();
    fill(0, a); // the rectangle is black and trasparent
    rect(0, 0, 700, 500);
    pop();
    //the opacity changes (less transparent at night and more transparent during the day)
    if (night) {
        a += change;
        if (a >= 220) {
            a = 220;
            night = false; // once fully dark, switch back to day mode
        }
    }
    else {
        a -= change;
        if (a <= 0) {
            a = 0;
            night = true; // once fully bright, switch to night mode
        }
    }
}