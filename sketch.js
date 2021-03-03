//declaring the variables

var drop1,drop1Img,drop1Group;
var drop2,drop2Img,drop2Group;
var bucket,bucketImg,woodbucket;
var bg;
var snow,snowImg,snowGroup;

var drop1Sound,drop2Sound,snowSound;
var water = 0;

var river,riverHeight=5;
var gameOver,gameOverImg;

var reset,resetImg;

//adding the game state

var PLAY = 1;
var END = 0;
var PAUSE = -1;
var gameState = PLAY;

//loading images and sound

function preload()
{
  bg = loadImage("rain.jpg");
  bucketImg=loadImage("bucket5.png");
  woodbucket = loadImage("wooden-bucket.png");
  
  drop1Img = loadImage("drop1.jpg");
  drop2Img = loadImage("drop2.png");
  snowImg = loadImage("snowflake1.png");
  
  drop1Sound = loadSound("drop1_sound.mp3");
  drop2Sound = loadSound("drop2_sound.mp3");
  snowSound = loadSound("Snowing-Sound.mp3");
  
  gameOverImg = loadImage("game-over.png");
  
  resetImg = loadImage("reset.png");
  
}

function setup()
{
  createCanvas(600, 500);
  
 // creating the bucket
  
  bucket = createSprite(500,430,10,10); 
  bucket.addImage("bucket",bucketImg);
  bucket.addImage("wood",woodbucket);
  bucket.scale = 0.5
  bucket.setCollider("circle",0,0,60);
  
  //creating the groups  
  
  drop1Group = new Group();
  drop2Group = new Group();
  snowGroup = new Group();
  
  //Creating the edges
  
  edge = createEdgeSprites();
  
  //Game over 
  
  gameOver = createSprite(300,250,40,40);
  gameOver.addImage(gameOverImg);
  gameOver.visible = false;
  
  //reset
  
  reset = createSprite(550,50,50,50);
  reset.addImage(resetImg);
  reset.scale = 0.13;
    
}

function draw() 
{
  background(bg);

  //Game in PLAY state
  
 if(gameState===PLAY)
   { 
    reset.visible = false;
    bucket.changeImage('wood');
    bucket.scale= 0.5;
    bucket.x= mouseX;
  
    var select_drop = Math.round(random(1,3));
      if(select_drop ===1 )
       {
        spawnDrop1();
       }
      else if(select_drop === 2)
        {
          spawnDrop2();
        }
      else
        {
          spawnSnow();
        }
  
      
 //Destroying the smaller drop   
     
    for(var i=0;i<drop1Group.length;i++)
     {
      if(drop1Group.get(i).isTouching(bucket))
        {
          drop1Sound.play();
          water = water+2;
          drop1Group.get(i).destroy();
          //console.log("small drop touched");
        }
      }
     
 //Destroying the larger drop 
     
    for(var j=0;j<drop2Group.length;j++)
    {
        if(drop2Group.get(j).isTouching(bucket))
          {
            drop2Sound.play();
            water = water+4;
            drop2Group.get(j).destroy();
          }
     }
   
  
 //Creating the river
     
      if(drop2Group.isTouching(edge[3]) || drop1Group.isTouching(edge[3])) 
        {
          river = createSprite(600,500,1500,riverHeight);
          riverHeight = riverHeight+2;
          river.shapeColor= "skyblue";
        }
     
  //Destroying the snow flake
     
     if(snowGroup.isTouching(bucket))
        {
          snowSound.play();
          water = water-10; 
          bucket.changeImage('bucket'); 
          bucket.scale =0.2;
          //snow.velocityY = 0;
          snow.remove();
          //snow.visible = false;
          gameState = PAUSE;
        }        
      
  //Checking for the END state
     
     if(riverHeight > bucket.height || water < 0)
         {
          gameState = END;
          drop2Group.setVelocityYEach(0);
          drop1Group.setVelocityYEach(0);   
          snowGroup.setVelocityYEach(0);
         }
     
  } 
   //Game in End state
  
   else if(gameState === END)
       {
       gameOver.scale = 3;
       gameOver.visible = true;
       reset.visible = false;
       river.visible = false;
       snowGroup.destroyEach();
       drop2Group.setLifetimeEach(-1);
       drop1Group.setLifetimeEach(-1);
       snowGroup.setLifetimeEach(-1);
      }
  
  //Game in PAUSE state
    else if(gameState === PAUSE)
      {
        reset.visible = true;
      }
   
 // Mouse Pressed function is called     
  
  if(mousePressedOver(reset))
    restart();
  
  drawSprites();
  
  //Displaying the amount of water collected
  fill("black")
  stroke("cyan");
  textFont("algerian");
  textSize(22);
  text("WATER COLLECTED : "+water +"  Ltr",5,30);
}

//Creating smaller drops

function spawnDrop1()
{
  if(frameCount % 30 === 0)
    {
      drop1 = createSprite(Math.round(random(50,500),0,10,10));
      drop1.addImage(drop2Img);
      drop1.scale = 0.1;
      drop1.velocityY = 20+(3*water/2);
      drop1.lifetime = 100;
      drop1Group.add(drop1);
     }
}

//Creating larger drops

function spawnDrop2()
{
  if(frameCount % 60 === 0 )
    {
      drop2 = createSprite(Math.round(random(20,300),0,10,10));
      drop2.addImage(drop2Img);
      drop2.scale = 0.2;
      drop2.velocityY=15+(3*water/2);
      drop2.lifetime = 100;
      drop2Group.add(drop2);
      
   }
}

//creating the Snow-Flakes

function spawnSnow()
{
  if(frameCount % 180 === 0 )
    {
      snow = createSprite(Math.round(random(30,400),0,10,10));
      snow.addImage(snowImg);
      snow.scale = 0.2;
      snow.velocityY=15;
      snow.lifetime = 100;
      snowGroup.add(snow);
      
    }
}

//Restart function

function restart()
{ 
  gameState = PLAY;
  bucket.changeImage('wood');
  bucket.scale= 0.5;
  reset.visible = false;
  
  
}