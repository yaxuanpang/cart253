/**
 * Variation Jam : Life as a Frog (Fall)
 * Yaxuan Pang
 * 
 * A game of catching flies with the frog's tongue. 
 * It portrays a semi-realistic life of a frog.
 * 
 * Instructions:
 * - Click on the white square for instructions and game modes
 * - Move the frog with your mouse
 * - Click space to launch the tongue to catch flies
 * - Avoid birds
 * 
 * Made with p5
 * https://p5js.org/
 */

"use strict";

// defining arrays
let newbird = [];
const clouds = [];

// variables
let state = 'MENU'; // MENU, GAME, WIN, END
let showInstructions = false;
let dayCount = 0;
let finalDayCount = 0;
let progress = 0;
let startTime = 0;
let lastEatenTime = 0;
let endTimerStarted = false;

// sky parameters
const sky = {
    fill: {
        r: 135,
        g: 207,
        b: 235,
        transparency: 0
    },
    change: 0.055,
    isNight: false,
    direction: -1,
    cloudColor: 255
};

// frog parameters
const frog = {
    body: {
        x: 320,
        y: 520,
        size: 150
    },
    tongue: {
        x: undefined,
        y: 480,
        size: 20,
        speed: 10,
        state: "idle" // idle, outbound, inbound
    }, // frog colors
    colors: {
        healthy: "#00ff00",
        damaged: "#6e8514",
        dying: "#855214",
        dead: "#4f2409"
    },
    currentColor: "#00ff00"
};

// fly array
const flies = [ //(x, y, size, speed, isActive, isDayOnly, vx, vy, canRespawn)
    createFly(0, 200, 10, 3, true, false),
    createFly(0, 300, 12, 5, true, true, 1.5, 50),
    createFly(0, 300, 10, 4, false, false, 0, 0, true),
    createFly(0, 100, 12, 3.5, true, true, 4, 10)
];

// bird array and parameters
const birds = [
    {
        x: 0,
        y: 200,
        size: 40,
        speed: 2,
        active: true
    },
    {
        x: 0,
        y: 400,
        size: 40,
        speed: 2.5,
        active: false,
        spawnsInDay: true
    }
];

// flashlight parameters
const flashlight = {
    x: 350,
    y: 275,
    size: 150,
    color: null,
    active: false
};

// cloud positions

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

// progress ring parameters
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
    corner: 15,
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

// key codes
const keyCode = {
    space: 32
};

// Create the canvas, set an angle mode and initialize entities (birds, flies and flashlight)
function setup() {
    createCanvas(700, 550);
    angleMode(DEGREES);

    titleEffect.strokeColor = color(random(255));
    titleEffect.strokeFill = color(5, random(255), random(255));
    flashlight.color = color(245, 218, 42, 200);

    // Initialize all entities
    flies.forEach(fly => resetFly(fly));
    birds.forEach(bird => resetBird(bird));
    flashlight.x = width / 2;
    flashlight.y = height / 2;
}

// drawing the game states

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

// drawing all the elements that will appear in the menu state

function menu() {
    background(sky.fill.r, sky.fill.g, sky.fill.b);

    FrogMenuMovement();


    drawClouds();
    drawBehindWater();
    drawMenuBird();

    updateBirds(0); // or moveBird(bird)
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

    drawFrog();
    drawWater();
    drawMenuText();
    drawProgressRing();
    drawDayCounter();

    if (showInstructions === true) {
        drawInstructions();
    }
}

// ====== new functions start here ========

//create the flies
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

function FrogMenuMovement() {
    frog.x = mouseX;
}

function drawMenuBird() {
    let b = birds[0];   // use the first bird only for menu
    b.active = true;
    moveBird(b);
    drawBird(b);
    birds.speed += 2;
}


function updateBirds(timePassed) {

    birds.forEach((bird, index) => {

        // --- BIRD 0 = ALWAYS ACTIVE IN GAME ---
        if (index === 0) {
            bird.active = sky.fill.transparency < 100;
        }

        // --- BIRD 1 = SPAWN AFTER 0.5 SECONDS ---
        if (index === 1) {
            bird.active = timePassed > 500;  // 500 ms = 0.5 seconds
        }

        if (bird.active) {
            moveBird(bird);
            checkTongueCollision(bird, 'bird');
        }
    });
}




/**
 * Draws the menu text and title
 */
function drawMenuText() {
    push();
    textAlign(CENTER, CENTER);
    textSize(30);
    fill(0);
    strokeWeight(5);

    if (frameCount % 15 === 0) {
        titleEffect.strokeColor = color(random(255), random(255), random(255));
    }
    stroke(titleEffect.strokeColor);
    text('**Click space to play!**', width / 2, height / 6);

    textSize(70);
    textStyle(BOLD);
    fill(255);
    strokeWeight(15);

    if (frameCount % 10 === 0) {
        titleEffect.strokeFill = color(5, random(255), random(255));
    }
    stroke(titleEffect.strokeFill);
    text('LIFE AS A FROG', width / 2, height / 3);

    noStroke();
    fill(255);
    rect(menuButton.x, menuButton.y, menuButton.size, menuButton.size);

    fill(0);
    textSize(13);
    text('Click here for instructions', 360, 330);
    pop();
}

/**
 * Draws the instructions overlay
 */
function drawInstructions() {
    push();
    noStroke();
    fill(255);
    rect(instructions.x, instructions.y, instructions.w, instructions.h, instructions.corner);

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

    fill(frog.colors.damaged);
    rect(250, 385, 10, 10);
    fill(frog.colors.dying);
    rect(250, 405, 10, 10);
    fill(frog.colors.dead);
    rect(250, 425, 10, 10);

    strokeWeight(2.5);
    stroke(200);
    noFill();
    rect(instructions.closeButton.x, instructions.closeButton.y,
        instructions.closeButton.size, instructions.closeButton.size,
        instructions.closeButton.corner);
    fill(0);
    noStroke();
    text('X', 535, 148);
    pop();
}

// drawing all the elements that will appear in the game state
function game() {
    background(sky.fill.r, sky.fill.g, sky.fill.b);

    const timePassed = millis() - startTime;

    // Draw environment
    drawClouds();
    drawBehindWater();

    // Update and draw game entities
    updateFlies(timePassed);
    updateBirds(timePassed);
    showFlashlight();

    // Draw entities
    flies.forEach(fly => { if (fly.active) drawFly(fly); });
    birds.forEach(bird => { if (bird.active) drawBird(bird); });
    drawFrog();
    drawWater();

    // Update game mechanics
    updateSky();
    updateProgress();
    if (timePassed > 3000) checkStarvation();

    // Draw flashlight in front of everything
    if (flashlight.active) {
        drawFlashlight();
        checkFlashlightCollision();
    }

    // Draw UI
    drawProgressRing();
    drawDayCounter();

    // Check win/lose conditions
    GameEnd();
}

/**
 * Checks if the game should end (win or lose)
 */
function GameEnd() {
    if (frog.currentColor === frog.colors.dead && endTimerStarted === false) {
        endTimerStarted = true;
        finalDayCount = dayCount;
        setTimeout(() => { state = 'END'; }, 500);
    }

    if (dayCount === 3) {
        state = 'WIN';
    }
}

// fly systems
/**
 * Updates all flies
 */
function updateFlies(timePassed) {
    flies.forEach((fly) => {
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
    ellipse(fly.x - fly.size * 0.5, fly.y - fly.size * 0.5, fly.size * 0.8, fly.size * 0.4);
    ellipse(fly.x + fly.size * 0.5, fly.y - fly.size * 0.5, fly.size * 0.8, fly.size * 0.4);
    pop();
}

// bird systems
/**
 * Updates all birds
 */
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

// collision system
/**
 * Checks if the tongue collides with an entity
 */
function checkTongueCollision(entity, type) {
    const d = dist(frog.tongue.x, frog.tongue.y, entity.x, entity.y);
    const hit = d < frog.tongue.size / 2 + entity.size / 2;

    if (hit) {
        if (type === 'fly') {
            resetFly(entity);
            frog.tongue.speed = constrain(frog.tongue.speed + 1, 10, 25);
            lastEatenTime = millis();
        } else if (type === 'bird') {
            resetBird(entity);
            frog.tongue.speed = 10;
            damageFrog();
        }
        frog.tongue.state = "inbound";
    }
}

/**
 * Damages the frog when it eats a bird
 */
function damageFrog() {
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

// flashlight system
/**
 * Updates the flashlight position and visibility
 */
function showFlashlight() {
    flashlight.active = sky.fill.transparency > 110;

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
function checkFlashlightCollision() {
    const d = dist(flashlight.x, flashlight.y, frog.body.x, frog.body.y);
    if (d < flashlight.size / 2 + frog.body.size / 2) {
        frog.currentColor = frog.colors.dead;
    }
}

// frog system
/**
 * Draws the frog (tongue and body)
 */
function drawFrog() {
    push();
    fill("#ff0000");
    noStroke();
    ellipse(frog.tongue.x, frog.tongue.y, frog.tongue.size);
    stroke("#ff0000");
    strokeWeight(frog.tongue.size);
    line(frog.tongue.x, frog.tongue.y, frog.body.x, frog.body.y);
    pop();

    push();
    fill(frog.currentColor);
    noStroke();
    ellipse(frog.body.x, frog.body.y, frog.body.size);

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
        if (frog.tongue.y <= 0) frog.tongue.state = "inbound";
    } else if (frog.tongue.state === "inbound") {
        frog.tongue.y += frog.tongue.speed;
        if (frog.tongue.y >= height) frog.tongue.state = "idle";
    }
}

// drawing the sky and the environment
/**
 * Updates the sky color and darkness
 */
function updateSky() {
    if (sky.isNight) {
        sky.fill.r -= sky.change;
        sky.fill.g -= sky.change;
        sky.fill.b += sky.change;
        if (sky.fill.g <= 85) {
            sky.fill.g = 85;
            sky.isNight = false;
        }
    } else {
        sky.fill.r += sky.change;
        sky.fill.g += sky.change;
        sky.fill.b -= sky.change;
        if (sky.fill.g >= 207) {
            sky.fill.g = 207;
            sky.isNight = true;
        }
    }

    push();
    noStroke();
    fill(0, sky.fill.transparency);
    rect(0, 0, 700, 550);
    pop();

    if (sky.isNight) {
        sky.fill.transparency += sky.change;
        if (sky.fill.transparency >= 220) {
            sky.fill.transparency = 220;
            sky.isNight = false;
        }
    } else {
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
    if (sky.fill.g <= 85) {
        sky.direction = 1;
    } else if (startTime > 0 && sky.fill.g >= 207) {
        sky.direction = -1;
        dayCount++;
    }

    let g = sky.fill.g;

    if (sky.direction === -1) {
        progress = (207 - g) / 244;
    } else {
        progress = (g - 85) / 244 + 0.5;
    }

}

/**
 * Draws clouds in the sky
 */
function drawClouds() {
    noStroke();
    fill(sky.cloudColor);

    clouds.forEach(cloudGroup => {
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
    fill("#1ec7be");
    beginShape();
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
    fill("#3d9cf5");
    beginShape();
    for (let x = 0; x <= width; x += 10) {
        let y = 495 + sin(x * 3 + frameCount * 3) * 10;
        vertex(x, y);
    }
    vertex(width, height);
    vertex(0, height);
    endShape(CLOSE);
    pop();
}

// progression system
/**
 * Draws the progress ring
 */
function drawProgressRing() {
    push();
    stroke(progressRing.fill.background);
    strokeWeight(progressRing.strokeWeight);
    noFill();
    ellipse(progressRing.x, progressRing.y, progressRing.radius * 2, progressRing.radius * 2);

    stroke(progressRing.fill.progress.r, progressRing.fill.progress.g, progressRing.fill.progress.b);
    strokeCap(SQUARE);
    let endAngle = -90 + (progress * 360);
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
    noStroke();
    fill(0);
    rect(0, 0, width, height);

    strokeWeight(3);
    stroke("#00ff00");
    textAlign(CENTER, CENTER);
    textSize(50);
    textStyle(BOLD);
    text('**Game Over**', width / 2, height / 2);

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
    noStroke();
    fill(255);
    circle(width / 2, height / 1.5, 80);
    fill("#00ff00");
    circle(width / 2, height / 1.47, 45);
    circle(width / 2.1, height / 1.56, 20);
    circle(width / 1.915, height / 1.56, 20);

    fill(0);
    textSize(13);
    text("X", width / 2.1, height / 1.55);
    text("X", width / 1.915, height / 1.55);

    fill("#ff0000");
    ellipse(width / 1.95, height / 1.45, 5, 20);

    fill(0);
    rect(width / 2.1, height / 1.47, 32, 2);
    fill("#00ff00");
    rect(width / 2.1, height / 1.49, 32, 5);
}

/**
 * Handles keyboard input
 */
function keyPressed() {
    if (key === ' ') {
        if (state === 'MENU' && frog.tongue.state === "idle") {
            frog.tongue.state = "outbound";
            state = 'GAME';
            startTime = millis();
            lastEatenTime = millis();
        } else if (state === 'GAME' && frog.tongue.state === "idle") {
            frog.tongue.state = "outbound";
        }
    }
}

/**
 * Handles mouse clicks
 */
function mousePressed() {
    if (state === 'MENU') {
        if (mouseX > menuButton.x && mouseX < menuButton.x + menuButton.size &&
            mouseY > menuButton.y && mouseY < menuButton.y + menuButton.size) {
            showInstructions = true;
        }
        if (mouseX > instructions.closeButton.x &&
            mouseX < instructions.closeButton.x + instructions.closeButton.size &&
            mouseY > instructions.closeButton.y &&
            mouseY < instructions.closeButton.y + instructions.closeButton.size) {
            showInstructions = false;
        }
    }
}