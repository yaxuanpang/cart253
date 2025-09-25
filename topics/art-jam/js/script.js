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
    createCanvas(700, 700);
}


/**
 * Darwing the background
*/
function draw() {
    background(32, 227, 214);

    //making my face
    noStroke();
    fill(255, 240, 201);
    circle(width / 2, 250, 250);

}