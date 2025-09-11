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
    background(84, 196, 240);


    /**
     * create waterfront
     */
    push();
    noStroke();
    fill(33, 89, 181);
    rect(0, 400, 500, 100);
    pop();

    /**
     * create skyscrapers
     */

    /**
     * creating skyscraper 1
     */

    push();
    noStroke();
    fill(115, 117, 120);
    rect(125, 50, 100, 350);
    pop();

    /**
     * creating skyscraper 2
     */

    push();
    noStroke();
    fill(115, 117, 120);
    rect(300, 50, 100, 350);
    pop();

    /**
     * waves
     */

    push();
    noStroke();
    fill(26, 37, 107);
    rect(350, 450, 100, 10);
    pop();
}