/**
 * Variation Jam
 * Yaxuan Pang
 * 
 * HOW EMBARRASSING! I HAVE NO DESCRIPTION OF MY PROJECT!
 * PLEASE REMOVE A GRADE FROM MY WORK IF IT'S GRADED!
 */

"use strict";

//sky color
let r = 135; // red
let g = 207; // green
let b = 235; // blue
let a = 0; //alpha (the opacity)

let change = 0.055; //change the color of the sky

let dayCount = 0; // number of days
let radius = 30; // radius of the progrss ring
let direction = -1; // direction of the progress ring
let progress = 0; // the progress
let finalDayCount = 0; // store the final day count when game ends
let lastEatenTime = 0; // track when the frog last ate
let endTimeStarted = false; // timer for transition to the ending (starts off false)

let night = false; // the sky color change starts off false
let showBird2 = false; // the second bird does not appear at first
let showFlashLight = false; // the flashlight does not appear during the day
let showFly3 = false; // the third fly starts off false
let showMenu = true; // menu with instructions start off true
let showEnd = false; // ending starts off false
let showWin = false // show win starts off false
let ateFly = false; // frog did not eat any flies at the start
let showInstructions = false; // instructions is not visible at the beginning

//colors of the frog
let frogColor = "#00ff00"; // original
let newFrogColor = "#6e8514"; // taken some damage
let badFrogColor = "#855214"; // near death
let deadFrogColor = "#4f2409"; // dead


let FlashLightColor; //defining the color of the flashlight
let startTime; //defining a start time
let strokeColor; // the color of the stroke
let strokeFill; // the color of the stroke
let fontBold; // bold font

let cloudColor = 255; // the color of the clouds (white)

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
        speed: 10,
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
    createCanvas(700, 550);

    angleMode(DEGREES); // angle mode is in degrees

    //stroke color is a random color
    strokeColor = color(random(255));
    strokeFill = color(5, random(255), random(255));

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
    // color of the background is light blue at the beginning
    background(r, g, b);

    drawClouds(); // draws the clouds

    drawBehindwater(); // draw the waves behind the frog

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

    //if 1.5 seconds have passed and it is still daytime, the second bird will appear
    if (timePassed > 1500 && showMenu === false && a <= 100) {
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

    drawWater(); //draw the waves in front of the frog

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

    //if showinstructions is true, then draw instructions
    if (showInstructions === true) {
        drawInstructions();
    }

    // if the player did not lose, then they win the game and the winning screen appears
    if (showEnd === false) {
        spawnWin();
    }

    //if showWin is true, then draw win, show end is false and the night and day cycle stops
    if (showWin) {
        drawWin();
        night = false;
        showEnd = false;
    }

    // losing screen appears
    spawnEnd();

    //if show end is true, then draw end, the dead frog and the number of days the frog survived
    //show win is false and the night and day cycle stops
    if (showEnd) {
        drawEnd();
        EndingFrog();
        night = false;
        drawdayNumber();
        showWin = false;
    }

    // display progess ring and the number of days
    // Check green color value boundaries and increase or decrease
    if (g <= 85) {
        direction = 1; // green increasing
    } else if (startTime > 0 && g >= 207) {
        // if the game started and g is equal or bigger than 207
        direction = -1; // green decreasing
        dayCount++; // increase the number of days
    }


    // calculate the progess ring's completion percentage
    // One day = green value decreases from 207 to 85 and increases from 85 to 207 
    //Each increment is `change = 0.0055`(total number of changes is 244)
    if (direction === -1) {
        // green value decreasing
        progress = (207 - g) / 244;
    } else {
        // green value increasing
        progress = (g - 85) / 244 + 0.5;
    }

    drawProgressRing(progress);  // draw the progress ring
    showDay();  // show day

    // 3 seconds after the game starts check if the frog ate any flies
    if (timePassed > 3000) {
        checkLastEaten()
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

// draws the flashlight
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
    rect(0, 0, 700, 550);
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
    fly2.y = fly2.startY + sin(fly2.x * 1.5) * 50;
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
    fly4.y = fly4.startY + sin(fly4.x * 4) * 10;

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

    //drawing the wings
    fill(200);
    ellipse(fly.x - fly.size * 0.5,
        fly.y - fly.size * 0.5,
        fly.size * 0.8,
        fly.size * 0.4);

    ellipse(fly.x + fly.size * 0.5,
        fly.y - fly.size * 0.5,
        fly.size * 0.8,
        fly.size * 0.4)
    pop();
}

function drawFly2() {
    push();
    noStroke();
    fill("#000000");
    ellipse(fly2.x, fly2.y, fly2.size);

    //drawing the wings
    fill(200);
    ellipse(fly2.x - fly2.size * 0.5,
        fly2.y - fly2.size * 0.5,
        fly2.size * 0.8,
        fly2.size * 0.4);

    ellipse(fly2.x + fly2.size * 0.5,
        fly2.y - fly2.size * 0.5,
        fly2.size * 0.8,
        fly2.size * 0.4)
    pop();
}

function drawFly3() {
    push();
    noStroke();
    fill("#000000");
    ellipse(fly3.x, fly3.y, fly3.size);

    //drawing the wings
    fill(200);
    ellipse(fly3.x - fly3.size * 0.5,
        fly3.y - fly3.size * 0.5,
        fly3.size * 0.8,
        fly3.size * 0.4);

    ellipse(fly3.x + fly3.size * 0.5,
        fly3.y - fly3.size * 0.5,
        fly3.size * 0.8,
        fly3.size * 0.4)
    pop();
}

function drawFly4() {
    push();
    noStroke();
    fill("#000000");
    ellipse(fly4.x, fly4.y, fly4.size);

    //drawing the wings
    fill(200);
    ellipse(fly4.x - fly4.size * 0.5,
        fly4.y - fly4.size * 0.5,
        fly4.size * 0.8,
        fly4.size * 0.4);

    ellipse(fly4.x + fly4.size * 0.5,
        fly4.y - fly4.size * 0.5,
        fly4.size * 0.8,
        fly4.size * 0.4)
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
    fly.size = random(8, 12); // randomize the fly's size between 8 and 12 every time it resets
}

//resets the second fly to the left
function resetFly2() {
    fly2.x = 0;
    fly2.y = random(0, 300);
    fly2.startY = fly2.y;// startY is the middle height of the sine wave
    // It changes to make sure the fly is flying towards the right, not just up and down
    fly2.size = random(8, 12); // randomize the fly's size between 8 and 12 every time it resets
}

//resets the third fly to the left
function resetFly3() {
    fly3.x = 0;
    fly3.y = random(0, 300);
    fly3.size = random(8, 12); // randomize the fly's size between 8 and 12 every time it resets
}

//resets the fourth fly to the left
function resetFly4() {
    fly4.x = 0;
    fly4.y = random(0, 300);
    fly4.startY = fly4.y; // startY is the middle height of the sine wave
    // It changes to make sure the fly is flying towards the right, not just up and down
    fly4.size = random(8, 12); // randomize the fly's size between 8 and 12 every time it resets
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
    frog.body.x = constrain(mouseX, frog.body.size / 16,
        width - frog.body.size / 16);
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

    push();
    // Eye positions
    let eyeOffsetX = frog.body.size * 0.3;
    let eyeOffsetY = frog.body.size * 0.4;
    let eyeSize = frog.body.size * 0.25;

    // White part of eyes
    noStroke();
    fill(255);
    ellipse(frog.body.x - eyeOffsetX, frog.body.y - eyeOffsetY, eyeSize);
    ellipse(frog.body.x + eyeOffsetX, frog.body.y - eyeOffsetY, eyeSize);

    // Pupils
    fill(0);
    let pupilSize = eyeSize * 0.4;
    ellipse(frog.body.x - eyeOffsetX, frog.body.y - eyeOffsetY, pupilSize);
    ellipse(frog.body.x + eyeOffsetX, frog.body.y - eyeOffsetY, pupilSize);
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
        frog.tongue.speed = frog.tongue.speed + 1; // tongue speeds up every time the frog eats a fly
        frog.tongue.speed = constrain(frog.tongue.speed, 10, 25); // the speed is between 10 and 25
        // Bring back the tongue
        frog.tongue.state = "inbound";
        lastEatenTime = millis(); // record the time when fly was eaten
        ateFly = true;
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
        frog.tongue.speed = frog.tongue.speed + 1; // tongue speeds up every time the frog eats a fly
        frog.tongue.speed = constrain(frog.tongue.speed, 10, 25); // the speed is between 10 and 25
        // Bring back the tongue
        frog.tongue.state = "inbound";
        lastEatenTime = millis(); // record the time when fly was eaten
        ateFly = true;
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
        frog.tongue.speed = frog.tongue.speed + 1; // tongue speeds up every time the frog eats a fly
        frog.tongue.speed = constrain(frog.tongue.speed, 10, 25); // the speed is between 10 and 25
        // Bring back the tongue
        frog.tongue.state = "inbound";
        lastEatenTime = millis(); // record the time when fly was eaten
        ateFly = true;
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
        frog.tongue.speed = frog.tongue.speed + 1; // tongue speeds up every time the frog eats a fly
        frog.tongue.speed = constrain(frog.tongue.speed, 10, 25); // the speed is between 10 and 25
        // Bring back the tongue
        frog.tongue.state = "inbound";
        lastEatenTime = millis(); // record the time when fly was eaten
        ateFly = true;
    }
}

//tongue overlapping with birds
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
        frog.tongue.speed = 10; // if the frog eats a frog, the tongue speed slows down to 10
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
        frog.tongue.speed = 10; // if the frog eats a frog, the tongue speed slows down to 10
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
    text('**Click space to play!**', width / 2, height / 6); // small square for instructions

    //title
    textAlign(CENTER, CENTER);
    textSize(70);
    textStyle(BOLD);
    fill(255);
    strokeWeight(15);

    // the color of the stroke changes once every 10 frames
    if (frameCount % 10 === 0) {
        strokeFill = color(5, random(255), random(255));
    }
    stroke(strokeFill);
    text('LIFE AS A FROG', width / 2, height / 3);

    // instructions to start the game
    noStroke(0);
    fill(255);
    rect(340, height / 2, 40, 40);

    fill(0);
    textSize(13);
    textAlign(CENTER, CENTER);
    text('Click here for instructions', 360, 330);

    pop();
}

function drawInstructions() {
    push();
    //other game modes
    strokeWeight(4);
    stroke(255);
    fill(0);
    textSize(20);

    //instruction background
    noStroke();
    fill(255);
    rect(180, 130, 380, 370, 15);

    //instructions
    fill(0);
    textSize(17);
    textAlign(CENTER, CENTER);
    text('Instructions:', 375, 160);

    textAlign(LEFT, CENTER);
    text('- Control the frog with the mouse and click', 210, 200);
    text('space to eat', 224, 220);
    text('- Eat the flies every 3 seconds to not starve', 210, 250);
    text('- WATCH OUT for birds and the', 210, 290);
    text('flashlight', 224, 310);
    text('- Birds can heal the frog, but it also', 210, 340);
    text('damages the frog at the same time', 220, 360);
    text('frog is hurt', 270, 390);
    text('frog is dying', 270, 410);
    text('frog is dead -> GAME OVER ', 270, 430);
    text('- Survive 3 days to WIN', 210, 460);

    //frog colors
    fill("#6e8514");
    rect(250, 385, 10, 10);

    fill("#855214");
    rect(250, 405, 10, 10);

    fill("#4f2409");
    rect(250, 425, 10, 10);

    // button to close the instructions
    strokeWeight(2.5);
    stroke(200);
    noFill();
    rect(523.5, 130, 35, 35, 10);
    text('X', 535, 148);

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
    if (frogColor === deadFrogColor && endTimeStarted === false) {
        endTimeStarted = true; // timer for the end has started
        finalDayCount = dayCount; // save the current day count
        setTimeout(() => {
            showEnd = true; // show the end after half a second
        }, 500); // half a second delay
    }
}

function EndingFrog() {
    push();
    noStroke();
    fill(255);
    circle(width / 2, height / 1.5, 80);
    fill("#00ff00");
    circle(width / 2, height / 1.47, 45);
    circle(width / 2.1, height / 1.56, 20);
    circle(width / 1.915, height / 1.56, 20);

    fill(0);
    textSize(13);
    textAlign(CENTER, CENTER);
    text("X", width / 2.1, height / 1.55);   // left eye X
    text("X", width / 1.915, height / 1.55); // right eye X


    fill("#ff0000");
    ellipse(width / 1.95, height / 1.45, 5, 20);


    fill(0);
    rect(width / 2.1, height / 1.47, 32, 2);

    fill("#00ff00");
    rect(width / 2.1, height / 1.49, 32, 5);
    pop();
}

//draw the wave shape at the front of the frog
function drawWater() {
    push();
    noStroke();

    fill("#3d9cf5");

    //start drawing a custom shape
    beginShape();
    for (let x = 0; x <= width; x += 10) {
        // creates waves
        let y = 495 + sin(x * 3 + frameCount * 3) * 10;
        vertex(x, y);
    }
    // close off the shape
    vertex(width, height);
    vertex(0, height);
    endShape(CLOSE);

    pop();
}

//draw the wave shape behind the frog
function drawBehindwater() {
    push();
    noStroke();
    fill("#1ec7be");

    //start drawing a custom shape
    beginShape();
    for (let x = 0; x <= width; x += 10) {
        // creates waves
        let y = 485 + sin(x * 3 - frameCount * 3) * 10;
        vertex(x, y);
    }
    // close off the shape
    vertex(width, height);
    vertex(0, height);
    endShape(CLOSE);
    pop();
}

function checkLastEaten() {
    // If 3 seconds pass without eating the frog changes colors
    if (millis() - lastEatenTime > 3000 && frogColor === "#00ff00" && showMenu === false) {
        frogColor = newFrogColor;
        lastEatenTime = millis(); // reset timer

    }
    //If another 3 seconds pass (6 seconds total) without eating the frog changes colors again
    else if (millis() - lastEatenTime > 3000 && frogColor === newFrogColor && showMenu === false) {
        frogColor = badFrogColor;
        lastEatenTime = millis(); // reset timer
    }
    //If another 3 seconds pass (9 seconds total) without eating the frog changes colors again
    else if (millis() - lastEatenTime > 3000 && frogColor === badFrogColor && showMenu === false) {
        frogColor = deadFrogColor;
    }
}

function drawProgressRing(progress) {
    push();
    // draw the white ring background
    stroke(255);
    strokeWeight(4);
    noFill();
    ellipse(90, 90, radius * 2, radius * 2);

    // fill the green progress ring
    stroke(124, 252, 0);
    strokeWeight(4);
    strokeCap(SQUARE);
    noFill();

    // draw the progress ring clockwise from the top(-90 degree)
    let startAngle = -90;
    let endAngle = -90 + (progress * 360);

    // draw the progress ring
    arc(90, 90, radius * 2, radius * 2, startAngle, endAngle);

    pop();
}

function showDay() {
    push();
    fill(0);
    noStroke();
    textSize(12);
    textAlign(CENTER, CENTER);
    text("DAY " + dayCount, 85, 40);
    pop();
}

function drawdayNumber() {
    push();
    fill(255);
    noStroke();
    textSize(50);
    textAlign(CENTER, CENTER); //align the text at the center
    text("DAY " + finalDayCount, width / 2, 200); // show the value of finalDayCount
    pop();
}

// darws the winning screen
function drawWin() {
    push();
    noStroke();
    fill(0);
    rect(0, 0, width, height);
    strokeWeight(3);
    stroke("#ffe72e");
    textAlign(CENTER, CENTER);
    textSize(50);
    textStyle(BOLD);
    text('**You Win!!**', width / 2, height / 2);
    pop();
}

// the player wins if the frog survives 5 days
function spawnWin() {
    if (dayCount === 5) {
        showWin = true;
    }
}

//draws the clouds
function drawClouds() {
    noStroke();
    fill(cloudColor);
    ellipse(130, 300, 60, 40);
    ellipse(120, 260, 60, 60);
    ellipse(170, 280, 70, 70);
    ellipse(80, 290, 60, 60);
    ellipse(50, 300, 40, 40);
    ellipse(210, 300, 40, 40);

    ellipse(550, 100, 60, 40);
    ellipse(540, 60, 60, 60);
    ellipse(590, 80, 70, 70);
    ellipse(500, 90, 60, 60);
    ellipse(470, 100, 40, 40);
    ellipse(630, 100, 40, 40);

    ellipse(565, 375, 50, 30);
    ellipse(625, 375, 20, 20);
    ellipse(565, 355, 55, 55);
    ellipse(530, 370, 40, 40);
    ellipse(510, 375, 30, 30);
    ellipse(600, 370, 40, 40);
}

/**
 * Launch the tongue on click (if it's not launched yet)
 */
function keyPressed() {
    if (key === ' ' && frog.tongue.state === "idle") {
        frog.tongue.state = "outbound";
        showMenu = false // menu disappears when space is pressed (the game starts)
        //time is in milliseconds
        startTime = millis();
        lastEatenTime = millis()
    }
}

// click on the small white square to show instructions and click on the x to close it
function mousePressed() {
    if (mouseX > 340 && mouseX < 380 && mouseY > 275 && mouseY < 315) { // click on the square to see instructions
        showInstructions = true;
    }
    if (mouseX > 523.5 && mouseX < 558.5 && mouseY > 130 && mouseY < 165) { // x to close the instructions
        showInstructions = false;
    }
}