/**
 * Variation Jam : Life as a Frog
 * Yaxuan Pang
 * 
 * A game of catching flies with the frog's tongue. 
 * It portrays a semi-realistic life of a frog.
 * 
 * Instructions:
 * - Click on the white square for instructions and game modes
 * - Move the frog with your mouse
 * - Click space to launch the tongue to catch flies
 * 
 * Made with p5
 * https://p5js.org/
 */

"use strict";

// defining arrays
const flies = [];
const clouds = [];
let snowflakes = [];
let state = 'MENU'; // MENU, GAME, WIN, END
let showInstructions = false;
let showSecondPage = false;
let dayCount = 0;
let finalDayCount = 0;
let progress = 0;
let startTime = 0;
let lastEatenTime = 0;
let endTimerStarted = false;
let freezeTimer = 0;
let deathTimer = 0;
let freezeCounting = false;
let deathCounting = false;
let isFrozen = false;
let canDive = true;
let lastDiveTime = 0;
let diveStartTime = 0;

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
        healthy: "#556117",
        damaged: "#634017",
        dying: "#431C0E",
        dead: "#0b1042",
        frozen: "#02e5fa"
    },
    currentColor: "#556117"
};

// bird array and parameters
const bird = {
    x: 0,
    y: 200,
    size: 40,
    speed: 2,
}

// flashlight parameters
const flashlight = {
    x: 350,
    y: 275,
    size: 150,
    color: null,
    active: false
};

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

function setup() {
    createCanvas(700, 550);
    angleMode(DEGREES);

    flies.push(createFly(0, 200, 10, 3, true, false));
    flies.push(createFly(0, 300, 10, 4, false, false, 0, 0, true));

    titleEffect.strokeColor = color(random(255));
    titleEffect.strokeFill = color(5, random(255), random(255));
    flashlight.color = color(245, 218, 42, 200);

    flies.forEach(fly => resetFly(fly));
    resetBird(bird);
    flashlight.x = width / 2;
    flashlight.y = height / 2;
}

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

function keyPressed(event) {
    if (event.keyCode === 32) {
        if (state === "MENU" && frog.tongue.state === "idle") {
            frog.tongue.state = "outbound";
            state = "GAME";
            startTime = millis();
            lastEatenTime = millis();
        } else if (state === "GAME" && frog.tongue.state === "idle") {
            frog.tongue.state = "outbound";
        }
    }
    if (event.keyCode === 37) {
        if (showSecondPage) {
            showSecondPage = false;
            showInstructions = true;
        }
    }
    if (event.keyCode === 39) {
        if (showInstructions) {
            showInstructions = false;
            showSecondPage = true;
        }
    }

    if (keyCode === 40) {
        if (!canDive || frog.body.y === 560) {
            return;
        }

        frog.body.y = 560;
        canDive = false;
        diveStartTime = millis();

        setTimeout(() => {
            canDive = true;
        }, 18000);

        freezeCounting = false;
        isFrozen = false;
        deathCounting = false;
        freezeTimer = 0;
        deathTimer = 0;

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

    if (showInstructions === true) {
        drawInstructions();
    }
    if (showSecondPage === true) {
        drawSecondPage();
    }
}

function game() {
    background(sky.fill.r, sky.fill.g, sky.fill.b);

    const timePassed = millis() - startTime;

    drawClouds();
    drawBehindWater();

    updateFlies(timePassed);
    showFlashlight();

    flies.forEach(fly => {
        if (fly.active) drawFly(fly);
    });
    drawBird(bird);
    moveBird(bird);
    checkTongueCollision(bird, 'bird');

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

function gameEnd() {
    if (frog.currentColor === frog.colors.dead && endTimerStarted === false) {
        endTimerStarted = true;
        finalDayCount = dayCount;
        setTimeout(() => {
            state = 'END';
        }, 500);
    }

    if (dayCount === 3) {
        state = 'WIN';
    }
}

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

function freezeFrogTimer() {
    if (frog.body.y === 520) {
        if (!freezeCounting && !isFrozen) {
            freezeCounting = true;
            freezeTimer = millis();
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

        if (isFrozen && deathCounting) {
            let frozenTime = millis() - deathTimer;

            if (frozenTime >= 5000) {
                frog.currentColor = frog.colors.dead;
            }
        }
    }

    else if (frog.body.y === 560) {
        frog.currentColor = frog.colors.healthy;

        freezeCounting = false;
        deathCounting = false;
        isFrozen = false;
    }
}

function createSnowflake() {
    return {
        posX: 0,
        posY: random(-50, 0),
        initialangle: random(0, 360),
        size: random(2, 5),
        radius: sqrt(random(pow(width / 2, 2)))
    };
}

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

function displaySnowflake(flake) {
    ellipse(flake.posX, flake.posY, flake.size);
}

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
    textSize(20);
    fill(0);
    strokeWeight(5);
    stroke(179, 248, 252);
    text("(Winter Edition!! ❄️)", 350, 250);

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

function drawInstructions() {
    push();
    noStroke();
    fill(255);
    rect(instructions.x, instructions.y, instructions.w, instructions.h, instructions.corner);

    fill(0);
    textSize(17);
    textAlign(CENTER, CENTER);
    text('Instructions ❄️:', 375, 160);

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
    textSize(12);
    text("Click on the right arrow  -->", 400, 485);
    pop();
}

function drawSecondPage() {
    push();
    noStroke();
    fill(255);
    rect(instructions.x, instructions.y, instructions.w, instructions.h, instructions.corner);

    fill(0);
    textSize(17);
    textAlign(CENTER, CENTER);
    text('Instructions ❄️:', 375, 160);

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

    instructionDrawings();

    pop();
}

function instructionDrawings() {
    noStroke();

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


    drawWave();
}

function drawWave() {
    push();
    fill("#7fb7fa");
    noStroke();

    beginShape();
    vertex(220, 350);


    for (let x = 220; x <= 300; x += 5) {
        let y = 330 + sin((x - 230) * 3) * 3;
        vertex(x, y);
    }

    vertex(300, 350);

    endShape(CLOSE);


    beginShape();

    vertex(330, 350);


    for (let x = 330; x <= 410; x += 5) {
        let y = 330 + sin((x - 370) * 3) * 3;
        vertex(x, y);
    }


    vertex(410, 350);

    endShape(CLOSE);

    beginShape();

    vertex(440, 350);


    for (let x = 440; x <= 520; x += 5) {
        let y = 330 + sin((x - 370) * 5) * 3;
        vertex(x, y);
    }


    vertex(520, 350);

    endShape(CLOSE);
    // down waves

    beginShape();
    vertex(220, 410);

    for (let x = 220; x <= 300; x += 5) {
        let y = 390 + sin((x - 230) * 3) * 3;
        vertex(x, y);
    }
    vertex(300, 410);

    endShape(CLOSE);


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

function moveFly(fly) {
    fly.x += fly.speed;

    if (fly.wave) {
        fly.y = fly.startY + sin(fly.x * fly.waveSpeed) * fly.waveAmplitude;
    }

    if (fly.x > width) resetFly(fly);
}

function resetFly(fly) {
    fly.x = 0;
    fly.y = random(0, fly.spawnsAtNight ? 400 : 300);
    fly.startY = fly.y;
    fly.size = random(8, 12);
}

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

function moveBird(birds) {
    bird.x += bird.speed;
    if (bird.x > width) resetBird(bird);
}

function resetBird(bird) {
    bird.x = 0;
    bird.y = random(0, 300);
}

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

function showFlashlight() {
    flashlight.active = sky.fill.transparency > 110;

    if (flashlight.active && frameCount % 60 === 0) {
        flashlight.x = random(width);
        flashlight.y = random(300, 550);
    }
}

function drawFlashlight() {
    push();
    noStroke();
    fill(flashlight.color);
    circle(flashlight.x, flashlight.y, flashlight.size);
    pop();
}

function checkFlashlightCollision() {
    const d = dist(flashlight.x, flashlight.y, frog.body.x, frog.body.y);
    if (d < flashlight.size / 2 + frog.body.size / 2 && frog.body.y === 560) {
        frog.currentColor = frog.currentColor;
    }
    else if (d < flashlight.size / 2 + frog.body.size / 2) {
        frog.currentColor = frog.colors.dead;
    }
}

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

function drawClouds() {
    noStroke();
    fill(sky.cloudColor);

    clouds.forEach(cloudGroup => {
        cloudGroup.forEach(cloud => {
            ellipse(cloud[0], cloud[1], cloud[2], cloud[3]);
        });
    });
}

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

function drawDayCounter() {
    push();
    fill(0);
    noStroke();
    textSize(12);
    textAlign(CENTER, CENTER);
    text("DAY " + dayCount, 85, 40);
    pop();
}

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

function drawDeadFrogIcon() {
    textSize(20);
    fill(0);
    strokeWeight(5);
    stroke(179, 248, 252);
    text("(Winter Edition!! ❄️)", 350, 130);

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