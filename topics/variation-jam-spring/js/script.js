/**
 * Variation Jam : Life as a Frog (Spring Edition!)
 * Yaxuan Pang
 * 
 * A game of catching flies with the frog's tongue. 
 * It portrays a semi-realistic life of a frog.
 * 
 * Instructions:
 * - Click on the white square for instructions and game modes
 * - Move the frog with your mouse
 * - Click space to launch the tongue to catch flies and flowers
 * - Eat the special fly to unlock special abilities
 * 
 * Made with p5
 * https://p5js.org/
 */

"use strict";

// defining arrays and variables
const clouds = []; // cloud array
const flies = []; //flies array
let flowers = []; // flower array
let state = "MENU"; // MENU, GAME, WIN, END

// the instructions pages are not visible at first
let showInstructions = false;
let showSecondPage = false;
let showThirdPage = false;

let dayCount = 0; // day count starts at 0 (goes to 1 when the game starts)
let finalDayCount = 0; // final day count starts at 0
let progress = 0; // progress starts at 0
let startTime = 0; // timer since the start of the game starts at 0
let lastEatenTime = 0; // timer for when the frog last ate starts at 0
let endTimerStarted = false; // timer for the end starts off as false
let showPinkFly = true; // pink fly is visible at the beggining

// sky parameters (color, transparency)
const sky = {
    fill: {
        r: 135,
        g: 207,
        b: 235,
        transparency: 0,
    },
    change: 0.055, // amount added or subtracted to the value of sky color every frame
    isNight: false,  // game starts during the day (not nighttime)(shifting to nighttime)
    direction: -1, // direction of color change
    cloudColor: 255, // color of the clouds
};

// frog parameters
const frog = {
    body: { //position and size
        x: 320,
        y: 520,
        size: 150,
    },
    tongue: { // tongue parameters
        x: undefined,
        y: 480,
        size: 20,
        speed: 10,
        state: "idle", // idle, outbound, inbound
    }, // frog colors
    colors: {
        healthy: "#5bff45",
        damaged: "#6e8514",
        dying: "#855214",
        dead: "#4f2409",
        pink: "#ffa6f6",
    },
    currentColor: "#5bff45",
};

// bird array and parameters (x, y, size, speed if the bird is visible)
const birds = [
    {
        x: 0,
        y: 200,
        size: 40,
        speed: 2,
        active: true,// bird is always visible
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
        y: 400,
        size: 40,
        speed: 3,
        active: false, // bird is not visible
    },
];

const smallBirds = [
    {
        x: 0,
        y: 200,
        size: 30,
        speed: 2,
        active: true, // small birds appears later
    },
    {
        x: 0,
        y: 400,
        size: 30,
        speed: 2.5,
        active: false, // small bird appears later
        spawnsInDay: true, // small bird is visible
    },
];

// flashlight parameters (x, y, size, speed, visible and color)
const flashlight = {
    x: 350,
    y: 275,
    size: 150,
    color: null,
    active: false,
};

// cloud positions
// Cloud 1 - left side
clouds.push(
    createCloud(
        [
            [130, 300, 60, 40],
            [120, 260, 60, 60],
            [170, 280, 70, 70],
            [80, 290, 60, 60],
            [50, 300, 40, 40],
            [210, 300, 40, 40],
        ],
        1
    )
);

// Cloud 2 - top right
clouds.push(
    createCloud(
        [
            [550, 100, 60, 40],
            [540, 60, 60, 60],
            [590, 80, 70, 70],
            [500, 90, 60, 60],
            [470, 100, 40, 40],
            [630, 100, 40, 40],
        ],
        1
    )
);

// Cloud 3 - bottom right
clouds.push(
    createCloud(
        [
            [565, 375, 50, 30],
            [625, 375, 20, 20],
            [565, 355, 55, 55],
            [530, 370, 40, 40],
            [510, 375, 30, 30],
            [600, 370, 40, 40],
        ],
        1
    )
);

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
            b: 0,
        },
    },
};

// visual effects for the title
const titleEffect = {
    strokeColor: null,
    strokeFill: null,
};

// instruction box parameters
const instructions = {
    x: 180,
    y: 130,
    w: 380,
    h: 370,
    corner: 15, // round the corners
    closeButton: { // close button paramters
        x: 523.5,
        y: 130,
        size: 35,
        corner: 10, // round the corners
    },
};

// menu button parameters (position, size)
const menuButton = {
    x: 340,
    y: 275,
    size: 40,
};

// array for water flowers (flowers on the water) (position, size, movement speed, wave height)
const waterFlowerArray = [
    { x: 550, size: 0.5, baseY: 530, flowSpeed: 0.9, flowAmount: 6 },
    { x: 300, size: 0.7, baseY: 535, flowSpeed: 1.2, flowAmount: 7 },
    { x: 250, size: 0.3, baseY: 520, flowSpeed: 0.8, flowAmount: 5 },
    { x: 90, size: 0.4, baseY: 540, flowSpeed: 0.6, flowAmount: 6 },
    { x: 510, size: 0.3, baseY: 540, flowSpeed: 0.7, flowAmount: 5 },
    { x: 350, size: 0.4, baseY: 535, flowSpeed: 0.7, flowAmount: 5 },
    { x: 430, size: 0.25, baseY: 525, flowSpeed: 1, flowAmount: 5 },
    { x: 120, size: 0.25, baseY: 525, flowSpeed: 0.5, flowAmount: 8 },
    { x: 650, size: 0.2, baseY: 530, flowSpeed: 0.5, flowAmount: 8 },
    { x: 40, size: 0.2, baseY: 520, flowSpeed: 0.5, flowAmount: 8 },
];

// array of petals for the flowers
const petals = [
    [0, 10],
    [13, -8],
    [-13, -8],
    [22, 3],
    [-22, 3],
];

// pink fly parameter (position, size, speed)
const pinkFly = {
    x: 0,
    y: 200,
    startY: 200,
    size: 10,
    speed: 3
};


// Create the canvas, set an angle mode and initialize entities (birds, flies and flashlight)
function setup() {
    createCanvas(700, 550); // canvas size
    angleMode(DEGREES); // angle mode is in degrees

    // draw the flies (fly position, size, if they appear during the day or at night)
    flies.push(createFly(0, 300, 12, 5, true, true, 1.5, 50));
    flies.push(createFly(0, 300, 10, 4, false, false, 0, 0, true));
    flies.push(createFly(0, 100, 12, 3.5, true, true, 4, 10));

    // colors for the title
    titleEffect.strokeColor = color(random(255));
    titleEffect.strokeFill = color(5, random(255), random(255));
    flashlight.color = color(245, 218, 42, 200);

    // Initialize all entities
    flies.forEach((fly) => resetFly(fly));
    birds.forEach((bird) => resetBird(bird));
    smallBirds.forEach((sb) => resetSmallBird(sb));

    // initialize the flowers and reset the pink fly
    createFlowers();
    resetPinkFly();

    // position of the flashlight
    flashlight.x = width / 2;
    flashlight.y = height / 2;
}

// drawing the canvas and the game states (menu, game, win, end)

function draw() {
    if (state === "MENU") {
        menu();
    } else if (state === "GAME") {
        game();
    } else if (state === "WIN") {
        win();
    } else if (state === "END") {
        end();
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
            showThirdPage = false;
        }
        else if (showSecondPage) { //(shows third page)
            showInstructions = false;
            showSecondPage = false;
            showThirdPage = true;
        }
    }


    if (event.keyCode === 37) { // left arrow (shows second page)
        if (showThirdPage) {
            showThirdPage = false;
            showSecondPage = true;
            showInstructions = false;
        }
        else if (showSecondPage) { //(shows first page)
            showSecondPage = false;
            showInstructions = true;
            showThirdPage = false;
        }
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
            showThirdPage = false;
        }
    }
}

// drawing all the elements that will appear in the menu state

function menu() {
    background(sky.fill.r, sky.fill.g, sky.fill.b);

    moveMenuFrog();

    drawClouds();
    drawBehindWater();
    drawMenuBird();

    updateBirds(0); // move birds
    updateSmallBirds(0); // moves small birds
    updateFlies(0); // move flies

    flies.forEach((fly) => {
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

    // if show pink fly is true, draw and move pink fly
    if (showPinkFly === true) {
        drawPinkFly();
        movePinkFly();
    }

    drawFrog();
    drawWater();
    drawMenuText();
    drawProgressRing();
    drawDayCounter();
    waterFlowers();

    // if show instructions is true, draw each instruction page
    if (showInstructions === true) {
        drawInstructions();
    }
    if (showSecondPage === true) {
        drawSecondPage();
    }
    if (showThirdPage === true) {
        drawThirdPage();
    }
}

// drawing all the elements that will appear in the game state
function game() {
    background(sky.fill.r, sky.fill.g, sky.fill.b);

    // start time starts in game state
    const timePassed = millis() - startTime;

    // Draw environment
    drawClouds();
    drawBehindWater();

    // Update and draw game entities
    updateFlies();
    updateBirds(timePassed);
    updateSmallBirds(timePassed);
    showFlashlight();

    // Draw entities and the frog
    flies.forEach((fly) => {
        if (fly.active) drawFly(fly);
    });
    birds.forEach((bird) => {
        if (bird.active) drawBird(bird);
    });

    // make sure the pink fly can be eaten by the frog, move and draw pink fly is show pink fly is true
    if (showPinkFly === true) {
        drawPinkFly();
        movePinkFly();
        checkTongueCollision(pinkFly, "pinkFly");
    }

    drawFrog();
    resetFlowers();
    drawWater();
    waterFlowers();

    // Update game mechanics
    updateSky();
    updateProgress();
    if (timePassed > 3000) checkStarvation();

    if (flashlight.active) {
        drawFlashlight();
        checkFlashlightCollision();
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
        setTimeout(() => {
            state = "END"; // if the forg is dead, it goes to game over page in half a second
        }, 500);
    }

    if (dayCount === 3) {
        state = "WIN"; // if the frog survived 3 days, the player wins the game
    }
}

//create a cloud with position and size
function createCloud(newcloud, size = 1) {
    const cloud = [];
    newcloud.forEach((newcloud) => {
        cloud.push([
            newcloud[0] * size,
            newcloud[1] * size,
            newcloud[2] * size,
            newcloud[3] * size,
        ]);
    });
    return cloud;
}

function resetSmallBird(smallBird) {
    smallBird.x = 0;
    smallBird.y = random(0, 300);
}
function moveSmallBird(smallBird) {
    smallBird.x += smallBird.speed;
    if (smallBird.x > width) resetSmallBird(smallBird);
}

function updateSmallBirds(timePassed) {
    smallBirds.forEach((smallBird, index) => {
        if (index === 0) smallBird.active = sky.fill.transparency < 100;
        if (index === 1) smallBird.active = timePassed > 5000;
        if (index === 2) smallBird.active = timePassed > 15000;

        if (smallBird.active) {
            moveSmallBird(smallBird);
            drawSmallBird(smallBird);
            checkTongueCollision(smallBird, "smallBird");
        }
    });
}

function drawSmallBird(b) {
    push();
    noStroke();
    fill("#f5d311");
    triangle(
        b.x - b.size / 2.5,
        b.y,
        b.x - b.size / 2 - 17,
        b.y - 5,
        b.x - b.size / 2 - 10,
        b.y + 5
    );
    ellipse(b.x, b.y, b.size);
    fill("#dead10");
    triangle(
        b.x + b.size * 0.7,
        b.y,
        b.x + b.size * 0.35,
        b.y - b.size * 0.2,
        b.x + b.size * 0.35,
        b.y + b.size * 0.2
    );
    fill(0);
    ellipse(b.x + b.size / 6, b.y - b.size / 8, b.size / 10);
    pop();
}
function waterFlowers() {
    waterFlowerArray.forEach((flower) => {
        // Calculate flowing offset using sine wave (in degrees)
        let angle = (frameCount * flower.flowSpeed) % 360;
        flower.y = flower.baseY + sin(angle) * flower.flowAmount;
        drawWaterFlower(flower.x, flower.y, flower.size);
    });
}

function drawWaterFlower(cx, cy, size) {
    push();
    translate(cx, cy);

    const petals = [
        [0, 10],
        [13, -8],
        [-13, -8],
        [22, 3],
        [-22, 3],
    ];

    fill(255, 209, 220);
    noStroke();

    for (let i = 0; i < petals.length; i++) {
        ellipse(petals[i][0] * size, petals[i][1] * size, 25 * size, 10 * size);
    }

    // Center
    fill(255, 255, 150);
    ellipse(0, 0, 25 * size, 10 * size);

    pop();
}

function drawFlower(cx, cy, angle, size) {
    push();
    translate(cx, cy);
    rotate(angle); // This will now work properly with degrees

    const petalCount = 5;
    const petalRadius = 19 * size;
    const petalSize = 22 * size;

    fill(255, 209, 220);
    noStroke();

    for (let i = 0; i < petalCount; i++) {
        let a = (360 / petalCount) * i;
        let px = cos(a) * petalRadius;
        let py = sin(a) * petalRadius;

        ellipse(px, py, petalSize);
    }

    fill(255, 255, 150);
    ellipse(0, 0, 20 * size);

    pop();
}

function createFlowers() {
    for (let i = 0; i < 6; i++) {
        flowers.push({
            x: random(width),
            y: random(-300, -20),
            speed: random(1, 3),
            angle: random(360),
            rotationSpeed: random(1, 3),
            size: random(0.3, 0.6),
            collisionSize: 20,
        });
    }
}

function resetFlowers() {
    flowers.forEach((flower) => {
        flower.y += flower.speed;
        flower.angle += flower.rotationSpeed;

        // Reset if off-screen
        if (flower.y > height + 30) {
            flower.y = random(-200, -50);
            flower.x = random(width);
            flower.size = random(0.3, 0.6);
            flower.speed = random(1, 3);
            flower.rotationSpeed = random(1, 3);
            flower.angle = random(360);
        }

        drawFlower(flower.x, flower.y, flower.angle, flower.size);

        flower.radius = 20;

        checkTongueCollision(flower, "flower");
    });
}

//create the flies (position, size, speed, if its visible during the day or at night, wave speed, height of the wave)
function createFly(
    x,
    y,
    size,
    speed,
    active,
    wave,
    waveSpeed = 0,
    waveAmplitude = 0,
    spawnsAtNight = false
) {
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
        spawnsAtNight: spawnsAtNight,
    };
}

// moves the frog
function moveMenuFrog() {
    frog.x = mouseX;
}

// draws and moves the bird in menu (also makes sure it is visible)
function drawMenuBird() {
    let b = birds[0]; // use the first bird only for menu
    b.active = true;
    moveBird(b);
    drawBird(b);
}

// draws the small bird in menu (also makes sure it is visible)
function drawSmallMenuBird() {
    let sb = smallBirds[0];
    sb.active = true;
    moveSmallBird(sb);
    drawSmallBird(sb);
}

// updates the bird's position
function updateBirds(timePassed) {
    birds.forEach((bird, index) => {

        // first bird is visible when transparency is lower than 100
        if (index === 0) {
            bird.active = sky.fill.transparency < 100;
        }

        // second bird appears 3 second later
        if (index === 1) {
            bird.active = timePassed > 3000;
        }

        // third bird appears 10 second later
        if (index === 2) {
            bird.active = timePassed > 10000;
        }

        // if the birds are visible, move them and make sure the frog can eat the birds
        if (bird.active) {
            moveBird(bird);
            checkTongueCollision(bird, "bird");
        }
    });
}

/**
 *  Draws the menu text, title and subtitles
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
    stroke(255, 158, 234);
    text("(Spring Edition!! 🌸)", 350, 250);

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

        // if the flies are visible move them and make sure the frog can eat flies
        if (fly.active) {
            moveFly(fly);
            checkTongueCollision(fly, "fly");
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
 * Resets a fly to the left with random properties
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

/**
 * Checks if the tongue collides with an entity
 */
function checkTongueCollision(entity, type) {
    // Determine collision size
    let entitySize = entity.size;
    if (type === "flower") {
        if (entity.collisionSize) {
            entitySize = entity.collisionSize;
        }
    }

    const d = dist(frog.tongue.x, frog.tongue.y, entity.x, entity.y);
    const hit = d < frog.tongue.size / 2 + entitySize / 2;

    // effects when the frog collides with (eats) each entity (flies, birds, brown fly)
    if (hit) {
        // tongue speed goes up every time the frog eats a fly (min: 10, max: 25)
        // resets the fly
        // timer for when the fly last ate resets
        if (type === "fly") {
            resetFly(entity);
            frog.tongue.speed = constrain(frog.tongue.speed + 1, 10, 25);
            lastEatenTime = millis();
        }

        // tongue speed slows down to 10 if the frog eats a bird
        // resets the bird
        // if the bird eats a bird it gets hurt
        if (type === "bird") {
            resetBird(entity);
            frog.tongue.speed = 10;
            damageFrog();
        }

        // flower rotation, angle, position, size and speed
        if (type === "flower") {
            entity.y = random(-200, -50);
            entity.x = random(width);
            entity.size = random(0.3, 0.6);
            entity.speed = random(1, 3);
            entity.rotationSpeed = random(1, 3);
            entity.angle = random(360);
            // tongue speed goes up every time the frog eats a flower (similar to the fly)
            // resets the flowers
            // timer for when the fly last ate resets
            frog.tongue.speed = constrain(frog.tongue.speed + 1, 10, 25);
            lastEatenTime = millis();
        }
        // tongue speed slows down to 10 if the frog eats a bird
        // resets the small bird
        // if the frog eats a small bird when is nto healthy, it gets healed and the timer since last time it ate resets
        // if the frog eats a small bird when it is healthy, it gets hurt
        if (type === "smallBird") {
            resetSmallBird(entity);
            frog.tongue.speed = 10;
            if (frog.currentColor === frog.colors.healthy) {
                damageFrog();
            } else if (
                frog.currentColor === frog.colors.damaged ||
                frog.currentColor === frog.colors.dying
            ) {
                frog.currentColor = frog.colors.healthy;
                lastEatenTime = millis();
            }
        }

        frog.tongue.state = "inbound";
    }
    if (hit) {
        // tongue speed goes up every time the frog eats a pink fly (min: 10, max: 25)
        // the pink fly does not appear again if it is eaten
        // frog turns pink and goes back to healthy color after 10 seconds
        if (type === "pinkFly") {
            showPinkFly = false;
            frog.tongue.speed = constrain(frog.tongue.speed + 1, 10, 25);

            frog.currentColor = frog.colors.pink;
            setTimeout(() => {
                frog.currentColor = frog.colors.healthy;
            }, 10000);
            frog.tongue.state = "inbound";
        }
    }
}

// moves the pink fly
function movePinkFly() {
    // Move the fly
    pinkFly.x += pinkFly.speed;
    // the fly moves up and down while flying to the right
    pinkFly.y = pinkFly.startY + sin(pinkFly.x * 1.5) * 50;
    //resets the pink fly if it flies off the canvas
    if (pinkFly.x > width) {
        resetPinkFly();
    }
}

// resets the fly if it is off the canvas at a random horizontal position and a random size
function resetPinkFly() {
    pinkFly.x = 0;
    pinkFly.y = random(0, 300);
    pinkFly.startY = pinkFly.y;
    pinkFly.size = random(8, 12);
}

// check if pink fly is true
// if it is true, draw and moce pink fly
function checkPinkFly() {
    if (showPinkFly === true) {
        drawPinkFly();
        movePinkFly();
    }
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
        bird.x - bird.size / 2.5,
        bird.y,
        bird.x - bird.size / 2 - 17,
        bird.y - 5,
        bird.x - bird.size / 2 - 10,
        bird.y + 5
    );

    ellipse(bird.x, bird.y, bird.size);

    fill("#f0c330");
    triangle(
        bird.x + bird.size * 0.7,
        bird.y,
        bird.x + bird.size * 0.35,
        bird.y - bird.size * 0.2,
        bird.x + bird.size * 0.35,
        bird.y + bird.size * 0.2
    );

    fill(0);
    ellipse(bird.x + bird.size / 6, bird.y - bird.size / 8, bird.size / 10);
    pop();
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
    const timeSinceEaten = millis() - lastEatenTime; // timer for when the forg last ate

    // if the frog did not eat for 3 seconds, it gets hurt (changes colors)
    // if the frog gets hurt this way, it cannot heal on its own
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
// if the flashlight hits the frog when it is pink, it does nothing
function checkFlashlightCollision() {
    const d = dist(flashlight.x, flashlight.y, frog.body.x, frog.body.y);
    if (frog.currentColor === frog.colors.pink && d < flashlight.size / 2 + frog.body.size / 2) {
        frog.currentColor = frog.colors.pink;
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

    // draws body
    push();
    fill(frog.currentColor);
    noStroke();
    ellipse(frog.body.x, frog.body.y, frog.body.size);

    // draw eyes
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
    if (state === "GAME" || state === "MENU") {
        frog.body.x = constrain(
            mouseX,
            frog.body.size / 16,
            width - frog.body.size / 16
        );
        updateTongue();
    }
}

/**
 * Handles moving the tongue based on its state
 */
function updateTongue() {
    frog.tongue.x = frog.body.x;

    // Checks if the tongue is currently shooting upward
    if (frog.tongue.state === "outbound") {
        frog.tongue.y -= frog.tongue.speed; //Moves the tongue upward by subtracting from its y position
        // If the tongue reaches the top of the screen, it comes back down
        if (frog.tongue.y <= 0) frog.tongue.state = "inbound";
    } else if (frog.tongue.state === "inbound") {
        frog.tongue.y += frog.tongue.speed; //Move the tongue downward by adding to its y position
        if (frog.tongue.y >= height) frog.tongue.state = "idle";
    }  // If the tongue reaches the bottom again, stop it and reset to idle

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
        if (sky.direction === -1) {
            progress = (207 - g) / 244;
        } else {
            progress = (g - 85) / 244 + 0.5;
        }
    }
}

/**
 * Draws clouds in the sky
 */
function drawClouds() {
    noStroke();
    fill(sky.cloudColor);

    // draw the array of clouds
    clouds.forEach((cloudGroup) => {
        cloudGroup.forEach((cloud) => {
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
    fill("#29cde3");
    // custom shape
    beginShape();
    // wave and movement of the water behind the frog
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
    fill("#18aaf2");
    // custom shape
    beginShape();
    // wave and movement of the water in front of the frog
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
    ellipse(
        progressRing.x,
        progressRing.y,
        progressRing.radius * 2,
        progressRing.radius * 2
    );

    stroke(
        progressRing.fill.progress.r,
        progressRing.fill.progress.g,
        progressRing.fill.progress.b
    );
    strokeCap(SQUARE); // Makes the ends of the arc have a flat shape
    // Converts the progress value (0–1) into a full-circle angle starting from the top
    let endAngle = -90 + progress * 360;
    // draws the fill of the progress ring (green)
    arc(
        progressRing.x,
        progressRing.y,
        progressRing.radius * 2,
        progressRing.radius * 2,
        -90,
        endAngle
    );
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
    text("**You Win!!**", width / 2, height / 2);
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
    text("**Game Over**", width / 2, height / 2);

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
    stroke(255, 158, 234);
    text("(Spring Edition!! 🌸)", 350, 130);

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

// draws the pink fly
function drawPinkFly() {
    push();
    noStroke();
    fill("#ff8cf4");
    ellipse(pinkFly.x, pinkFly.y, pinkFly.size);

    fill(200);
    ellipse(
        pinkFly.x - pinkFly.size * 0.5,
        pinkFly.y - pinkFly.size * 0.5,
        pinkFly.size * 0.8,
        pinkFly.size * 0.4
    );
    ellipse(
        pinkFly.x + pinkFly.size * 0.5,
        pinkFly.y - pinkFly.size * 0.5,
        pinkFly.size * 0.8,
        pinkFly.size * 0.4
    );
    pop();
}

/**
 * Draws the instructions box and the instructions pages
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
    text("Instructions 🌸:", 375, 160);

    // text for the first page
    textAlign(LEFT);
    text("- Control the frog with the mouse and click", 210, 200);
    text("space to eat", 224, 220);
    text("- Eat flies or flower every 3 seconds", 210, 250);
    text("- WATCH OUT for birds and the", 210, 290);
    text("flashlight (flashlight only appears at night)", 224, 310);
    text("- The frog gets hurt if it eats the bird, but", 210, 340);
    text("the frog will start healing itself in 5 seconds", 220, 360);
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

    // close button
    strokeWeight(2.5);
    stroke(200);
    noFill();
    rect(
        instructions.closeButton.x,
        instructions.closeButton.y,
        instructions.closeButton.size,
        instructions.closeButton.size,
        instructions.closeButton.corner
    );
    // x for the close button
    fill(0);
    noStroke();
    text("X", 535, 148);

    // arrow to lead to second page
    textSize(12);
    text("Click on the right arrow  -->", 400, 485);
    pop();
}

// third instructions page
function drawThirdPage() {
    push();
    noStroke();
    fill(255);
    rect(instructions.x, instructions.y, instructions.w, instructions.h, instructions.corner);

    // text for the third page
    fill(0);
    textSize(17);
    textAlign(CENTER, CENTER);
    text('Instructions 🌸:', 375, 160);

    textAlign(LEFT);
    text('- If the frog eats the pink fly, it will become', 210, 200);
    text('invincible for 10 seconds', 224, 220);

    text("- If eaten, the pink fly will not appear again", 210, 310);


    // drawings for the third page
    // frogs
    fill(frog.colors.healthy);
    arc(230, 280, 50, 50, 180, 0);
    circle(217, 257, 15);
    circle(243, 257, 15);
    fill(255);
    circle(217, 257, 10);
    circle(243, 257, 10);
    fill(0);
    circle(217, 257, 3);
    circle(243, 257, 3);

    fill(frog.colors.pink);
    arc(430, 280, 50, 50, 180, 0);
    circle(417, 257, 15);
    circle(443, 257, 15);
    fill(255);
    circle(417, 257, 10);
    circle(443, 257, 10);
    fill(0);
    circle(417, 257, 3);
    circle(443, 257, 3);


    textSize(10);
    text('+', 270, 265);
    text('-->', 360, 265);

    // small bird
    fill("#f5d311");
    circle(440, 375, 25);
    triangle(430, 375, 410, 370, 420, 380);
    fill("#dead10");
    triangle(447, 369, 447, 381, 458, 375);
    fill(0);
    circle(443, 372, 3);

    text('(This is a small bird)', 395, 405);

    // bird
    fill("#fcec35");
    triangle(310, 370, 290, 365, 300, 375);
    ellipse(330, 370, 40);

    fill("#f0c330");
    triangle(345, 363, 345, 377, 358, 370);
    fill(0);
    ellipse(338, 366, 3);

    text('(This is a normal bird)', 275, 405);
    text('(pink fly)', 302, 280);

    // close button
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

    // arrow that goes back to second page
    textSize(12);
    text('<--  Click on the right arrow', 195, 485);
    textSize(20);
    text("Enjoy The Game!!", 290, 440);

    // static pink fly 
    drawStaticPinkFly(320, 265, 10);

    pop();
}

// draws the second instructions page
function drawSecondPage() {
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

    // text for the second page
    fill(0);
    textSize(17);
    textAlign(CENTER, CENTER);
    text("Instructions 🌸:", 375, 160);

    textAlign(LEFT);
    text("- If the frog eats a small bird while healthy,", 210, 200);
    text("it will get hurt", 224, 220);
    text("- If the frog eats a small bird while it is hurt", 210, 310);
    text("or dying, it will heal instantly", 224, 330);

    // draws the drawings for the second page
    secondPageDrawings();

    // close button
    strokeWeight(2.5);
    stroke(200);
    noFill();
    rect(
        instructions.closeButton.x,
        instructions.closeButton.y,
        instructions.closeButton.size,
        instructions.closeButton.size,
        instructions.closeButton.corner
    );
    fill(0);
    noStroke();

    // x to close the page
    textSize(17);
    text("X", 535, 148);

    // arrows that goes back to first page and that goes to third pgae
    textSize(12);
    text("<--  Click on the right arrow", 195, 485);
    text("Click on the right arrow  -->", 400, 485);
    pop();
}

// second instruction page drawings
function secondPageDrawings() {
    push();
    // frogs
    fill(frog.colors.healthy);
    arc(230, 280, 50, 50, 180, 0);
    circle(217, 257, 15);
    circle(243, 257, 15);
    fill(255);
    circle(217, 257, 10);
    circle(243, 257, 10);
    fill(0);
    circle(217, 257, 3);
    circle(243, 257, 3);

    fill(frog.colors.damaged);
    arc(430, 280, 50, 50, 180, 0);
    circle(417, 257, 15);
    circle(443, 257, 15);
    fill(255);
    circle(417, 257, 10);
    circle(443, 257, 10);
    fill(0);
    circle(417, 257, 3);
    circle(443, 257, 3);

    fill(frog.colors.damaged);
    arc(230, 390, 50, 50, 180, 0);
    circle(217, 367, 15);
    circle(243, 367, 15);
    fill(255);
    circle(217, 367, 10);
    circle(243, 367, 10);
    fill(0);
    circle(217, 367, 3);
    circle(243, 367, 3);

    fill(frog.colors.dying);
    arc(300, 390, 50, 50, 180, 0);
    circle(287, 367, 15);
    circle(313, 367, 15);
    fill(255);
    circle(287, 367, 10);
    circle(313, 367, 10);
    fill(0);
    circle(287, 367, 3);
    circle(313, 367, 3);

    fill(frog.colors.healthy);
    arc(480, 390, 50, 50, 180, 0);
    circle(467, 367, 15);
    circle(493, 367, 15);
    fill(255);
    circle(467, 367, 10);
    circle(493, 367, 10);
    fill(0);
    circle(467, 367, 3);
    circle(493, 367, 3);


    // small bird
    fill("#f5d311");
    circle(330, 265, 25);
    triangle(320, 265, 300, 260, 310, 270);
    fill("#dead10");
    triangle(337, 259, 337, 271, 348, 265);
    fill(0);
    circle(333, 262, 3);

    textSize(10);
    text("+", 270, 265);
    text("-->", 360, 265);
    text("(small bird)", 305, 290);

    text("or", 260, 375);

    text("+", 340, 375);

    // bird
    fill("#f5d311");
    circle(390, 375, 25);
    triangle(380, 375, 360, 370, 370, 380);
    fill("#dead10");
    triangle(397, 369, 397, 381, 408, 375);
    fill(0);
    circle(393, 372, 3);
    text("-->", 420, 375);

    textSize(10);
    text("(small bird)", 365, 395);
    pop();
}

// draws static pink fly (this fly is in the instructions not in the actual game)
function drawStaticPinkFly(x, y, size = 10) {
    push();
    noStroke();
    fill("#ff8cf4");
    ellipse(x, y, size);

    fill(200);
    ellipse(
        x - size * 0.5,
        y - size * 0.5,
        size * 0.8,
        size * 0.4
    );
    ellipse(
        x + size * 0.5,
        y - size * 0.5,
        size * 0.8,
        size * 0.4
    );
    pop();
}

