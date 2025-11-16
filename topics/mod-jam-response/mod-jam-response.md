# cart253
This is Yaxuan’s coursework repository for CART253

Christie Xue-Ying Leung 
https://christieleung.github.io/cart253/assignments/mod-jam/
I really liked the music and the sound effects in this game. It made the experience a lot more immersive and atmospheric. The Animal Crossing background music she picked is very fitting for her project. It is relaxing and it makes me want to go to sleep like the frog. I like that there is a different sound effect for when the player is playing the game, when the frog is hungry and when the frog goes to sleep. There was clearly a lot of thought that went into the choice of music. The names for each sound effect in the preload function explains their role in the game, whether it is for the bubble, the sparkle or night. Her code is also really well organized with states, which is something I can use in my own works. It is very simplistic and easy to understand. Each element shows up when it is in the corresponding state. My code is very messy compared to Christie's and I can definitely learn from her to organize it better.

Lucas Meldrum
https://lucasmeldrum.github.io/CART253/topics/assignments/mod-jam
I really enjoyed playing this game. I like that there are different phases for the boss fight and that each phase it gets harder to win the game. There is a boss fly that the player has to fight and that shoots projectiles. Especially in phase 3 of the boss fight, the projectile flies follow the frog and attack it which is made possible by variables and a for loop in the moveSummonedFly function. This element makes the experience really fun because I was not expecting the boss fly to attack the frog and it reminds me of those boss fights in games that I used to play. 

I also like the idea that the phases of the boss fight is based on how much health the boss fly is at, which is shown here:

if (boss.health <= 20 && boss.health > 10) {
    boss.phase = 2;
  }
  else if (boss.health <= 10) {
    boss.phase = 3;
  }

It makes the game more predictable every time I play again. I feel like I might be able to beat the boss if I learn from my mistakes. 

Ashmitha Kanagiah
https://ashmyytaa.github.io/cart253/jams/mod-jam/  
This game was really fun to play. I like the idea of locating the frog underwater instead of on land. It was an original idea that shows a lot of thought and creativity. The feature I like the most about the game is the background. She uses perlin noise to make waves that are different colors and it really gives the impression that the frog is deep underwater. Not only did she make waves, but she also made them move up and down like waves with this line of code:

let move = noiseScale * frameCount;

The moving waves combined with the slower tongue speed made the experience a lot more relaxing and slow, which I really enjoyed. I also really liked the gold mine. It is a beautiful ending to the game. The gold circles contrasted the water really well and it looked like I stumbled into an actual gold mine.
