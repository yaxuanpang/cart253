/**
 * Art-Jam: Self Portrait
 * Yaxuan Pang
 * 
 * This is an interactive self portrait. 
 */

"use strict";

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
    //drawFlashLight(); // drawing the flashlight
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
    drawBear(); // drawing the bear
    drawEyelids(); // drawing the eyelids
    drawBook(); //drawing the book
    drawPainting(); // drawing the painting
    drawPhone(); //drawing the phone
    drawOrange(); //drawing the orange
    drawCover(); // darwing the cover
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
    fill(255, 240, 201);
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

function drawPupils() {
    push();
    stroke(94, 42, 7); //gave myself dark brown eyes :)
    strokeWeight(3.5); //iris
    fill(0);
    circle(287, 275, 18); //pupils of left eye
    circle(412, 275, 18); //pupils of right eye
    noStroke();
    fill(255);
    circle(290, 272, 3); //shine of left eye
    circle(415, 272, 3); //shine of right eye
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
    fill(255, 173, 224); // gave myself a pink dress
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
    fill(32, 227, 214);
    circle(mouseX, mouseY, 200); // the flashlight follows the mouse
    pop();
}

//things I like
function drawBear() {
    push();
    noStroke();
    // //arms of the bear
    // fill(222, 175, 214);
    // circle(75, 178, 20);
    // circle(127, 178, 20);

    // //legs of the bear
    // ellipse(113, 207, 15, 30);
    // ellipse(90, 207, 15, 30);

    // // drawing the body of the bear
    // fill(222, 175, 214);
    // ellipse(101, 180, 50, 55);

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

function drawCover() {
    push();
    noStroke();
    //fill(13, 79, 75);
    fill(0);
    circle(100, 150, 80); // covers the bear
    circle(150, 330, 130); //covers the painting
    circle(500, 120, 80); //covers the phone
    circle(530, 280, 80); //covers the orange
    circle(600, 430, 100); //covers the book
    pop();
}