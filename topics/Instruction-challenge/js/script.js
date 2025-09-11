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
     * waves 1
     */

    push();
    noStroke();
    fill(26, 37, 107);
    rect(350, 450, 100, 10);
    pop();

    /**
     * waves 2
     */

    push();
    noStroke();
    fill(26, 37, 107);
    rect(10, 410, 100, 10);
    pop();


    /**
    * waves 3
    */

    push();
    noStroke();
    fill(26, 37, 107);
    rect(30, 445, 100, 10);
    pop();

    /**
   * waves 4
   */

    push();
    noStroke();
    fill(26, 37, 107);
    rect(150, 480, 100, 10);
    pop();


    /**
   * waves 5
   */

    push();
    noStroke();
    fill(26, 37, 107);
    rect(200, 425, 100, 10);
    pop();


    /**
   * waves 6
   */

    push();
    noStroke();
    fill(26, 37, 107);
    rect(450, 420, 100, 10);
    pop();

    /**
     * window seperation 1
     */

    push();
    noStroke();
    fill(209, 212, 227);
    rect(300, 150, 100, 10);
    pop();

    /**
  * window seperation 2
  */

    push();
    noStroke();
    fill(209, 212, 227);
    rect(125, 150, 100, 10);
    pop();

    /**
     * window seperation 3
     */

    push();
    noStroke();
    fill(209, 212, 227);
    rect(300, 250, 100, 10);
    pop();

    /**
  * window seperation 4
  */

    push();
    noStroke();
    fill(209, 212, 227);
    rect(125, 250, 100, 10);
    pop();

    /**
     * building antenna
     */

    push();
    noStroke();
    fill(209, 212, 227);
    rect(170, 0, 10, 50);
    pop();

    /**
  * window 1
  */

    push();
    stroke(83, 88, 120);
    fill(94, 100, 133);
    rect(145, 170, 30, 30);
    pop();

    /**
 * window 2
 */
    push();
    stroke(83, 88, 120);
    fill(94, 100, 133);
    rect(355, 270, 30, 30);
    pop();
}