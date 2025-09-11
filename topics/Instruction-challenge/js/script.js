/**
 * Cyberpunk City
 * Yaxuan, Ashmitha, Nerly
 * 
 * Nighttime futuristic city.
 */

"use strict";

/**
 * a big canvas to describe a nighttime background.
 * In a possible dystopian future.
*/
function setup() {
    createCanvas(500, 500);
}


/**
 * setting up the background whihc is the sky
*/
function draw() {
    background(12, 48, 133);


    /**
     * create cement
     */
    push();
    noStroke();
    fill(182, 196, 219);
    rect(0, 400, 500, 100);
    pop();
}