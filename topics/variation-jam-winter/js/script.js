/**
 * Variation Jam : Life as a Frog (Winter Edition)
 * Yaxuan Pang
 * 
 * A game of catching flies with the frog's tongue. 
 * It portrays a semi-realistic life of a frog.
 * 
 * Instructions:
 * - Click on the white square for instructions and game modes
 * - Move the frog with your mouse
 * - Click space to launch the tongue to catch flies
 * - Click the down arrow to hide underwater
 * 
 * Made with p5
 * https://p5js.org/
 */

"use strict";

// defining arrays
const clouds = []; // cloud array
const flies = []; // fly array
let snowflakes = []; // snowflakes array
let state = 'MENU'; // MENU, GAME, WIN, END

// instruction pages are not visible at first
let showInstructions = false;
let showSecondPage = false;

let dayCount = 0; // day count starts at 0 (goes to 1 when the game starts)
let finalDayCount = 0; // final day count starts at 0
let progress = 0; // progress starts at 0
let startTime = 0; // timer since the start of the game starts at 0
let lastEatenTime = 0; // timer for when the frog last ate starts at 0
let endTimerStarted = false; // timer for the end starts off as false

let freezeTimer = 0; // freezer timer is at 0
let deathTimer = 0; // death timer is at 0 
let freezeCounting = false; // freeze counter is false
let deathCounting = false; // death counter is false
let isFrozen = false; // frog is not frozen at the beginning
let canDive = true; // frog is able to dive underwater
let lastDiveTime = 0; // timer for last time frog went underwater
let diveStartTime = 0; // timer for when frog can dive again

// sky parameters (color, transparency)
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
        healthy: "#556117",
        damaged: "#634017",
        dying: "#431C0E",
        dead: "#0b1042",
        frozen: "#02e5fa"
    },
    currentColor: "#556117"
};

// bird array and parameters (position, size, speed)
const bird = {
    x: 0,
    y: 200,
    size: 40,
    speed: 2,
}

// flashlight parameters (position, size, speed, is visible)
const flashlight = {
    x: 350,
    y: 275,
    size: 150,
    color: null,
    active: false
};

// cloud position
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

// Create the canvas, set an angle mode and initialize entities (birds, flies and flashlight)
function setup() {
    createCanvas(700, 550);
    angleMode(DEGREES);

    //push flies
    flies.push(createFly(0, 200, 10, 3, true, false));
    flies.push(createFly(0, 300, 10, 4, false, false, 0, 0, true));

    // colors for the title
    titleEffect.strokeColor = color(random(255));
    titleEffect.strokeFill = color(5, random(255), random(255));
    flashlight.color = color(245, 218, 42, 200);

    // Initialize all entities
    flies.forEach(fly => resetFly(fly));
    resetBird(bird);
    flashlight.x = width / 2;
    flashlight.y = height / 2;
}

//drawing the game states (menu, game, win, end)
function draw() {
    if (state === 'MENU') {
        menu();
    } else if (state === 'GAME') {
        game();
    } else if (state === 'WIN') {
        win();
    } else if (state === 'END') {
        end();
    }
}

/**
 * Handles keyboard input
 */
function keyPressed(event) { //space bar
    if (event.keyCode === 32) {
        if (state === "MENU" && frog.tongue.state === "idle") {
            frog.tongue.state = "outbound";
            state = "GAME";
            startTime = millis(); // timer for start time starts
            lastEatenTime = millis(); // timer for when the frog eats last starts
        } else if (state === "GAME" && frog.tongue.state === "idle") {
            frog.tongue.state = "outbound";
        }
    }
    if (event.keyCode === 37) {  //left arrow (shows first page)
        if (showSecondPage) {
            showSecondPage = false;
            showInstructions = true;
        }
    }
    if (event.keyCode === 39) { // right arrow (shows second page)
        if (showInstructions) {
            showInstructions = false;
            showSecondPage = true;
        }
    }

    if (keyCode === 40) { // down arrow (frog hides underwtaer)
        // if can dive is false or frog is underwater, nothing happens
        if (!canDive || frog.body.y === 560) {
            return;
        }


        frog.body.y = 560;
        canDive = false; // can dive becomes false
        diveStartTime = millis(); // cooldown starts

        setTimeout(() => {
            canDive = true;
        }, 18000); // after 18 seconds the frog can dive underwater again

        // frog cannot freeze when it is underwater and the freeze timer restarts
        freezeCounting = false;
        isFrozen = false;
        deathCounting = false;
        freezeTimer = 0;
        deathTimer = 0;

        // frog resurfaces after 5 seconds
        setTimeout(() => {
            if (frog.body.y === 560) {
                frog.body.y = 520;

                freezeCounting = false;
                isFrozen = false;
                deathCounting = false;
                freezeTimer = 0;
                deathTimer = 0;
            }
        }, 5000);
    }

}

/**
 * Handles mouse clicks
 */
// click within the menu button with the mouse to close the instructions
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
            showSecondPage = false;
        }
    }
}

// drawing all the elements that will appear in the menu state
function menu() {
    background(sky.fill.r, sky.fill.g, sky.fill.b);

    FrogMenuMovement();

    drawClouds();
    drawBehindWater();

    drawBird(bird);
    moveBird(bird);

    updateFlies(0);

    flies.forEach(fly => {
        if (!fly.spawnsAtNight) {
            fly.active = true;
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
    showSnow();

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
    drawClouds();
    drawBehindWater();

    // Update and draw game entities
    updateFlies();
    showFlashlight();

    // Draw entities
    flies.forEach(fly => {
        if (fly.active) drawFly(fly);
    });
    drawBird(bird);
    moveBird(bird);
    checkTongueCollision(bird, 'bird');

    // timer for when the frog freezes
    freezeFrogTimer();

    drawFrog();
    drawWater();

    updateSky();
    updateProgress();
    if (timePassed > 3000) checkStarvation();

    if (flashlight.active) {
        drawFlashlight();
        checkFlashlightCollision();
    }

    drawProgressRing();
    drawDayCounter();

    showSnow();
    cooldownCounter();
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
            state = 'END'; // if the forg is dead, it goes to game over page in half a second
        }, 500);
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

// show snowflakes
function showSnow() {
    let time = frameCount / 60;

    if (snowflakes.length < 200) {
        snowflakes.push(createSnowflake());
    }

    for (let flake of snowflakes) {
        updateSnowflake(flake, time);
        displaySnowflake(flake);
    }
}

// shows the the seconds remaining before the frog can dive again
function cooldownCounter() {
    if (!canDive) {
        // Calculate time remaining until can dive again
        let timeRemaining = 18 - floor((millis() - diveStartTime) / 1000);
        timeRemaining = max(0, timeRemaining);

        push();
        textAlign(CENTER);
        textSize(15);
        strokeWeight(2);
        stroke(255);
        fill(255, 0, 0);
        text("Dive Cooldown: " + timeRemaining + "s", width / 2, 50);
        pop();
    } else {
        push();
        textAlign(CENTER);
        textSize(15);
        strokeWeight(2);
        stroke(255);
        fill(0, 255, 0);
        text("Dive Ready!", width / 2, 50);
        pop();
    }
}

// timer for when the frog freezes
function freezeFrogTimer() {
    // if the frog is above water, it becomes frozen after 10 seconds
    if (frog.body.y === 520) {
        if (!freezeCounting && !isFrozen) {
            freezeCounting = true; // freeze counter is true
            freezeTimer = millis(); // freeze timer resets
        }

        if (!isFrozen && freezeCounting) {
            let freezeTime = millis() - freezeTimer;

            if (freezeTime >= 10000) {
                isFrozen = true;
                frog.currentColor = frog.colors.frozen;

                deathCounting = true;
                deathTimer = millis();
            }
        }
        // if the frog is frozen for 5 seocnds, it dies
        if (isFrozen && deathCounting) {
            let frozenTime = millis() - deathTimer;

            if (frozenTime >= 5000) {
                frog.currentColor = frog.colors.dead;
            }
        }
    }
    // if the frog is frozen adn dives underwater, it becomes healthy again and the timers reset
    else if (frog.body.y === 560) {
        frog.currentColor = frog.colors.healthy;

        freezeCounting = false;
        deathCounting = false;
        isFrozen = false;
    }
}

// create snowflakes
function createSnowflake() {
    return {
        posX: 0,
        posY: random(-50, 0),
        initialangle: random(0, 360),
        size: random(2, 5),
        radius: sqrt(random(pow(width / 2, 2)))
    };
}

// update snoflake position
function updateSnowflake(flake, time) {
    let angularSpeed = 0.6 * 57.2958;
    let angle = angularSpeed * time + flake.initialangle;
    flake.posX = width / 2 + flake.radius * sin(angle);
    flake.posY += sqrt(flake.size);

    if (flake.posY > height) {
        let index = snowflakes.indexOf(flake);
        snowflakes.splice(index, 1);
    }
}

// position and size of the snowflakes
function displaySnowflake(flake) {
    ellipse(flake.posX, flake.posY, flake.size);
}

// create flies
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

// moves the frog
function FrogMenuMovement() {
    frog.x = mouseX;
}


/**
 * Draws the menu text, title and subtitles
 */
function drawMenuText() {
    push();
    textAlign(CENTER, CENTER);
    textSize(30);
    fill(0);
    strokeWeight(5);

    // changes to a random color every 15 frames
    if (frameCount % 15 === 0) {
        titleEffect.strokeColor = color(random(255), random(255), random(255));
    }

    // title and subtitle (stroke color, fill color, stroke weight and size)
    stroke(titleEffect.strokeColor);
    text('**Click space to play!**', width / 2, height / 6);
    textSize(20);
    fill(0);
    strokeWeight(5);
    stroke(179, 248, 252);
    text("(Winter Edition!! ❄️)", 350, 250);

    textSize(70);
    textStyle(BOLD);
    fill(255);
    strokeWeight(15);

    // changes to a random color every 10 frames
    if (frameCount % 10 === 0) {
        titleEffect.strokeFill = color(5, random(255), random(255));
    }
    stroke(titleEffect.strokeFill);
    text('LIFE AS A FROG', width / 2, height / 3);

    noStroke();
    fill(255);
    rect(menuButton.x, menuButton.y, menuButton.size, menuButton.size);

    // instruction to click on the instruction box
    fill(0);
    textSize(13);
    text('Click here for instructions', 360, 330);
    pop();
}

/**
 * Draws the instruction box
 */
function drawInstructions() {
    push();
    noStroke();
    fill(255);
    rect(instructions.x, instructions.y, instructions.w, instructions.h, instructions.corner);

    fill(0);
    textSize(17);
    textAlign(CENTER, CENTER);
    text('Instructions ❄️:', 375, 160);

    // text for first page
    textAlign(LEFT);
    text("- Control the frog with the mouse and click", 210, 200);
    text("space to eat", 224, 220);
    text("- Eat flies every 3 seconds", 210, 250);
    text("- WATCH OUT for birds and the", 210, 290);
    text("flashlight (only appears at night)", 224, 310);
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

    strokeWeight(2.5);
    stroke(200);
    noFill();
    // close button
    rect(instructions.closeButton.x, instructions.closeButton.y,
        instructions.closeButton.size, instructions.closeButton.size,
        instructions.closeButton.corner);

    // arrow that leads to the second instructions page
    fill(0);
    noStroke();
    text('X', 535, 148);
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

    fill(0);
    textSize(17);
    textAlign(CENTER, CENTER);
    text('Instructions ❄️:', 375, 160);

    // text for the second page
    textAlign(LEFT);
    text('- If the frog is above water for 10 seconds,', 210, 200);
    text('it will turn bright blue (5s after, it will die)', 224, 220);
    text('- If the frog hides underwater, it completly', 210, 250);
    text(" heals and it is hidden from the flashlight", 224, 270);
    text("(press down arrow ⬇️ + 18s cooldown)", 224, 290);
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
    text("⬇️", 307, 330);


    textSize(12);
    text('<--  Click on the right arrow', 195, 485);
    textSize(20);
    text("Enjoy The Game!!", 290, 440);
    text("⬇️", 417, 330);
    fill(255, 0, 0);
    text("X", 420, 330);

    // drawings for the second page
    instructionDrawings();

    pop();
}

// drawings for the second page
function instructionDrawings() {
    noStroke();
    //frog
    fill(frog.colors.healthy);
    arc(370, 350, 50, 50, 180, 0);
    circle(357, 327, 15);
    circle(383, 327, 15);
    fill(255);
    circle(357, 327, 10);
    circle(383, 327, 10);
    fill(0);
    circle(357, 327, 3);
    circle(383, 327, 3);

    fill(frog.colors.healthy);
    arc(480, 340, 50, 50, 180, 0);
    circle(467, 317, 15);
    circle(493, 317, 15);
    fill(255);
    circle(467, 317, 10);
    circle(493, 317, 10);
    fill(0);
    circle(467, 317, 3);
    circle(493, 317, 3);

    fill(frog.colors.frozen);
    arc(260, 340, 50, 50, 180, 0);
    circle(247, 317, 15);
    circle(273, 317, 15);
    fill(255);
    circle(247, 317, 10);
    circle(273, 317, 10);
    fill(0);
    circle(247, 317, 3);
    circle(273, 317, 3);

    fill(frog.colors.frozen);
    arc(260, 400, 50, 50, 180, 0);
    circle(247, 377, 15);
    circle(273, 377, 15);
    fill(255);
    circle(247, 377, 10);
    circle(273, 377, 10);
    fill(0);
    circle(247, 377, 3);
    circle(273, 377, 3);

    fill(frog.colors.dead);
    arc(400, 400, 50, 50, 180, 0);
    circle(387, 377, 15);
    circle(413, 377, 15);
    fill(255);
    circle(387, 377, 10);
    circle(413, 377, 10);
    fill(0);
    circle(387, 377, 3);
    circle(413, 377, 3);

    textSize(10);
    text('-------->', 315, 400);
    text('5 seconds', 307, 410);
    text('(18 second cooldown)', 430, 360);


    //draw waves for instructions
    drawWave();
}

//draw waves for instructions
function drawWave() {
    push();
    fill("#7fb7fa");
    noStroke();
    //wave 1
    beginShape();
    vertex(220, 350);


    for (let x = 220; x <= 300; x += 5) {
        let y = 330 + sin((x - 230) * 3) * 3;
        vertex(x, y);
    }

    vertex(300, 350);

    endShape(CLOSE);

    //wave 2
    beginShape();

    vertex(330, 350);


    for (let x = 330; x <= 410; x += 5) {
        let y = 330 + sin((x - 370) * 3) * 3;
        vertex(x, y);
    }


    vertex(410, 350);

    endShape(CLOSE);

    //wave 3
    beginShape();

    vertex(440, 350);


    for (let x = 440; x <= 520; x += 5) {
        let y = 330 + sin((x - 370) * 5) * 3;
        vertex(x, y);
    }


    vertex(520, 350);

    endShape(CLOSE);

    // down waves
    //wave 4
    beginShape();
    vertex(220, 410);

    for (let x = 220; x <= 300; x += 5) {
        let y = 390 + sin((x - 230) * 3) * 3;
        vertex(x, y);
    }
    vertex(300, 410);

    endShape(CLOSE);

    //wave 5
    beginShape();
    vertex(360, 410);

    for (let x = 360; x <= 440; x += 5) {
        let y = 390 + sin((x - 370) * 3) * 3;
        vertex(x, y);
    }

    vertex(440, 410);
    endShape(CLOSE);

    pop();
}

/**
 * Updates all flies
 */
function updateFlies() {
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
    fill("#30fff5");
    ellipse(fly.x, fly.y, fly.size);

    fill("#b6fcf9");
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

    // effects when the frog collides with (eats) each entity (flies, birds)
    if (hit) {
        // tongue speed goes up every time the frog eats a fly (min: 10, max: 25)
        // resets the fly
        // timer for when the fly last ate resets
        if (type === 'fly') {
            resetFly(entity);
            frog.tongue.speed = constrain(frog.tongue.speed + 1, 10, 25);
            lastEatenTime = millis();
        } else if (type === 'bird') {
            // tongue speed slows down to 10 if the frog eats a bird
            // resets the bird
            // if the frog eats a bird it gets hurt
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
// if the flashlight hits the frog, it dies
// if the flashlight hits the frog when it is turquoise, it does nothing
function checkFlashlightCollision() {
    const d = dist(flashlight.x, flashlight.y, frog.body.x, frog.body.y);
    if (d < flashlight.size / 2 + frog.body.size / 2 && frog.body.y === 560) {
        frog.currentColor = frog.currentColor;
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

    //body
    push();
    fill(frog.currentColor);
    noStroke();
    ellipse(frog.body.x, frog.body.y, frog.body.size);


    //eyes
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
 * Draws clouds
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
    fill("#b0efff");
    beginShape();
    for (let x = 0; x <= width; x += 10) {
        let y = 485 + sin(x - frameCount * 3) * 5;
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
    fill("#7fb7fa");
    beginShape();
    for (let x = 0; x <= width; x += 10) {
        let y = 495 + sin(x + frameCount * 3) * 5;
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
    fill(0);
    strokeWeight(5);
    stroke(179, 248, 252);
    text("(Winter Edition!! ❄️)", 350, 130);

    // draws the dead frog icon
    noStroke();
    fill(255);
    circle(width / 2, height / 1.5, 80);
    fill("#00ff00");
    circle(width / 2, height / 1.47, 45);
    circle(width / 2.1, height / 1.56, 20);
    circle(width / 1.915, height / 1.56, 20);

    //eyes
    fill(0);
    textSize(13);
    text("X", width / 2.1, height / 1.55);
    text("X", width / 1.915, height / 1.55);


    //tongue
    fill("#ff0000");
    ellipse(width / 1.95, height / 1.45, 5, 20);

    //body
    fill(0);
    rect(width / 2.1, height / 1.47, 32, 2);
    fill("#00ff00");
    rect(width / 2.1, height / 1.49, 32, 5);
    pop();
}