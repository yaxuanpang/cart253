/**
 * Variation Jam: Life as a Frog (Summer Edition!)
 * Yaxuan Pang
 * 
 * A game of catching flies with the frog's tongue. 
 * It portrays a semi-realistic life of a frog.
 * 
 * Instructions:
 * - Click on the white square for instructions and game modes
 * - Move the frog with your mouse
 * - Click on the mouse to make more clouds and make rain
 * - Click space to launch the tongue to catch flies
 * - Eat the special bird to unlock special abilities
 * 
 * Made with p5
 * https://p5js.org/
 */

"use strict";

// defining arrays and variables
const clouds = []; // cloud array
const flies = []; // fly array
const dynamicClouds = []; // array for clouds that appear and disappear
const rainFlies = []; // rian flies array
let rain = []; // rain
let cloudTime = []; // cloud timer
let state = 'MENU'; // MENU, GAME, WIN, END

// the instructions pages are not visible at first
let showInstructions = false;
let showSecondPage = false;

let dayCount = 0; // day count starts at 0 (goes to 1 when the game starts)
let finalDayCount = 0; // final day count starts at 0
let progress = 0; // progress starts at 0
let startTime = 0; // timer since the start of the game starts at 0
let lastEatenTime = 0; // timer for when the frog last ate starts at 0
let nextCloud = 0; // makes the next cloud appear
let endTimerStarted = false; // timer for the end starts off as false
let rainingNow = false; // it is not raining at the start of the game
let cloudFade = 0; // cloud is not fading
let fadeDirection = 1; // fade direction
let showGreenBird = true; // green bird is visible


// sky parameters (color, transparency)
const sky = {
    fill: {
        r: 135,
        g: 207,
        b: 235,
        transparency: 0
    },
    change: 0.055, // amount added or subtracted to the value of sky color every frame
    isNight: false,  // game starts during the day (not nighttime)(shifting to nighttime)
    direction: -1, // direction of color change
    cloudColor: 255, // color of the clouds
};

// frog parameters
const frog = { //position and size
    body: {
        x: 320,
        y: 520,
        size: 150
    },
    tongue: { // tongue parameters
        x: undefined,
        y: 480,
        size: 20,
        speed: 10,
        state: "idle" // idle, outbound, inbound
    }, // frog colors
    colors: {
        healthy: "#85fc35",
        damaged: "#98b81a",
        dying: "#a36e2e",
        dead: "#753c19",
        green: "#2abf8e"
    },
    currentColor: "#85fc35"
};

// bird array and parameters (x, y, size, speed if the bird is visible)
const birds = [
    {
        x: 0,
        y: 200,
        size: 40,
        speed: 2,
        active: true // bird is always visible
    },
    {
        x: 0,
        y: 400,
        size: 40,
        speed: 2.5,
        active: false,// birds appears later
        spawnsInDay: true, // bird is visible
    },
    {
        x: 0,
        y: 300,
        size: 40,
        speed: 1.5,
        active: true, // bird is visible
    }
];

// green bird parameters (position, size, speed, is visible)
const greenBird = {
    x: 0,
    y: 200,
    size: 40,
    speed: 6,
    active: true
};

// flashlight parameters (x, y, size, speed, not visible and color)
const flashlight = {
    x: 350,
    y: 275,
    size: 150,
    color: null,
    active: false
};

// cloud position (position, size)
// array for clouds that appear and disappear
const cloudPatterns = [
    [
        [245, 175, 50, 30],
        [305, 175, 20, 20],
        [245, 155, 55, 55],
        [210, 170, 40, 40],
        [190, 175, 30, 30],
        [280, 170, 40, 40]
    ],
    [
        [310, 35, 60, 40],
        [300, -5, 60, 60],
        [350, 15, 70, 70],
        [260, 25, 60, 60],
        [230, 35, 40, 40],
        [390, 35, 40, 40]
    ],
    [
        [435, 175, 50, 30],
        [495, 175, 20, 20],
        [435, 155, 55, 55],
        [400, 170, 40, 40],
        [380, 175, 30, 30],
        [470, 170, 40, 40]
    ],
    [
        [80, 20, 60, 40],
        [70, -10, 60, 60],
        [120, 0, 70, 70],
        [30, 10, 60, 60],
        [0, 20, 40, 40],
        [160, 20, 40, 40]
    ],
    [
        [130, 95, 60, 40],
        [120, 55, 60, 60],
        [170, 75, 70, 70],
        [80, 85, 60, 60],
        [50, 95, 40, 40],
        [210, 95, 40, 40]
    ],
    [
        [230, 30, 60, 40],
        [220, 0, 60, 60],
        [270, 10, 70, 70],
        [180, 20, 60, 60],
        [150, 30, 40, 40],
        [310, 30, 40, 40]
    ],
    [
        [450, 30, 60, 40],
        [440, 0, 60, 60],
        [490, 10, 70, 70],
        [400, 20, 60, 60],
        [370, 30, 40, 40],
        [530, 30, 40, 40]
    ],
    [
        [210, 35, 60, 40],
        [200, -5, 60, 60],
        [250, 15, 70, 70],
        [160, 25, 60, 60],
        [130, 35, 40, 40],
        [290, 35, 40, 40]
    ],
];

// cloud positions

// Cloud 1 - left side
clouds.push(createCloud([
    [130, 300, 60, 40],
    [120, 260, 60, 60],
    [170, 280, 70, 70],
    [80, 290, 60, 60],
    [50, 300, 40, 40],
    [210, 300, 40, 40]
], 1));

// Cloud 2 - top right
clouds.push(createCloud([
    [550, 100, 60, 40],
    [540, 60, 60, 60],
    [590, 80, 70, 70],
    [500, 90, 60, 60],
    [470, 100, 40, 40],
    [630, 100, 40, 40]
], 1));

// Cloud 3 - bottom right
clouds.push(createCloud([
    [565, 375, 50, 30],
    [625, 375, 20, 20],
    [565, 355, 55, 55],
    [530, 370, 40, 40],
    [510, 375, 30, 30],
    [600, 370, 40, 40]
], 1));


// progress ring parameters (position, radius, fill)
const progressRing = {
    x: 90,
    y: 90,
    radius: 30,
    strokeWeight: 4,
    fill: {
        background: 255,
        progress: {
            r: 124,
            g: 252,
            b: 0
        }
    }
};


// visual effects for the title
const titleEffect = {
    strokeColor: null,
    strokeFill: null
};

// instruction box parameters
const instructions = {
    x: 180,
    y: 130,
    w: 380,
    h: 370,
    corner: 15, // rounded corners
    closeButton: {
        x: 523.5,
        y: 130,
        size: 35,
        corner: 10
    }
};

// menu button parameters
const menuButton = {
    x: 340,
    y: 275,
    size: 40
};

// rain fly parameter (position, size, speed)
const rainFly = {
    x: 0,
    y: 200,
    startY: 200,
    size: 10,
    speed: 3
};

// raindrop object
const raindrop = {
    x: 0,
    y: 0,
    length: 15,
    radius: 0,
    opacity: 200
}

// Create the canvas, set an angle mode and initialize entities (birds, flies and flashlight)
function setup() {
    createCanvas(700, 550);
    angleMode(DEGREES);

    flies.push(createFly(0, 200, 10, 3, true, false));
    flies.push(createFly(0, 400, 10, 2, true, false));
    flies.push(createFly(0, 300, 12, 5, true, true, 1.5, 50));
    flies.push(createFly(0, 200, 12, 3.5, true, true, 1.5, 50));
    flies.push(createFly(0, 300, 10, 4, false, false, 0, 0, true));
    flies.push(createFly(0, 300, 10, 4, false, false, 0, 0, true));
    flies.push(createFly(0, 100, 12, 3.5, true, true, 4, 10));

    // creates 300 copies of the raindrop object and gives it a random position
    for (let i = 0; i < 300; i++) {
        const newRaindrop = { ...raindrop };
        newRaindrop.x = random(50, 550);
        newRaindrop.y = random(0, 700);
        rain.push(newRaindrop); // push new raindrop
    }

    // colors for the title
    titleEffect.strokeColor = color(random(255));
    titleEffect.strokeFill = color(5, random(255), random(255));
    flashlight.color = color(245, 218, 42, 200);


    // Initialize all entities
    flies.forEach(fly => resetFly(fly));
    birds.forEach(bird => resetBird(bird));
    flashlight.x = width / 2;
    flashlight.y = height / 2;

    // resets the green bird
    resetGreenBird(greenBird);


    // creates 5 copies of the rainflies object
    for (let i = 0; i < 5; i++) {
        const newRainFly = { ...rainFly };
        rainFlies.push(newRainFly);
        resetRainFly(newRainFly);
    }
}

// drawing the game states (menu, game, win, end)

function draw() {
    if (state === 'MENU') {
        menu();
    }
    else if (state === 'GAME') {
        game();
    }
    else if (state === 'WIN') {
        win();
    }
    else if (state === 'END') {
        end();
    }
}

/**
 * Handles mouse clicks
 */
// click within the menu button with the mouse to close the instructions
function mousePressed() {
    if (state === "MENU") {
        if (
            mouseX > menuButton.x &&
            mouseX < menuButton.x + menuButton.size &&
            mouseY > menuButton.y &&
            mouseY < menuButton.y + menuButton.size
        ) {
            showInstructions = true;
        }
        if (
            mouseX > instructions.closeButton.x &&
            mouseX < instructions.closeButton.x + instructions.closeButton.size &&
            mouseY > instructions.closeButton.y &&
            mouseY < instructions.closeButton.y + instructions.closeButton.size
        ) {
            showInstructions = false;
            showSecondPage = false;
        }
    }
    // click on the mouse to make more clouds (only in game state)
    if (state === "GAME") {
        const cloudShape = cloudPatterns[nextCloud];
        const newCloud = createCloud(cloudShape, 1.4);
        dynamicClouds.push(newCloud); // Changed from clouds to dynamicClouds
        nextCloud = (nextCloud + 1) % cloudPatterns.length;

        // Remove this cloud after 10 seconds
        setTimeout(() => {
            const index = dynamicClouds.indexOf(newCloud); // Changed array
            if (index > -1) {
                // Changed condition - remove any dynamic cloud
                dynamicClouds.splice(index, 1);
            }
        }, 10000);
    }
}


/**
 * Handles keyboard input
 */
function keyPressed(event) {
    if (event.keyCode === 32) { // space bar
        if (state === "MENU" && frog.tongue.state === "idle") { //frog tongue shoot out
            frog.tongue.state = "outbound";
            state = "GAME";
            startTime = millis(); // timer for start time starts
            lastEatenTime = millis(); // timer for when the frog eats last starts
        } else if (state === "GAME" && frog.tongue.state === "idle") {
            frog.tongue.state = "outbound"; //frog tongue shoot out
        }
    }
    if (event.keyCode === 39) { // right arrow (shows second page)
        if (showInstructions) {
            showInstructions = false;
            showSecondPage = true;
        }
    }

    if (event.keyCode === 37) { //left arrow (shows first page)
        if (showSecondPage) {
            showSecondPage = false;
            showInstructions = true;
        }
    }
}

// drawing all the elements that will appear in the menu state

function menu() {
    background(sky.fill.r, sky.fill.g, sky.fill.b);

    FrogMenuMovement(); // move frog


    drawBackgroundClouds(); // clouds that are always visible
    drawBehindWater();
    drawMenuBird();

    updateBirds(0); // move bird
    updateFlies(0);// move flies



    flies.forEach(fly => {
        if (!fly.spawnsAtNight) {
            fly.active = true;

            // Make flies move slower in the menu
            fly.x += fly.speed * 0.1;

            if (fly.wave) {
                fly.y = fly.startY + sin(fly.x * fly.waveSpeed) * fly.waveAmplitude;
            }

            if (fly.x > width) resetFly(fly);

            drawFly(fly);
        }
    });

    // draw and moce the green bird
    drawGreenBird(greenBird);
    moveGreenBird(greenBird);

    drawFrog();
    drawWater();

    drawLilyPad();
    drawMenuText();
    drawProgressRing();
    drawDayCounter();

    // if show instructions is true, draw each instruction page
    if (showInstructions === true) {
        drawInstructions();
    }
    if (showSecondPage === true) {
        drawSecondPage();
    }
}

// drawing all the elements that will appear in the game state
function game() {
    background(sky.fill.r, sky.fill.g, sky.fill.b);

    // start time starts in game state
    const timePassed = millis() - startTime;

    // draw environment
    drawBackgroundClouds();
    drawBehindWater();

    // Update and draw game entities
    updateFlies();
    updateBirds(timePassed);
    showFlashlight();

    // Draw entities
    flies.forEach(fly => { if (fly.active) drawFly(fly); });
    birds.forEach(bird => { if (bird.active) drawBird(bird); });
    drawFrog();
    drawWater();

    drawLilyPad();

    // draws rain
    drawDropNumber();

    // draw and remove clouds that can appear and disappear
    drawForegroundClouds();


    // Update game mechanics
    updateSky();
    updateProgress();
    if (timePassed > 3000) checkStarvation();

    if (flashlight.active) {
        drawFlashlight();
        checkFlashlightCollision();
    }

    // if it is raining, rain flies are visible and can be eaten by the frog
    if (rainingNow === true) {
        rainFlies.forEach(fly => {
            fly.x += fly.speed;
            fly.y = fly.startY + sin(fly.x * 1.5) * 50;
            if (fly.x > width) {
                resetRainFly(fly);
            }
            checkTongueCollision(fly, 'rainfly');
            drawRainFly(fly);
        });
    }

    // is show bird is true, spawn green bird
    if (showGreenBird === true) {
        spawnGreenBird();
    }

    // if the frog is turquoise, green bird is not visible
    if (frog.currentColor === frog.colors.green) {
        showGreenBird = false;
    }
    else {
        showGreenBird = true;
    }


    drawProgressRing();
    drawDayCounter();

    // Check win/lose conditions
    gameEnd();
}

/**
 * Checks if the game should end (win or lose)
 */
function gameEnd() {
    if (frog.currentColor === frog.colors.dead && endTimerStarted === false) {
        endTimerStarted = true;
        finalDayCount = dayCount;
        setTimeout(() => { state = 'END'; }, 500); // if the forg is dead, it goes to game over page in half a second
    }

    if (dayCount === 3) {
        state = 'WIN'; // if the frog survived 3 days, the player wins the game
    }
}

//create a cloud with position and size
function createCloud(newcloud, size = 1) {
    const cloud = [];
    newcloud.forEach(newcloud => {
        cloud.push([
            newcloud[0] * size,
            newcloud[1] * size,
            newcloud[2] * size,
            newcloud[3] * size
        ]);
    });
    return cloud;
}

// draws, moves and makes sure the frog is able to eat green bird
function spawnGreenBird() {
    drawGreenBird(greenBird);
    moveGreenBird(greenBird);
    checkTongueCollision(greenBird, "greenbird");
}

// creates rain fly
function drawRainFly(fly) {
    push();
    noStroke();
    fill("#dbb50d");
    ellipse(fly.x, fly.y, fly.size);

    fill(200);
    ellipse(
        fly.x - fly.size * 0.5,
        fly.y - fly.size * 0.5,
        fly.size * 0.8,
        fly.size * 0.4
    );
    ellipse(
        fly.x + fly.size * 0.5,
        fly.y - fly.size * 0.5,
        fly.size * 0.8,
        fly.size * 0.4
    );
    pop();
}

// moves rain fly
function moveRainFly(fly) {
    fly.x += fly.speed;
    fly.y = fly.startY + sin(fly.x * 1.5) * 50;

    if (fly.x > width) {
        resetRainFly(fly); // resets rain flies if they go off screen
    }
}


// reset rain fly and make them reappear at a random position
function resetRainFly(fly) {
    fly.x = 0;
    fly.y = random(0, 300);
    fly.startY = fly.y;
    fly.size = random(8, 12);
    fly.speed = random(2, 4);
}


//create the flies (position, size, speed, if its visible during the day or at night, wave speed, height of the wave)
function createFly(x, y, size, speed, active, wave, waveSpeed = 0, waveAmplitude = 0, spawnsAtNight = false) {
    return {
        x: x,
        y: y,
        size: size,
        speed: speed,
        startY: y,
        active: active,
        wave: wave,
        waveSpeed: waveSpeed,
        waveAmplitude: waveAmplitude,
        spawnsAtNight: spawnsAtNight
    };
}

//moves the frog
function FrogMenuMovement() {
    frog.x = mouseX;
}

// draw the yellow bird in the menu
function drawMenuBird() {
    let b = birds[0];   // use the first bird only for menu
    b.active = true;
    moveBird(b);
    drawBird(b);
    birds.speed += 2;
}


function updateBirds(timePassed) {

    birds.forEach((bird, index) => {

        // first bird is visible when transparency is lower than 100
        if (index === 0) {
            bird.active = sky.fill.transparency < 100;
        }

        // second bird appears afetr half a second
        if (index === 1) {
            bird.active = timePassed > 500;
        }

        // third bird appear after 5 seconds 
        if (index === 2) {
            bird.active = timePassed > 5000;
        }

        // if the birds are visible, move them and make sure the frog can eat the birds
        if (bird.active) {
            moveBird(bird);
            checkTongueCollision(bird, 'bird');
        }
    });
}

/**
 * Draws the menu text, title and subtitles
 */
function drawMenuText() {
    push();
    textAlign(CENTER, CENTER); // aligns the text at the center
    textSize(30);
    fill(0);
    strokeWeight(5);

    // changes to a random color every 15 frames
    if (frameCount % 15 === 0) {
        titleEffect.strokeColor = color(random(255), random(255), random(255));
    }
    // title and subtitle (stroke color, fill color, stroke weight and size)
    stroke(titleEffect.strokeColor);
    text("**Click space to play!**", width / 2, height / 6);

    textSize(20);
    fill(255);
    strokeWeight(5);
    stroke(235, 183, 14);
    text("(Summer Edition!! ☀️)", 350, 250);

    textSize(70);
    textStyle(BOLD);
    fill(255);
    strokeWeight(15);

    // changes to a random color every 10 frames
    if (frameCount % 10 === 0) {
        titleEffect.strokeFill = color(5, random(255), random(255));
    }
    stroke(titleEffect.strokeFill);
    text("LIFE AS A FROG", width / 2, height / 3);

    noStroke();
    fill(255);
    rect(menuButton.x, menuButton.y, menuButton.size, menuButton.size);

    // instruction to click on the instruction box
    fill(0);
    textSize(13);
    text("Click here for instructions", 360, 330);
    pop();
}


/**
 * Draws the instructions overlay
 */
function drawInstructions() {
    push();
    noStroke();
    fill(255);
    rect(
        instructions.x,
        instructions.y,
        instructions.w,
        instructions.h,
        instructions.corner
    );

    fill(0);
    textSize(17);
    textAlign(CENTER, CENTER);
    text("Instructions ☀️:", 375, 160);

    // text for first page
    textAlign(LEFT);
    text("- Control the frog with the mouse and click", 210, 200);
    text("space to eat", 224, 220);
    text("- Eat black or yellow flies every 3 seconds", 210, 250);
    text("- WATCH OUT for the yellow birds and the", 210, 290);
    text("flashlight (flashlight only appears at night)", 224, 310);
    text("- Click repeatedly on the mouse to make", 210, 340);
    text("more clouds (need 7 clouds to make rain)", 220, 360);
    text("frog is hurt", 270, 390);
    text("frog is dying", 270, 410);
    text("frog is dead -> GAME OVER ", 270, 430);
    text("- Survive 3 days to WIN", 210, 460);

    // colored squares to show the colors
    fill(frog.colors.damaged);
    rect(250, 385, 10, 10);
    fill(frog.colors.dying);
    rect(250, 405, 10, 10);
    fill(frog.colors.dead);
    rect(250, 425, 10, 10);

    strokeWeight(2.5);
    stroke(200);
    noFill();
    rect( // close button
        instructions.closeButton.x,
        instructions.closeButton.y,
        instructions.closeButton.size,
        instructions.closeButton.size,
        instructions.closeButton.corner
    );
    fill(0);
    noStroke();
    text("X", 535, 148);

    // arrow that leads to the second instructions page
    textSize(12);
    text("Click on the right arrow  -->", 400, 485);
    pop();
}


// draws second instructions page
function drawSecondPage() {
    push();
    noStroke();
    fill(255);
    rect(instructions.x, instructions.y, instructions.w, instructions.h, instructions.corner);

    // text for the second page
    fill(0);
    textSize(17);
    textAlign(CENTER, CENTER);
    text('Instructions ☀️:', 375, 160);

    textAlign(LEFT);
    text('- The frog get hurt if it eats the yellow bird,', 210, 200);
    text('but it will start healing itself in 5 seconds', 224, 220);


    text("- If the frog eats the green bird, it cannot be", 210, 325);
    text("killed by the flashlight (lasts 10 seconds)", 224, 345);



    // drawings for the second page
    // frogs
    fill(frog.colors.healthy);
    arc(210, 280, 50, 50, 180, 0);
    circle(197, 257, 15);
    circle(223, 257, 15);
    fill(255);
    circle(197, 257, 10);
    circle(223, 257, 10);
    fill(0);
    circle(197, 257, 3);
    circle(223, 257, 3);


    fill(frog.colors.healthy);
    arc(260, 400, 50, 50, 180, 0);
    circle(247, 377, 15);
    circle(273, 377, 15);
    fill(255);
    circle(247, 377, 10);
    circle(273, 377, 10);
    fill(0);
    circle(247, 377, 3);
    circle(273, 377, 3);

    fill(frog.colors.damaged);
    arc(400, 280, 50, 50, 180, 0);
    circle(387, 257, 15);
    circle(413, 257, 15);
    fill(255);
    circle(387, 257, 10);
    circle(413, 257, 10);
    fill(0);
    circle(387, 257, 3);
    circle(413, 257, 3);

    fill(frog.colors.dying);
    arc(465, 280, 50, 50, 180, 0);
    circle(452, 257, 15);
    circle(478, 257, 15);
    fill(255);
    circle(452, 257, 10);
    circle(478, 257, 10);
    fill(0);
    circle(452, 257, 3);
    circle(478, 257, 3);

    fill(frog.colors.dead);
    arc(530, 280, 50, 50, 180, 0);
    circle(517, 257, 15);
    circle(543, 257, 15);
    fill(255);
    circle(517, 257, 10);
    circle(543, 257, 10);
    fill(0);
    circle(517, 257, 3);
    circle(543, 257, 3);

    fill(frog.colors.green);
    arc(475, 400, 50, 50, 180, 0);
    circle(462, 377, 15);
    circle(488, 377, 15);
    fill(255);
    circle(462, 377, 10);
    circle(488, 377, 10);
    fill(0);
    circle(462, 377, 3);
    circle(488, 377, 3);


    textSize(10);
    text('+', 255, 265);
    text('-->', 350, 265);
    text('+', 305, 385);
    text('-->', 423, 385);
    text('(yellow bird)', 282, 295);
    text('(green bird)', 345, 410);

    strokeWeight(2.5);
    stroke(200);
    noFill();
    rect(instructions.closeButton.x, instructions.closeButton.y,
        instructions.closeButton.size, instructions.closeButton.size,
        instructions.closeButton.corner);
    fill(0);
    noStroke();
    textSize(17);
    text('X', 535, 148);

    textSize(12);
    text('<--  Click on the left arrow', 195, 485);
    textSize(20);
    text("Enjoy The Game!!", 290, 440);


    noStroke();

    // green bird
    // wing
    fill("#941212");
    triangle(
        352, 385,
        328, 380,
        335, 390
    );

    fill("#1a8f14");
    ellipse(372, 385, 50, 30);

    // Beak
    fill("#bd660f");
    triangle(
        407, 385,
        391, 378.2,
        391, 391.8
    );
    fill("#941212");
    triangle(
        373.33, 385,
        358.73, 380,
        365.73, 390
    );

    // Eye
    fill(0);
    ellipse(383, 383, 4, 4);


    noStroke();

    // yellow bird
    fill("#fcec35");
    triangle(294, 265, 273, 260, 280, 270);
    ellipse(310, 265, 40);

    fill("#f0c330");
    triangle(
        338, 265,
        324, 257,
        324, 273
    );

    fill(0);
    ellipse(316.67, 260, 4, 4);

    pop();
}

// fly systems
/**
 * Updates all flies
 */
function updateFlies() { // update fly position
    flies.forEach((fly) => {
        // this fly only appears at night (after the transparency of the sky is more than 70)
        if (fly.spawnsAtNight) {
            fly.active = sky.fill.transparency > 70;
        }

        if (fly.active) {
            moveFly(fly);
            checkTongueCollision(fly, 'fly');
        }
    });
}

/**
 * Moves a fly according to its speed
 */
function moveFly(fly) {
    fly.x += fly.speed;

    if (fly.wave) {
        fly.y = fly.startY + sin(fly.x * fly.waveSpeed) * fly.waveAmplitude;
    }

    if (fly.x > width) resetFly(fly);
}

/**
 * Resets a fly to the left
 */
function resetFly(fly) {
    fly.x = 0;
    fly.y = random(0, fly.spawnsAtNight ? 400 : 300);
    fly.startY = fly.y;
    fly.size = random(8, 12);
}

/**
 * Draws a fly with wings
 */
function drawFly(fly) {
    push();
    noStroke();
    fill("#000000");
    ellipse(fly.x, fly.y, fly.size);

    fill(200);
    ellipse(fly.x - fly.size * 0.5, fly.y - fly.size * 0.5, fly.size * 0.8, fly.size * 0.4);
    ellipse(fly.x + fly.size * 0.5, fly.y - fly.size * 0.5, fly.size * 0.8, fly.size * 0.4);
    pop();
}


/**
 * Moves a bird horizontally
 */
function moveBird(bird) {
    bird.x += bird.speed;
    if (bird.x > width) resetBird(bird);
}

/**
 * Resets a bird to the left
 */
function resetBird(bird) {
    bird.x = 0;
    bird.y = random(0, 300);
}

/**
 * Draws a bird
 */
function drawBird(bird) {
    push();
    noStroke();

    fill("#fcec35");
    triangle(
        bird.x - bird.size / 2.5, bird.y,
        bird.x - bird.size / 2 - 17, bird.y - 5,
        bird.x - bird.size / 2 - 10, bird.y + 5
    );

    ellipse(bird.x, bird.y, bird.size);

    fill("#f0c330");
    triangle(
        bird.x + bird.size * 0.7, bird.y,
        bird.x + bird.size * 0.35, bird.y - bird.size * 0.2,
        bird.x + bird.size * 0.35, bird.y + bird.size * 0.2
    );

    fill(0);
    ellipse(bird.x + bird.size / 6, bird.y - bird.size / 8, bird.size / 10);
    pop();
}


/**
 * Checks if the tongue collides with an entity
 */
function checkTongueCollision(entity, type) {
    const d = dist(frog.tongue.x, frog.tongue.y, entity.x, entity.y);
    const hit = d < frog.tongue.size / 2 + entity.size / 2;

    // effects when the frog collides with (eats) each entity (flies, birds, rain flies)
    if (hit) {
        // tongue speed goes up every time the frog eats a fly (min: 10, max: 25)
        // resets the fly
        // timer for when the fly last ate resets
        if (type === 'fly') {
            resetFly(entity);
            frog.tongue.speed = constrain(frog.tongue.speed + 1, 10, 25);
            lastEatenTime = millis();
            // tongue speed slows down to 10 if the frog eats a bird
            // resets the bird
            // if the frog eats a bird it gets hurt
        } else if (type === 'bird') {
            resetBird(entity);
            frog.tongue.speed = 10;
            damageFrog();

            // tongue speed goes up every time the frog eats a fly (min: 10, max: 25)
            // resets the fly
            // timer for when the fly last ate resets
        } else if (type === 'rainfly') {
            resetRainFly(entity);
            frog.tongue.speed = constrain(frog.tongue.speed + 1, 10, 25);
            lastEatenTime = millis();
        }
        // if the frog eats green bird, it changed colors to turquoise
        // if the frog is turquoise green bird is not visible
        // frog goes back to healhty color after 10 seconds
        else if (type === 'greenbird') {
            resetGreenBird(entity);
            lastEatenTime = millis();
            frog.currentColor = frog.colors.green;
            setTimeout(() => {
                frog.currentColor = frog.colors.healthy;
            }, 10000);
        }
        frog.tongue.state = "inbound";
    }
}

/**
 * Damages the frog when it eats a bird
 */
function damageFrog() {
    // the frog changes colors when it gets hurts (darker = closer to death)
    // the frog starts healing after 5 seconds
    if (frog.currentColor === frog.colors.healthy) {
        frog.currentColor = frog.colors.damaged;
        setTimeout(() => {
            if (frog.currentColor === frog.colors.damaged) {
                frog.currentColor = frog.colors.healthy;
            }
        }, 5000);
    } else if (frog.currentColor === frog.colors.damaged) {
        frog.currentColor = frog.colors.dying;
        setTimeout(() => {
            if (frog.currentColor === frog.colors.dying) {
                frog.currentColor = frog.colors.damaged;
                setTimeout(() => {
                    if (frog.currentColor === frog.colors.damaged) {
                        frog.currentColor = frog.colors.healthy;
                    }
                }, 5000);
            }
        }, 5000);
    } else if (frog.currentColor === frog.colors.dying) {
        frog.currentColor = frog.colors.dead;
    }
}

/**
 * Checks if the frog is starving
 */
function checkStarvation() {
    // if the frog did not eat for 3 seconds, it gets hurt (changes colors)
    // if the frog gets hurt this way, it cannot heal on its own
    const timeSinceEaten = millis() - lastEatenTime;

    if (timeSinceEaten > 3000) {
        if (frog.currentColor === frog.colors.healthy) {
            frog.currentColor = frog.colors.damaged;
            lastEatenTime = millis();
        } else if (frog.currentColor === frog.colors.damaged) {
            frog.currentColor = frog.colors.dying;
            lastEatenTime = millis();
        } else if (frog.currentColor === frog.colors.dying) {
            frog.currentColor = frog.colors.dead;
        }
    }
}


/**
 * Updates the flashlight position and visibility
 */
function showFlashlight() {
    // flashlight only appears when the transparency of the sky is more than 110
    flashlight.active = sky.fill.transparency > 110;

    // changes every 60 frames to a random position between the height of 300 and 500
    if (flashlight.active && frameCount % 60 === 0) {
        flashlight.x = random(width);
        flashlight.y = random(300, 550);
    }
}

/**
 * Draws the flashlight
 */
function drawFlashlight() {
    push();
    noStroke();
    fill(flashlight.color);
    circle(flashlight.x, flashlight.y, flashlight.size);
    pop();
}

/**
 * Checks if the flashlight hits the frog
 */
// if the flashlight hits the frog, it dies
// if the flashlight hits the frog when it is turquoise, it does nothing
function checkFlashlightCollision() {
    const d = dist(flashlight.x, flashlight.y, frog.body.x, frog.body.y);
    if (d < flashlight.size / 2 + frog.body.size / 2 && frog.currentColor === frog.colors.green) {
        frog.currentColor = frog.colors.green;
    }
    else if (d < flashlight.size / 2 + frog.body.size / 2) {
        frog.currentColor = frog.colors.dead;
    }
}


/**
 * Draws the frog (tongue and body)
 */
function drawFrog() {
    // draws tongue
    push();
    fill("#ff0000");
    noStroke();
    ellipse(frog.tongue.x, frog.tongue.y, frog.tongue.size);
    stroke("#ff0000");
    strokeWeight(frog.tongue.size);
    line(frog.tongue.x, frog.tongue.y, frog.body.x, frog.body.y);
    pop();

    // body
    push();
    fill(frog.currentColor);
    noStroke();
    ellipse(frog.body.x, frog.body.y, frog.body.size);

    // eyes
    let eyeOffsetX = frog.body.size * 0.3;
    let eyeOffsetY = frog.body.size * 0.4;
    let eyeSize = frog.body.size * 0.25;

    fill(255);
    ellipse(frog.body.x - eyeOffsetX, frog.body.y - eyeOffsetY, eyeSize);
    ellipse(frog.body.x + eyeOffsetX, frog.body.y - eyeOffsetY, eyeSize);

    fill(0);
    let pupilSize = eyeSize * 0.4;
    ellipse(frog.body.x - eyeOffsetX, frog.body.y - eyeOffsetY, pupilSize);
    ellipse(frog.body.x + eyeOffsetX, frog.body.y - eyeOffsetY, pupilSize);
    pop();

    // makes sure the frog cannot go off the canvas and updates the tongue position
    if (state === 'GAME' || state === 'MENU') {
        frog.body.x = constrain(mouseX, frog.body.size / 16, width - frog.body.size / 16);
        updateTongue();
    }
}

/**
 * Handles moving the tongue based on its state
 */
function updateTongue() {
    frog.tongue.x = frog.body.x;

    if (frog.tongue.state === "outbound") {
        frog.tongue.y -= frog.tongue.speed;
        // If the tongue reaches the top of the screen, it comes back down
        if (frog.tongue.y <= 0) frog.tongue.state = "inbound";
    } else if (frog.tongue.state === "inbound") {
        frog.tongue.y += frog.tongue.speed;
        if (frog.tongue.y >= height) frog.tongue.state = "idle";
    }
}

/**
 * Updates the sky color and darkness
 */
function updateSky() {
    if (sky.isNight) { // if the value of g is smaller or equal to 85, it is daytime
        sky.fill.r -= sky.change;
        sky.fill.g -= sky.change;
        sky.fill.b += sky.change;
        if (sky.fill.g <= 85) {
            sky.fill.g = 85;
            sky.isNight = false;
        }
    } else { // if the value of g is bigger or equal to 207, it is nighttime
        sky.fill.r += sky.change;
        sky.fill.g += sky.change;
        sky.fill.b -= sky.change;
        if (sky.fill.g >= 207) {
            sky.fill.g = 207;
            sky.isNight = true;
        }
    }

    // black rectangle on top of everything to give the illusion of darkness at night
    push();
    noStroke();
    fill(0, sky.fill.transparency);
    rect(0, 0, 700, 550);
    pop();

    // if the transparency of the sky is greater or equal to 220, it shifts to nighttime
    if (sky.isNight) {
        sky.fill.transparency += sky.change;
        if (sky.fill.transparency >= 220) {
            sky.fill.transparency = 220;
            sky.isNight = false;
        }
    } else {
        // if the transparency of the sky is lower or equal to 0, it shifts to daytime
        sky.fill.transparency -= sky.change;
        if (sky.fill.transparency <= 0) {
            sky.fill.transparency = 0;
            sky.isNight = true;
        }
    }
}

/**
 * Updates the progress through the day/night cycle
 */
function updateProgress() {
    // If the value of g is lower or equal to 85, the sky gets brighter
    if (sky.fill.g <= 85) {
        sky.direction = 1;
    } else if (startTime > 0 && sky.fill.g >= 207) {
        // If the value of g is greater or equal to 207, the sky gets darker
        sky.direction = -1;
        dayCount++; // increase the number of days
    }

    // define g as green is the sky color
    let g = sky.fill.g;

    // When the sky gets darker, progress moves from 0 to 0.5
    // When the sky gets brighter, progress moves from 0.5 to 1 (a full rotation)
    if (sky.direction === -1) {
        progress = (207 - g) / 244;
    } else {
        progress = (g - 85) / 244 + 0.5;
    }
}

/**
 * Draws background clouds (original 3)
 */
function drawBackgroundClouds() {
    noStroke();
    fill(sky.cloudColor);

    clouds.forEach(cloudGroup => {
        cloudGroup.forEach(cloud => {
            ellipse(cloud[0], cloud[1], cloud[2], cloud[3]);
        });
    });
    if (clouds.length + dynamicClouds.length >= 7) {
        fadeDirection = 1;
    } else {
        fadeDirection = -1;
    }
    cloudFade += 0.01 * fadeDirection;
    cloudFade = constrain(cloudFade, 0, 1);

    sky.cloudColor = lerpColor(color(255), color(200), cloudFade);

}

/**
 * Draws foreground clouds (clicked clouds)
 */
function drawForegroundClouds() {
    noStroke();
    fill(sky.cloudColor);

    dynamicClouds.forEach(cloudGroup => {
        cloudGroup.forEach(cloud => {
            ellipse(cloud[0], cloud[1], cloud[2], cloud[3]);
        });
    });
}

/**
 * Draws the water layer behind the frog
 */
function drawBehindWater() {
    push();
    noStroke();
    fill("#28ebe0");
    // custom shape
    beginShape();
    //wave and movement of the water in front of the frog
    for (let x = 0; x <= width; x += 10) {
        let y = 485 + sin(x * 3 - frameCount * 3) * 10;
        vertex(x, y);
    }
    vertex(width, height);
    vertex(0, height);
    endShape(CLOSE);
    pop();
}

/**
 * Draws the animated water
 */
function drawWater() {
    push();
    noStroke();
    fill("#0fcffa");
    // custom shape
    beginShape();
    //wave and movement of the water in front of the frog
    for (let x = 0; x <= width; x += 10) {
        let y = 495 + sin(x * 3 + frameCount * 3) * 10;
        vertex(x, y);
    }
    vertex(width, height);
    vertex(0, height);
    endShape(CLOSE);
    pop();
}

/**
 * Draws the progress ring
 */
function drawProgressRing() {
    push();
    stroke(progressRing.fill.background);
    strokeWeight(progressRing.strokeWeight);
    noFill();
    // draws the shpae of the progress ring (white)
    ellipse(progressRing.x, progressRing.y, progressRing.radius * 2, progressRing.radius * 2);

    stroke(progressRing.fill.progress.r, progressRing.fill.progress.g, progressRing.fill.progress.b);
    strokeCap(SQUARE); // Makes the ends of the arc have a flat shape
    // Converts the progress value (0–1) into a full-circle angle starting from the top
    let endAngle = -90 + progress * 360;
    arc(progressRing.x, progressRing.y, progressRing.radius * 2, progressRing.radius * 2, -90, endAngle);
    pop();
}

/**
 * Draws the day counter
 */
function drawDayCounter() {
    push();
    fill(0);
    noStroke();
    textSize(12);
    textAlign(CENTER, CENTER);
    text("DAY " + dayCount, 85, 40);
    pop();
}

// drawing all the elements that will appear in the win state
function win() {
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

// drawing all the elements that will appear in the game over state
function end() {
    push();
    // draws the text that is centered
    noStroke();
    fill(0);
    rect(0, 0, width, height);

    strokeWeight(3);
    stroke("#00ff00");
    textAlign(CENTER, CENTER);
    textSize(50);
    textStyle(BOLD);
    text('**Game Over**', width / 2, height / 2);

    // display final day count
    fill(255);
    noStroke();
    textSize(50);
    text("DAY " + finalDayCount, width / 2, 200);

    drawDeadFrogIcon();
    pop();
}

/**
 * Draws the dead frog icon on the game over screen
 */
function drawDeadFrogIcon() {
    push();
    // write the text for game end state (subtitle)
    textSize(20);
    fill(255);
    strokeWeight(5);
    stroke(235, 183, 14);
    text("(Summer Edition!! ☀️)", 350, 130);

    // draws the dead frog icon
    noStroke();
    fill(255);
    circle(width / 2, height / 1.5, 80);
    fill("#00ff00");
    circle(width / 2, height / 1.47, 45);
    circle(width / 2.1, height / 1.56, 20);
    circle(width / 1.915, height / 1.56, 20);

    // eyes
    fill(0);
    textSize(13);
    text("X", width / 2.1, height / 1.55);
    text("X", width / 1.915, height / 1.55);

    // tongue
    fill("#ff0000");
    ellipse(width / 1.95, height / 1.45, 5, 20);

    // body
    fill(0);
    rect(width / 2.1, height / 1.47, 32, 2);
    fill("#00ff00");
    rect(width / 2.1, height / 1.49, 32, 5);
    pop();
}

// draw raindrops (color, size, position)
function dropRain(raindrop) {
    noStroke();
    fill(158, 239, 255);
    ellipse(raindrop.x, raindrop.y, 2, raindrop.length);
    raindrop.y = raindrop.y + 4;

    if (raindrop.y > 520) {
        raindrop.length = raindrop.length - 5;
    }
    if (raindrop.length < 0) {
        raindrop.length = 0;
    }
}

// draws the splash of the raindrop (when it hits the water)
function splash(raindrop) {
    strokeWeight(2);
    stroke(190, 224, 237, raindrop.opacity);
    noFill();

    if (raindrop.y > 520) {
        ellipse(raindrop.x, 530, raindrop.radius * 2, raindrop.radius / 2);
        raindrop.radius++;
        raindrop.opacity = raindrop.opacity - 10;

        if (raindrop.opacity < 0) {
            raindrop.x = random(0, width);
            raindrop.y = random(0, -100);
            raindrop.length = 15;
            raindrop.radius = 0;
            raindrop.opacity = 200;
        }
    }
}

// when there are enough clouds, raining now is true
function drawDropNumber() {

    if (clouds.length + dynamicClouds.length >= 7) {
        rainingNow = true;
    } else {
        rainingNow = false;
    }

    if (rainingNow == true) {
        for (let i = 0; i < rain.length; i++) {
            dropRain(rain[i]);
            splash(rain[i]);
        }
    }
}

// creates lilypads
function drawLilyPad() {
    push();
    noStroke();
    fill(54, 163, 29);

    // makes the lilypads move on the water
    let wave1 = sin(frameCount * 1) * 5;
    let wave2 = sin(frameCount * 2 + 20) * 3;
    let wave3 = sin(frameCount * 3 + 40) * 3;
    let wave4 = sin(frameCount * 2 + 60) * 3;
    let wave5 = sin(frameCount * 3.5 + 80) * 5;
    let wave6 = sin(frameCount * 3 + 20) * 4;

    ellipse(390, 540 + wave1, 40, 10);
    ellipse(80, 525 + wave2, 60, 10);
    arc(465, 525 + wave3, 90, 20, 90, 10);
    arc(600, 530 + wave4, 60, 10, 0, 270);
    arc(200, 540 + wave5, 60, 10, 90, 360);
    arc(300, 530 + wave6, 40, 7, 270, 180);
    pop();
}

// creates green bird
function drawGreenBird(greenBird) {
    push();
    noStroke();
    // wing
    fill("#941212");
    triangle(
        greenBird.x - greenBird.size / 2.5 - 7, greenBird.y,
        greenBird.x - greenBird.size / 2 - 27, greenBird.y - 5,
        greenBird.x - greenBird.size / 2 - 20, greenBird.y + 5
    );

    fill("#1a8f14"); // body color
    ellipse(greenBird.x - 3, greenBird.y, 50, 30);

    // beak
    fill("#bd660f");
    triangle(
        greenBird.x + greenBird.size * 0.8, greenBird.y,
        greenBird.x + greenBird.size * 0.4, greenBird.y - greenBird.size * 0.17,
        greenBird.x + greenBird.size * 0.4, greenBird.y + greenBird.size * 0.17
    );

    // tail
    fill("#941212");
    triangle(
        greenBird.x - greenBird.size / 6 - 3 + 8, greenBird.y,
        greenBird.x - greenBird.size / 5.5 - 17 + 8, greenBird.y - 5,
        greenBird.x - greenBird.size / 5.5 - 10 + 8, greenBird.y + 5
    );

    fill(0);
    ellipse(greenBird.x + greenBird.size / 5, greenBird.y - greenBird.size / 10 + 2, greenBird.size / 10);
    pop();
}

//moving green bird
function moveGreenBird(greenBird) {
    greenBird.x += greenBird.speed;
    if (greenBird.x > width) {
        resetGreenBird(greenBird);
    }
}

// resets green bird when it goes off screen
function resetGreenBird(greenBird) {
    greenBird.x = 0;
    greenBird.y = random(100, 300);
}
