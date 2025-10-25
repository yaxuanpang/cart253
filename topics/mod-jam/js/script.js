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


let change = 0.055; //change the color of the sky
let night = false; // the sky color change starts off false
let showBird2 = false; // the second bird does not appear at first
let showFlashLight = false; // the flashlight does not appear during the day
let showFly3 = false; // the third fly starts off false
let showMenu = true; // menu with instructions start off true
let showEnd = false; // ending starts off false

//colors of the frog
let frogColor = "#00ff00"; // original
let newFrogColor = "#6e8514"; // taken some damage
let badFrogColor = "#855214"; // near death
let deadFrogColor = "#4f2409"; // dead


let FlashLightColor; //defining the color of the flashlight
let startTime; //defining a start time
let strokeColor; // the color of the stroke
let fontBold; // bold font



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
//position. size, speed and movement
const bird = {
    x: 0,
    y: 200, // starts at 200
    size: 40,
    speed: 2,
};

//a second bird
//position. size, speed and movement
const bird2 = {
    x: 0,
    y: 400, // starts at 400
    size: 40,
    speed: 2.5, // slightly slower than the first bird
};

// Our fly
// Has a position, size, and speed of horizontal movement
const fly = {
    x: 0,
    y: 200,
    size: 10,
    speed: 3
};

//a second faster fly
//position, size, speed and horizontal movement
const fly2 = {
    x: 0,
    y: 300, // Will be random
    size: 12,
    speed: 5 //changed the speed of the second fly
};
//a third fly
//position, size, speed and horizontal movement
const fly3 = {
    x: 0,
    y: 300, // Will be random
    size: 10,
    speed: 4 //changed the speed of the third fly
};

//a fourth fly
//position, size, speed and horizontal movement
const fly4 = {
    x: 0,
    y: 100, // Will be random
    size: 12,
    speed: 3.5 //changed the speed of the third fly
};

//a falshlight
//position, size, color
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

    //stroke color is a random color
    strokeColor = color(random(255));

    //color of the flashlight 
    FlashLightColor = color(245, 218, 42, 200);

    // Give the flies and birds its first random position
    resetFly();
    resetFly2();
    resetFly3();
    resetFly4();
    resetBird();
    resetBird2();

    //setting position of the flashlight
    flashlight.x = width / 2;
    flashlight.y = height / 2;
}

function draw() {
    background(r, g, b);
    // color of the background is light blue at the beginning

    // the time passed is how much milliseconds passed since the start time
    let timePassed = millis() - startTime;

    drawFly(); // draws the fly
    drawFly2(); // draws the second fly

    spawnFly3();// shows fly3

    drawFly4(); // draws the fourth fly
    drawBird(); // draws the bird
    drawFrog(); // draws the frog

    //if showfly3 is true then draw fly3, move it and check if the tongue overlaps with it
    if (showFly3) {
        drawFly3();
        moveFly3();
        checkTongueFlyOverlap3();
    }

    //if 3 seconds have passed and it is still daytime, the second bird will appear
    if (timePassed > 3000 && showMenu === false && a <= 100) {
        showBird2 = true;
    }

    //if showbird2 is true then draw bird2, move it and check if the tongue overlaps with it
    if (showBird2) {
        drawBird2();
        moveBird2();
        checkTongueBirdOverlap2();
    }

    // if it is nighttime (opacity is at 90), then the second bird disappears (it went home like me)
    if (a > 100) {
        showBird2 = false;
    }

    // the sky only starts darkening when menu is no longer visible
    if (showMenu === false) {
        drawNight(); // makes everything darker (the rectangle I put on top of everything gets darker)
        darkSky(); // makes the sky change colors (from light blue to dark blue)
    }

    moveFly(); // moves the fly
    moveFly2(); // moves the second fly
    moveFly4(); // moves the fourth fly
    moveBird(); // moves the bird
    moveFrog(); // moves the frog
    moveTongue(); //moves the tongue of the frog

    checkTongueFlyOverlap(); // tongue overlaps with the fly
    checkTongueFlyOverlap2(); // tongue overlaps with the second fly
    checkTongueFlyOverlap4(); // tongue overlaps with the fourth fly
    checkTongueBirdOverlap(); // tongue overlaps with the first bird

    spawnFlashlight(); // shows the flashlight

    //if showflashlight is true then draw the flashlight, move it and check if the frog overlaps with it
    if (showFlashLight) {
        drawFlashLight();
        moveFlashlight();
        moveHunter();
    }

    // if showmenu is true, then draw menu
    if (showMenu) {
        drawMenu();
    }

    spawnEnd();

    if (showEnd) {
        drawEnd();
    }
}

/**
 * draws, moves and check for overlap with frog for flashlight
 */
//makes the frog change colors when the flashlight overlaps with it
function moveHunter() {
    // calculate the distance between flashlight and frog
    const d = dist(flashlight.x, flashlight.y, frog.body.x, frog.body.y);
    const overlap = (d < flashlight.size / 2 + frog.body.size / 2);

    // if flashlight overlaps with the frog it dies (changes color)
    if (overlap) {
        frogColor = deadFrogColor;
    }
}

// makes flashlight appear and disappear
function spawnFlashlight() {
    // flashlight only appears if the opacity is more than 105 and menu is false
    if (a > 110 && showMenu === false) {
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
    // appears every 60 frames
    if (frameCount % 60 === 0) {
        flashlight.x = random(width); //random
        flashlight.y = random(300, 550); // appears between 300 and 550 for y
    }
}

/**
 * change from daytime to nighttime
 */

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

        // limits the green to 207 for the daytime color
        if (g >= 207) {
            g = 207;
            night = true; // switch to night
        }
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

/**
 * Moves the fly according to its speed
 */
function moveFly() {
    // Move the fly
    fly.x += fly.speed;
    // Handle the fly going off the canvas
    if (fly.x > width) {
        resetFly();
    }
}


function moveFly2() {
    // Move the fly
    fly2.x += fly2.speed;
    // the fly moves up and down while flying to the right
    fly2.y = fly2.startY + sin(fly2.x * 0.01) * 50;
    // Handle the fly going off the canvas
    if (fly2.x > width) {
        resetFly2();
    }
}


function moveFly3() {
    // Move the fly
    fly3.x += fly3.speed;
    // Handle the fly going off the canvas
    if (fly3.x > width) {
        resetFly3();
    }
}

//makes the third fly appear when the opacity is at 70
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
 * Draws the flies
 */
function drawFly() {
    push();
    noStroke();
    fill("#000000");
    ellipse(fly.x, fly.y, fly.size);
    pop();
}

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

/**
 * Draws the birds
 */

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
    fly2.startY = fly2.y;
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
            frogColor = newFrogColor; //frog turns dark green


            setTimeout(() => {
                if (frogColor === newFrogColor) {
                    frogColor = "#00ff00"; // turns back to bright green after 5 seconds
                }
            }, 5000);

            //frog eats bird for the second time before turning back to normal
        } else if (frogColor === newFrogColor) {
            frogColor = badFrogColor; //frog turns brown


            setTimeout(() => {
                if (frogColor === badFrogColor) {
                    frogColor = newFrogColor;// turns back to dark green after 5 seconds


                    setTimeout(() => {
                        if (frogColor === newFrogColor) {
                            frogColor = "#00ff00"; // frog turns back to bright green
                        }
                    }, 5000);
                }
            }, 5000);

            //frog eats bird for the third time before turning back to normal (it dies)
        } else if (frogColor === badFrogColor) {
            frogColor = deadFrogColor; //frog turns dark brown
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
            frogColor = newFrogColor; //frog turns dark green


            setTimeout(() => {
                if (frogColor === newFrogColor) {
                    frogColor = "#00ff00"; // turns back to bright green after 5 seconds
                }
            }, 5000);

            //frog eats bird for the second time before turning back to normal
        } else if (frogColor === newFrogColor) {
            frogColor = badfrogColor; //frog turns brown


            setTimeout(() => {
                if (frogColor === badFrogColor) {
                    frogColor = newfrogColor;// turns back to dark green after 5 seconds


                    setTimeout(() => {
                        if (frogColor === newFrogColor) {
                            frogColor = "#00ff00"; // frog turns back to bright green
                        }
                    }, 5000);
                }
            }, 5000);

            //frog eats bird for the third time before turning back to normal (it dies)
        } else if (frogColor === badFrogColor) {
            frogColor = deadFrogColor; //frog turns dark brown
        }
    }
}

/**
 * Launch the tongue on click (if it's not launched yet)
 */
function keyPressed() {
    if (key === ' ' && frog.tongue.state === "idle") {
        frog.tongue.state = "outbound";
        showMenu = false // menu disappears when space is pressed
        //time is in milliseconds
        startTime = millis();
    }
}

/**
 * Menu, Instructions and Ending
 */
//drawing the menu
function drawMenu() {
    push();
    textAlign(CENTER, CENTER);
    textSize(30);
    strokeWeight(5);

    //slows down the color change for the instructions
    if (frameCount % 10 === 0) {
        strokeColor = color(random(255), random(255), random(255))
    }
    stroke(strokeColor);
    text('**Click space to play!**', width / 2, height / 6);
    pop();
}

//drawing the ending
function drawEnd() {
    push();
    noStroke();
    fill(0);
    rect(0, 0, width, height);

    strokeWeight(3);
    stroke("#00ff00");
    textAlign(CENTER, CENTER);
    textSize(50);
    textStyle(BOLD);
    text('**Game Over**', width / 2, height / 2);
    pop();
}

function spawnEnd() {
    if (frogColor === deadFrogColor) {
        showEnd = true;
    }
    else {
        showEnd = false;
    }
}