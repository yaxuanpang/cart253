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
let showBird2 = false;
let showFlashLight = false;
let showFly3 = false;

let frogColor = "#00ff00";
let newfrogColor = "#6e8514";
let badfrogColor = "#855214";
let deadfrogColor = "#4f2409";

let FlashLightColor;

let startTime;


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
        speed: 25,
        // Determines how the tongue moves each frame
        state: "idle" // State can be: idle, outbound, inbound
    }
};

//a bird
//position. size, speed adn movement
const bird = {
    x: 0, // starts at 0
    y: 200, // starts at 200
    size: 40,
    speed: 2,
};

const bird2 = {
    x: 0, // starts at 0
    y: 400, // starts at 400
    size: 40,
    speed: 2.5, // slightly slower than the first bird
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
    y: 300, // Will be random
    size: 12,
    speed: 5 //changed the speed of the second fly
};

const fly3 = {
    x: 0,
    y: 300, // Will be random
    size: 10,
    speed: 4 //changed the speed of the third fly
};

const fly4 = {
    x: 0,
    y: 100, // Will be random
    size: 12,
    speed: 3.5 //changed the speed of the third fly
};

const flashlight = {
    x: undefined,
    y: undefined,
    size: 150,
    fill: (FlashLightColor),
}



/**
 * Creates the canvas and initializes the fly
 */
function setup() {
    createCanvas(700, 500);

    FlashLightColor = color(245, 218, 42, 200);

    // Give the flies and birds its first random position
    resetFly();
    resetFly2();
    resetFly3();
    resetFly4();
    resetBird();
    resetBird2();

    flashlight.x = width / 2;
    flashlight.y = width / 2;

    startTime = millis();
}

function draw() {
    background(r, g, b); // color of the background is light blue at the beginning

    let timePassed = millis() - startTime;

    drawFly(); // draws the fly
    drawFly2(); // draws the second fly

    spawnFly3();// draws the third fly

    drawFly4(); // draws the fourth fly
    drawBird(); // draws the bird
    drawFrog(); // draws the frog

    if (showFly3) {
        drawFly3();
    }

    if (timePassed > 7000 && a <= 90) {
        showBird2 = true;
    }

    if (showBird2) {
        drawBird2();
        moveBird2();
        checkTongueBirdOverlap2();
    }

    if (a > 90) {
        showBird2 = false;
    }

    drawNight(); // makes eveyrhting darker
    darkSky(); // makes the sky change colors (from light blue to dark blue)

    moveFly(); // moves the fly
    moveFly2(); // moves the second fly
    moveFly3();
    moveFly4();
    moveBird(); // moves the bird
    moveFrog(); // moves the frog
    moveTongue(); //moves the tongue of the frog

    checkTongueFlyOverlap(); // tongue overlaps with the fly
    checkTongueFlyOverlap2(); // tongue overlaps with the second fly
    checkTongueFlyOverlap3();
    checkTongueFlyOverlap4();
    checkTongueBirdOverlap();

    spawnFlashlight();

    if (showFlashLight) {
        drawFlashLight();
        moveFlashlight();
        moveHunter();
    }

}

function moveHunter() {
    // calculate the distance between flashlight and frog
    const d = dist(flashlight.x, flashlight.y, frog.body.x, frog.body.y);
    const overlap = (d < flashlight.size / 2 + frog.body.size / 2);

    // if flashlight overlaps with the frog it dies
    if (overlap) {
        frogColor = deadfrogColor;
    }
}


function spawnFlashlight() {
    if (a > 105) {
        showFlashLight = true;
    }
    else {
        showFlashLight = false;
    }
}

function drawFlashLight() {
    push();
    noStroke();
    fill(FlashLightColor);
    circle(flashlight.x, flashlight.y, flashlight.size);
    pop();
}

function moveFlashlight() {
    if (frameCount % 60 === 0) {
        flashlight.x = random(width);
        flashlight.y = random(300, 550);
    }
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

//moves the third fly
function moveFly3() {
    // Move the fly
    fly3.x += fly3.speed;
    // Handle the fly going off the canvas
    if (fly3.x > width) {
        resetFly3();
    }
}

function spawnFly3() {
    if (a > 70) {
        showFly3 = true;
    }
    else {
        showFly3 = false;
    }
}

function moveFly4() {
    // Move the fly
    fly4.x += fly4.speed;

    // the fly moves up and down while flying to the right
    fly4.y = fly4.startY + sin(fly4.x * 0.04) * 10;

    // Handle the fly going off the canvas
    if (fly4.x > width) {
        resetFly4();
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

//moves the second bird
function moveBird2() {
    //move the bird
    bird2.x += bird2.speed;
    // Handle the fly going off the canvas
    if (bird2.x > width) {
        resetBird2();
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

function drawFly3() {
    push();
    noStroke();
    fill("#000000");
    ellipse(fly3.x, fly3.y, fly3.size);
    pop();
}

function drawFly4() {
    push();
    noStroke();
    fill("#000000");
    ellipse(fly4.x, fly4.y, fly4.size);
    pop();
}

//draws the bird
function drawBird() {
    push();
    noStroke();

    // bird tail
    fill("#fcec35");
    triangle(
        bird.x - bird.size / 2.5, bird.y,
        bird.x - bird.size / 2 - 17, bird.y - 5,
        bird.x - bird.size / 2 - 10, bird.y + 5
    );

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
    //the eyes
    fill(0);
    ellipse(bird.x + bird.size / 6, bird.y - bird.size / 8, bird.size / 10);

    pop();
}

//draws the bird
function drawBird2() {
    push();
    noStroke();

    // bird tail
    fill("#fcec35");
    triangle(
        bird2.x - bird2.size / 2.5, bird2.y,
        bird2.x - bird2.size / 2 - 17, bird2.y - 5,
        bird2.x - bird2.size / 2 - 10, bird2.y + 5
    );

    // bird body
    fill("#fcec35");
    ellipse(bird2.x, bird2.y, bird2.size);

    // the beak
    fill("#f0c330");
    triangle(
        bird2.x + bird2.size * 0.7, bird2.y, //tip of the beak
        bird2.x + bird2.size * 0.35, bird2.y - bird2.size * 0.2, //top base
        bird2.x + bird2.size * 0.35, bird2.y + bird2.size * 0.2 //bottom base
    );
    //the eyes
    fill(0);
    ellipse(bird2.x + bird2.size / 6, bird2.y - bird2.size / 8, bird2.size / 10);

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

//resets the third fly to the left
function resetFly3() {
    fly3.x = 0;
    fly3.y = random(0, 300);
}

//resets the fourth fly to the left
function resetFly4() {
    fly4.x = 0;
    fly4.y = random(0, 300);
    fly4.startY = fly4.y; // startY is the middle height of the sine wave
    // It changes to make sure the fly is flying towards the right, not just up and down
}

//resets the bird to the left
function resetBird() {
    bird.x = 0;
    bird.y = random(0, 300);
}

//resets the second bird to the left
function resetBird2() {
    bird2.x = 0;
    bird2.y = random(0, 300);
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
    fill(frogColor);
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

// tongue overlapping with the third fly
function checkTongueFlyOverlap3() {
    // Get distance from tongue to fly
    const d = dist(frog.tongue.x, frog.tongue.y, fly3.x, fly3.y);
    // Check if it's an overlap
    const eaten = (d < frog.tongue.size / 2 + fly3.size / 2);
    if (eaten) {
        // Reset the fly
        resetFly3();
        // Bring back the tongue
        frog.tongue.state = "inbound";
    }
}

// tongue overlapping with the fourth fly
function checkTongueFlyOverlap4() {
    // Get distance from tongue to fly
    const d = dist(frog.tongue.x, frog.tongue.y, fly4.x, fly4.y);
    // Check if it's an overlap
    const eaten = (d < frog.tongue.size / 2 + fly4.size / 2);
    if (eaten) {
        // Reset the fly
        resetFly4();
        // Bring back the tongue
        frog.tongue.state = "inbound";
    }
}

function checkTongueBirdOverlap() {
    // Get distance from tongue to fly
    const d = dist(frog.tongue.x, frog.tongue.y, bird.x, bird.y);
    // Check if it's an overlap
    const eaten = (d < frog.tongue.size / 2 + bird.size / 2);
    if (eaten) {
        // Reset the fly
        resetBird();
        // Bring back the tongue
        frog.tongue.state = "inbound";
    }
    if (eaten) {
        resetBird();
        frog.tongue.state = "inbound";

        //frog eats bird for the first time
        if (frogColor === "#00ff00") {
            frogColor = newfrogColor; //frog turns dark green


            setTimeout(() => {
                if (frogColor === newfrogColor) {
                    frogColor = "#00ff00"; // turns back to bright green after 5 seconds
                }
            }, 5000);

            //frog eats bird for the second time before turning back to normal
        } else if (frogColor === newfrogColor) {
            frogColor = badfrogColor; //frog turns brown


            setTimeout(() => {
                if (frogColor === badfrogColor) {
                    frogColor = newfrogColor;// turns back to dark green after 5 seconds


                    setTimeout(() => {
                        if (frogColor === newfrogColor) {
                            frogColor = "#00ff00"; // frog turns back to bright green
                        }
                    }, 5000);
                }
            }, 5000);

            //frog eats bird for the third time before turning back to normal (it dies)
        } else if (frogColor === badfrogColor) {
            frogColor = deadfrogColor; //frog turns dark brown
        }
    }
}

function checkTongueBirdOverlap2() {
    // Get distance from tongue to fly
    const d = dist(frog.tongue.x, frog.tongue.y, bird2.x, bird2.y);
    // Check if it's an overlap
    const eaten = (d < frog.tongue.size / 2 + bird2.size / 2);
    if (eaten) {
        // Reset the fly
        resetBird2();
        // Bring back the tongue
        frog.tongue.state = "inbound";
    }
    if (eaten) {
        resetBird2();
        frog.tongue.state = "inbound";

        //frog eats bird for the first time
        if (frogColor === "#00ff00") {
            frogColor = newfrogColor; //frog turns dark green


            setTimeout(() => {
                if (frogColor === newfrogColor) {
                    frogColor = "#00ff00"; // turns back to bright green after 5 seconds
                }
            }, 5000);

            //frog eats bird for the second time before turning back to normal
        } else if (frogColor === newfrogColor) {
            frogColor = badfrogColor; //frog turns brown


            setTimeout(() => {
                if (frogColor === badfrogColor) {
                    frogColor = newfrogColor;// turns back to dark green after 5 seconds


                    setTimeout(() => {
                        if (frogColor === newfrogColor) {
                            frogColor = "#00ff00"; // frog turns back to bright green
                        }
                    }, 5000);
                }
            }, 5000);

            //frog eats bird for the third time before turning back to normal (it dies)
        } else if (frogColor === badfrogColor) {
            frogColor = deadfrogColor; //frog turns dark brown
        }
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