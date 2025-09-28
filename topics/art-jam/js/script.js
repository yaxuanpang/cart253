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
 * Darwing the background
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
    drawLegs(); // drawing the legs
    drawMouth(); // drawing the mouth
    drawBear(); // drawing the bear
}
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
    fill(255, 240, 201);
    rect(337, 370, 26, 35);
    pop();
}

function drawBody() {
    push();
    noStroke();
    fill(255, 173, 224);
    rect(285, 395, 126, 150);
    pop();
}

function drawLegs() {
    push();
    noStroke();
    fill(255, 240, 201);
    rect(362, 545, 20, 100);
    rect(317, 545, 20, 100);
    pop();
}

function drawMouth() {
    push();
    noStroke();
    fill(117, 11, 11);
    rect(340, 330, 20, 5);
    pop();
}

function drawFlashLight() {
    push();
    noStroke();
    fill(32, 227, 214);
    circle(mouseX, mouseY, 200);
    pop();
}

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