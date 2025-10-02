/**
 * Art-Jam: Self Portrait
 * Yaxuan Pang
 * 
 * This is an interactive self portrait. I put some items that I like around 
 * so that the user can get to know me! Use the flashlight (mouseX and mouseY)
 * to find the hidden items. When the user clicks one the mouse, another background 
 * will appear.
 */

"use strict";

let r = 255; // color for the body
let g = 173; // color for the body
let b = 224; //color for the body
let change = 1;

let cloudcolor = 255; // set the cloud color to white

// constant for the first cover (bear)
const cover = {
    x: 100, //position of the cover
    y: 150, //position of the cover
    size: 100, //size of the cover
    fill: "#0d4f4b", //color
    fills: {
        noOverlap: "#20e3d6", //the flashlight color always stays the same
        overlap: "#20e3d6",
    }
};

// constant for the second cover (painting)
const anothercover = {
    x: 150, //position of the cover
    y: 330, //position of the cover
    size: 130,
    fill: "#0d4f4b",
    fills: {
        noOverlap: "#20e3d6",
        overlap: "#20e3d6",
    }
};

// constant for the third cover (phone)
const morecover = {
    x: 500, //position of the cover
    y: 120, //position of the cover
    size: 80,
    fill: "#0d4f4b",
    fills: {
        noOverlap: "#20e3d6",
        overlap: "#20e3d6",
    }
};

// constant for the fourth cover (orange)
const Iscover = {
    x: 530, //position of the cover
    y: 280, //position of the cover
    size: 80,
    fill: "#0d4f4b",
    fills: {
        noOverlap: "#20e3d6",
        overlap: "#20e3d6",
    }
};

// constant for the fifth cover (book)
const whatcover = {
    x: 600, //position of the cover
    y: 430, //position of the cover
    size: 100,
    fill: "#0d4f4b",
    fills: {
        noOverlap: "#20e3d6",
        overlap: "#20e3d6",
    }
};

const musiccover = {
    x: 315, //position of the cover
    y: 75, //position of the cover
    size: 100,
    fill: "#0d4f4b",
    fills: {
        noOverlap: "#20e3d6",
        overlap: "#20e3d6",
    }
};

const flashlight = {
    x: undefined, //position of the cover(mouseX)
    y: undefined, //position of the cover(mouseY)
    size: 200,
    fill: "#20e3d6",
};


/**
 * Created the canvas
*/
function setup() {
    angleMode(DEGREES); // make the angle mode into degrees (for the bangs)
    createCanvas(700, 700);
}


/**
 * Darwing the background and all the elements I want to add
*/
function draw() {
    background(13, 79, 75);
    drawFlashLight(); // drawing the flashlight
    drawBear(); // drawing the bear
    drawEyelids(); // drawing the eyelids
    drawBook(); //drawing the book
    drawPainting(); // drawing the painting
    drawPhone(); //drawing the phone
    drawOrange(); //drawing the orange
    drawMusic(); //darwing the music note
    drawCover(); // darwing the cover for the bear
    drawanotherCover(); //drawing for the paitning
    drawmoreCover(); //drawing the cover for the phone
    drawIsCover(); //drawing the cover for the orange
    drawwhatCover(); //drawing the cover for the book
    drawmusicCover(); // drawing the cover for the music note
    drawHair();  //drawing the hair behind my head
    drawFace(); //drawing the head
    drawBangs(); //drawing the bangs
    drawEyes(); //drawing the white part of the eyes
    drawPupils(); // drawing the pupils and the shine of the eyes
    drawNeck(); // drawing the neck
    drawBody(); //drawing the body
    drawArms(); //draw the arms
    drawLegs(); // drawing the legs
    drawMouth(); // drawing the mouth
    drawEyelids(); //drawing the eyelids
    moveCover(); // moves the cover (for the bear)
    moveanotherCover(); // moves the cover (for the painting)
    movemoreCover(); // moves the cover (for the phone)
    moveIsCover(); // moves the cover (for the orange)
    movewhatCover();//moves the cover (for the book)
    movemusicCover();//moves the cover (for the music note)
    moveFlashlight(); // moves the flashlight

    if (mouseIsPressed) {
        drawnewSky(); // draw the newsky only when the mouse is pressed
    }

    if (mouseIsPressed) { // drawing when the mouse is pressed
        drawHair();  //drawing the hair behind my head
        drawFace(); //drawing the head
        drawBangs(); //drawing the bangs
        drawEyes(); //drawing the white part of the eyes
        drawPupils(); // drawing the pupils and the shine of the eyes
        drawNeck(); // drawing the neck
        drawBody(); //drawing the body
        drawArms(); //draw the arms (i don't like them)
        drawLegs(); // drawing the legs
        drawMouth(); // drawing the mouth
        drawEyelids(); //drawing the eyelids
    }

    if (mouseIsPressed) { // drawing the coulds only when the mouse is pressed
        cloudcolor = cloudcolor - 0.5; // the color of the clouds change from white to black
        drawClouds();
    }
    else {
        cloudcolor = 255; // the clouds stay white when the mouse is not pressed
    }

}

function moveCover() {
    const d = dist(flashlight.x, flashlight.y, cover.x, cover.y);
    const overlap = (d < flashlight.size / 2 + cover.size / 2);
    if (overlap) {
        flashlight.fill = cover.fills.overlap;

        if (overlap && flashlight.x < (cover.x)) {
            cover.fill = "#00000000"; // if the flashlight and the cover overlaps then the cover turns transparent
        }

        if (overlap && flashlight.y < (cover.y)) {
            cover.fill = "#00000000"; // if the flashlight and the cover overlaps then the cover turns transparent
        }

        if (overlap && flashlight.y > (cover.y)) {
            cover.fill = "#00000000"; // if the flashlight and the cover overlaps then the cover turns transparent
        }

        if (overlap && flashlight.x > (cover.x)) {
            cover.fill = "#00000000"; // if the flashlight and the cover overlaps then the cover turns transparent
        }
    }
    else {
        cover.fill = "#0d4f4b"; // if there is no overlapping the color goes back to the original color
    }
}

function moveanotherCover() {
    const d = dist(flashlight.x, flashlight.y, anothercover.x, anothercover.y);
    const overlap = (d < flashlight.size / 2 + anothercover.size / 2);
    if (overlap) {
        flashlight.fill = anothercover.fills.overlap;

        if (overlap && flashlight.x < (anothercover.x)) {
            anothercover.fill = "#00000000"; // if the flashlight and the cover overlaps then the cover turns transparent
        }

        if (overlap && flashlight.y < (anothercover.y)) {
            anothercover.fill = "#00000000"; // if the flashlight and the cover overlaps then the cover turns transparent
        }

        if (overlap && flashlight.y > (anothercover.y)) {
            anothercover.fill = "#00000000";// if the flashlight and the cover overlaps then the cover turns transparent
        }

        if (overlap && flashlight.x > (anothercover.x)) {
            anothercover.fill = "#00000000"; // if the flashlight and the cover overlaps then the cover turns transparent
        }
    }
    else {
        anothercover.fill = "#0d4f4b"; // if there is no overlapping the color goes back to the original color
    }
}

function movemoreCover() {
    const d = dist(flashlight.x, flashlight.y, morecover.x, morecover.y);
    const overlap = (d < flashlight.size / 2 + morecover.size / 2);
    if (overlap) {
        flashlight.fill = morecover.fills.overlap;

        if (overlap && flashlight.x < (morecover.x)) {
            morecover.fill = "#00000000"; // if the flashlight and the cover overlaps then the cover turns transparent
        }

        if (overlap && flashlight.y < (morecover.y)) {
            morecover.fill = "#00000000"; // if the flashlight and the cover overlaps then the cover turns transparent
        }

        if (overlap && flashlight.y > (morecover.y)) {
            morecover.fill = "#00000000"; // if the flashlight and the cover overlaps then the cover turns transparent
        }

        if (overlap && flashlight.x > (morecover.x)) {
            morecover.fill = "#00000000"; // if the flashlight and the cover overlaps then the cover turns transparent
        }
    }
    else {
        morecover.fill = "#0d4f4b"; // if there is no overlapping the color goes back to the original color
    }
}

function moveIsCover() {
    const d = dist(flashlight.x, flashlight.y, Iscover.x, Iscover.y);
    const overlap = (d < flashlight.size / 2 + Iscover.size / 2);
    if (overlap) {
        flashlight.fill = Iscover.fills.overlap;

        if (overlap && flashlight.x < (Iscover.x)) {
            Iscover.fill = "#00000000"; // if the flashlight and the cover overlaps then the cover turns transparent
        }

        if (overlap && flashlight.y < (Iscover.y)) {
            Iscover.fill = "#00000000"; // if the flashlight and the cover overlaps then the cover turns transparent
        }

        if (overlap && flashlight.y > (Iscover.y)) {
            Iscover.fill = "#00000000"; // if the flashlight and the cover overlaps then the cover turns transparent
        }

        if (overlap && flashlight.x > (Iscover.x)) {
            Iscover.fill = "#00000000"; // if the flashlight and the cover overlaps then the cover turns transparent
        }
    }
    else {
        Iscover.fill = "#0d4f4b"; // if there is no overlapping the color goes back to the original color
    }
}

function movewhatCover() {
    const d = dist(flashlight.x, flashlight.y, whatcover.x, whatcover.y);
    const overlap = (d < flashlight.size / 2 + whatcover.size / 2);
    if (overlap) {
        flashlight.fill = whatcover.fills.overlap;

        if (overlap && flashlight.x < (whatcover.x)) {
            whatcover.fill = "#00000000"; // if the flashlight and the cover overlaps then the cover turns transparent
        }

        if (overlap && flashlight.y < (whatcover.y)) {
            whatcover.fill = "#00000000"; // if the flashlight and the cover overlaps then the cover turns transparent
        }

        if (overlap && flashlight.y > (whatcover.y)) {
            whatcover.fill = "#00000000"; // if the flashlight and the cover overlaps then the cover turns transparent
        }

        if (overlap && flashlight.x > (whatcover.x)) {
            whatcover.fill = "#00000000"; // if the flashlight and the cover overlaps then the cover turns transparent
        }
    }
    else {
        whatcover.fill = "#0d4f4b"; // if there is no overlapping the color goes back to the original color
    }
}

function movemusicCover() {
    const d = dist(flashlight.x, flashlight.y, musiccover.x, musiccover.y);
    const overlap = (d < flashlight.size / 2 + musiccover.size / 2);
    if (overlap) {
        flashlight.fill = musiccover.fills.overlap;

        if (overlap && flashlight.x < (musiccover.x)) {
            musiccover.fill = "#00000000"; // if the flashlight and the cover overlaps then the cover turns transparent
        }

        if (overlap && flashlight.y < (musiccover.y)) {
            musiccover.fill = "#00000000"; // if the flashlight and the cover overlaps then the cover turns transparent
        }

        if (overlap && flashlight.y > (musiccover.y)) {
            musiccover.fill = "#00000000"; // if the flashlight and the cover overlaps then the cover turns transparent
        }

        if (overlap && flashlight.x > (musiccover.x)) {
            musiccover.fill = "#00000000"; // if the flashlight and the cover overlaps then the cover turns transparent
        }
    }
    else {
        musiccover.fill = "#0d4f4b"; // if there is no overlapping the color goes back to the original color
    }
}

function moveFlashlight() { // falshlight is controlled by the mouse
    flashlight.x = mouseX;
    flashlight.y = mouseY;
}

//Body parts
function drawFace() {
    //drawing the face
    push();
    noStroke();
    fill(255, 240, 201);
    circle(width / 2, 250, 250);
    pop();
}

function drawHair() {
    //drawing the hair behind the head
    push();
    noStroke();
    fill(0);
    rect(225, 250, 250, 250);

    pop();
}

function drawBangs() {
    //drawing the bangs
    push();
    noStroke();
    fill(255, 240, 201);
    fill(0);
    // making the half circle for the bangs
    arc(350, 250, 250, 250, 180, 360);
    triangle(225, 250, 225, 350, 270, 250); // side bangs on the left
    triangle(430, 250, 475, 350, 475, 250); // side bangs on the right
    fill(255, 240, 201); //skin color
    triangle(350, 190, 270, 250, 430, 250); // sepereate the bangs
    pop();
}

function drawEyes() {
    push();
    noStroke();
    fill(255);
    circle(287, 275, 30); //white of left eye
    circle(412, 275, 30); //white of right eye
    pop();
}

function drawEyes() {
    push();
    noStroke();
    fill(255);
    circle(287, 275, 30); //white of left eye
    circle(412, 275, 30); //white of right eye
    pop();
}

function drawPupils() {
    let eyeLeft = { x: 287, y: 275 }; //position of the left eye
    let eyeRight = { x: 412, y: 275 }; //position of the right eye
    let eyeRadius = 15;   // half of white eye 
    let pupilRadius = 9;  // half of pupil

    // restrict pupil movement so it stays inside the eyes
    let maxOffset = eyeRadius - pupilRadius - 2;

    function pupilOffset(ex, ey) {
        let dx = mouseX - ex;
        let dy = mouseY - ey;
        let d = sqrt(dx * dx + dy * dy);
        if (d > 0) {
            let m = min(d, maxOffset);
            dx = dx / d * m;
            dy = dy / d * m;
        }
        return { dx, dy };
    }

    let left = pupilOffset(eyeLeft.x, eyeLeft.y);
    let right = pupilOffset(eyeRight.x, eyeRight.y);

    push();
    stroke(94, 42, 7);
    strokeWeight(3.5);
    fill(0);

    circle(eyeLeft.x + left.dx, eyeLeft.y + left.dy, pupilRadius * 2);
    circle(eyeRight.x + right.dx, eyeRight.y + right.dy, pupilRadius * 2);

    // shine
    noStroke();
    fill(255);
    circle(eyeLeft.x + left.dx + 3, eyeLeft.y + left.dy - 3, 3);
    circle(eyeRight.x + right.dx + 3, eyeRight.y + right.dy - 3, 3);
    pop();
}

function drawNeck() {
    push();
    noStroke();
    fill(255, 240, 201); //same color as skintone so my neck matches my head
    rect(337, 370, 26, 35); // drawing the neck
    pop();
}

function drawBody() {
    push();
    noStroke();
    fill(r, g, b); // gave myself a pink dress
    if (frameCount % 10 === 0) { // slows down the color change
        r -= change;
        g -= change;
        b += change;
        // the result is a blue dress
    }
    rect(300, 395, 100, 150); // drawing the body or dress
    pop();
}

function drawArms() {
    push();
    noStroke();
    fill(255, 240, 201); // same color as the head
    rect(400, 395, 20, 100); // right arm
    rect(280, 395, 20, 100); // left arm
    pop();
}

function drawLegs() {
    push();
    noStroke();
    fill(255, 240, 201); // same color as the neck and head
    rect(362, 545, 20, 100); // right leg
    rect(317, 545, 20, 100); // left leg
    pop();
}

function drawMouth() {
    push();
    noStroke();
    fill(117, 11, 11); // red mouth
    rect(340, 330, 20, 5); // drawing the mouth
    pop();
}

function drawEyelids() {
    //drawing eyelids to cast a shadow on the eyes
    push();
    stroke(0);
    strokeWeight(3);
    fill(0, 40);
    arc(412, 271.5, 29, 20, 180, 360); // right eyelid
    arc(287, 271.5, 29, 20, 180, 360); // left eyelid
    pop();
}

//flashlight
function drawFlashLight() {
    push();
    noStroke();
    fill(flashlight.fill);
    circle(flashlight.x, flashlight.y, 200); // the flashlight follows the mouse
    pop();
}

//things I like
function drawBear() {
    push();
    noStroke();

    //drawing the face and the ears of the bear
    fill(222, 175, 214);
    circle(83, 130, 20);
    circle(118, 130, 20);

    fill(255);
    circle(83, 130, 10);
    circle(118, 130, 10);

    fill(222, 175, 214);
    ellipse(100, 150, 50, 50);

    //drawing the eyes of the bear
    fill(0);
    circle(90, 143, 8);
    circle(110, 143, 8);

    //drawing the shine in eyes
    fill(255);
    circle(88, 142, 3);
    circle(108, 142, 3);
    ellipse(100, 160, 44, 29);

    //drawing the nose of the bear
    fill(222, 175, 214);
    ellipse(100, 150, 10, 5);

    pop();
}

function drawBook() {
    push();
    noStroke();
    //drawing the book
    //last page (blue)
    fill(52, 161, 235);
    triangle(580, 400, 600, 390, 600, 410);
    //gray page
    fill(200);
    triangle(580, 400, 615, 390, 615, 410);
    //white page 
    fill(255);
    triangle(580, 400, 625, 395, 625, 410);
    //front cover
    fill(52, 161, 235);
    rect(580, 400, 50, 65)
    //white part of the cover
    fill(255);
    rect(590, 410, 30, 20);
    pop();
}

function drawPainting() {
    push();
    //drawing the canvas
    stroke(200);
    strokeWeight(2);
    fill(255);
    rect(100, 300, 90, 65);
    //paint splotches (watercolor)
    noStroke();
    //bigger pink splotch
    fill(247, 163, 233, 80);
    ellipse(150, 330, 50, 30);
    //blue splotch
    fill(68, 189, 219, 100);
    circle(120, 320, 30);
    //yellow splotch
    fill(250, 231, 112, 160);
    circle(140, 350, 20);
    //green splotch
    fill(119, 250, 112, 90);
    circle(170, 315, 30);
    //purple splotch
    fill(173, 90, 237, 100);
    circle(120, 345, 10);
    pop();
}

function drawPhone() {
    push();
    stroke(51, 50, 69);
    strokeWeight(4); // the phone
    fill(0); // phone screen is black
    rect(480, 90, 40, 60);
    pop();
}

function drawOrange() {
    push();
    noStroke();
    fill(232, 123, 14);
    circle(540, 280, 50); //darwing the orange
    fill(25, 115, 18);
    ellipse(540, 260, 15, 5); // drawing the stem
    pop();
}

function drawMusic() {
    push();
    noStroke();
    fill(0);
    ellipse(300, 90, 20, 10);
    ellipse(340, 90, 20, 10);
    rect(305, 60, 5, 30);
    rect(345, 60, 5, 30);
    rect(305, 40, 45, 20);
    pop();
}

function drawCover() {
    push();
    noStroke();
    fill(cover.fill);
    circle(cover.x, cover.y, cover.size); // covers the bear
    pop();
}

function drawanotherCover() {
    push();
    noStroke();
    fill(anothercover.fill);
    circle(anothercover.x, anothercover.y, anothercover.size); //covers the painting
    pop();
}

function drawmoreCover() {
    push();
    noStroke();
    fill(morecover.fill);
    circle(morecover.x, morecover.y, morecover.size); //covers the phone
    pop();
}

function drawIsCover() {
    push();
    noStroke();
    fill(Iscover.fill);
    circle(Iscover.x, Iscover.y, Iscover.size); //covers the orange
    pop();
}

function drawwhatCover() {
    push();
    noStroke();
    fill(whatcover.fill);
    circle(whatcover.x, whatcover.y, whatcover.size); //covers the book
    pop();
}

function drawmusicCover() {
    push();
    noStroke();
    fill(musiccover.fill);
    circle(musiccover.x, musiccover.y, musiccover.size); //covers the book
    pop();
}

function drawnewSky() { //drawing the sky
    push();
    noStroke();
    fill(136, 218, 227);
    rect(0, 0, 700, 700);
    pop();
}

function drawClouds() { //drawing the clouds
    noStroke();
    fill(cloudcolor); // color of the clouds
    ellipse(150, 300, 60, 40);
    ellipse(140, 260, 60, 60);
    ellipse(190, 280, 70, 70);
    ellipse(100, 290, 60, 60);
    ellipse(70, 300, 40, 40);
    ellipse(230, 300, 40, 40);

    ellipse(550, 100, 60, 40);
    ellipse(540, 60, 60, 60);
    ellipse(590, 80, 70, 70);
    ellipse(500, 90, 60, 60);
    ellipse(470, 100, 40, 40);
    ellipse(630, 100, 40, 40);

    ellipse(450, 600, 60, 40);
    ellipse(440, 560, 60, 60);
    ellipse(490, 580, 70, 70);
    ellipse(400, 590, 60, 60);
    ellipse(370, 600, 40, 40);
    ellipse(530, 600, 40, 40);
}