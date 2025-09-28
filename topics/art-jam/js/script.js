/**
 * Art-Jam: Self Portrait
 * Yaxuan Pang
 * 
 * This is an interactive self portrait.
 */

"use strict";

//let drawSunGlasses = false;

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
    background(32, 227, 214);
    // fill(0, 0, 0, 200);
    // rect(0, 0, 700, 700);
    drawHair();  //drawing the hair behind my head
    drawFace(); //drawing the head
    drawBangs(); //drawing the bangs
    drawEyes(); //drawing the eyes
    drawPupils();
    drawNeck();
    drawBody();
    drawLegs();
    drawMouth();
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
    fill(0);
    // making the half circle for the bangs
    arc(350, 250, 250, 250, 180, 360);
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