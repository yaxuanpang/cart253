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
    background(32, 227, 214);
    drawHair();  //drawing the hair behind my head
    drawFace(); //drawing the head
    drawBangs(); //drawing the bangs
    drawEyes(); //drawing the eyes
    drawPupils();
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
    circle(287, 275, 16); //pupils of left eye
    circle(412, 275, 16); //pupils of right eye
    noStroke();
    fill(255);
    circle(290, 272, 3); //shine of left eye
    circle(415, 272, 3); //shine of right eye
    pop();
}


// if (mouseY >= 260 & mouseY <= 290) {
//     if (mouseX >= 242 & mouseX <= 272) {
//         circle(mouseX, mouseY, 10);
//     }
//     else if (mouseX < 242) {
//         circle(242, mouseY, 10);
//     }
//     else if (mouseX > 272) {
//         circle(272, mouseY, 10);
//     }
// }


// else if (mouseY < 260) {
//     if (mouseX > 225 & mouseX < 475) {
//         circle(mouseX, 0, 100, 100, 0, 180);
//     }
//     else if (mouseX < 225) {
//         circle(225, 0, 100, 100, 0, 180);
//     }
//     else if (mouseX > 290) {
//         circle(475, 0, 100, 100, 0, 180);
//     }
// }

// else {
//     if (mouseX > 225 & mouseX < 475) {
//         circle(mouseX, 400, 100, 100, 0, 180);
//     }
//     else if (mouseX < 225) {
//         circle(225, 400, 100, 100, 0, 180);
//     }
//     else if (mouseX > 475) {
//         circle(475, 400, 100, 100, 0, 180);
//     }
// }