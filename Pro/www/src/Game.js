var ProShooter = ProShooter || {};

ProShooter.Game = function(){};
 
ProShooter.Game.prototype = {
 
  preload: function() {
      this.game.time.advancedTiming = true;
 
    },
 
  create: function() {
 
	  this.game.world.setBounds(0,0, 2000, 480);
	  
      //Map
      this.map = this.game.add.sprite(0,0,'levelsegment1');
      this.map.scale.setTo(1.5,1.5);
	  
      //create player
      this.player = this.game.add.sprite(100, 300, 'player');
      
      this.player = this.add.sprite(32, this.world.height - 150, 'dude');
      this.player.anchor.setTo(0.5,0.5);
      this.game.physics.arcade.enable(this.player);
      
      // Player Movementspeed
	  this.player.speedx = 300;
	  this.player.speedy = -475;
      
      this.player.body.gravity.y = 1000;
      this.player.body.bounce.y = 0.2;
      this.player.animations.add('left', [16, 17, 18, 19, 20 , 21, 22, 23], 10, true);
      this.player.animations.add('right', [8, 9, 10, 11, 12, 13, 14, 15], 10, true);
      this.player.animations.add('jump', [4, 6], 10, true);
      // Change to constant camera speed
      this.game.camera.follow(this.player);
      
      
      // Ground
      this.platforms = this.add.group();
      this.platforms.enableBody = true;
      var ground = this.platforms.create(0, this.world.height - 64, 'ground');
      ground.scale.setTo(5,2);
      ground.body.immovable = true;
      
      this.cursors = this.input.keyboard.createCursorKeys();
      this.wasd = {
              up: this.game.input.keyboard.addKey(Phaser.Keyboard.W),
              down: this.game.input.keyboard.addKey(Phaser.Keyboard.S),
              left: this.game.input.keyboard.addKey(Phaser.Keyboard.A),
              right: this.game.input.keyboard.addKey(Phaser.Keyboard.D),
      };
      
      this.direction = 1;
      this.health = 100;

      
      //shoot
      
      this.bullets = this.game.add.group();
      this.bullets.enableBody = true;
      this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
      this.bullets.createMultiple(30, 'bullet');
      this.bullets.setAll('anchor.x', 0.5);
      this.bullets.setAll('anchor.y', 1);
      this.bullets.setAll('outOfBoundsKill', true);
      this.bullets.setAll('checkWorldBounds', true);
      
      this.shootspeed = 5;
      this.shootcooldown = 0;
      this.bulletspeed = 500;
      this.bulletspred = 2;
      this.bulletpershoot = 1;
      
      this.bulletxp = 0;
      
      this.fireButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);  
 }, 

  update: function() {
 
	  this.physics.arcade.overlap(this.platforms, this.bullets, this.collectBullet , null, this);
	  
	  this.physics.arcade.collide(this.player, this.platforms);
	  
      //  Reset the players velocity (movement)
      this.player.body.velocity.x = 0;

      if (this.cursors.left.isDown || this.wasd.left.isDown)
      {
          //  Move to the left
          this.player.body.velocity.x = -this.player.speedx;

          this.player.animations.play('left');
          this.direction = -1;
          
      }
      else if (this.cursors.right.isDown|| this.wasd.right.isDown)
      {
          //  Move to the right
          this.player.body.velocity.x = this.player.speedx;

          this.player.animations.play('right');
          this.direction = 1;
      }
      else if(this.player.body.velocity.x == 0 || this.player.body.velocity.y == 0 && this.player.body.touching.down)
      {
          //  Stand still
          this.player.animations.stop();
          if(this.direction == -1){
        	  this.player.frame = 1;
          }else if(this.direction == 1){
        	  this.player.frame = 0;
          }
      }
      
      if ((this.cursors.up.isDown || this.wasd.up.isDown) && this.player.body.touching.down)
      {
          this.player.body.velocity.y = this.player.speedy;
          
      }
      
      if (this.fireButton.isDown || this.game.input.activePointer.isDown) {
  	    //  Grab the first bullet we can from the pool
    	  
    	  if(this.game.input.mousePointer.x < this.playermidx){
    		  if(this.direction == 1){
    			  this.direction = -1;
    			  this.player.scale.x *= -1;
    		  }
    	  }else{
    		  if(this.direction == -1){
        		  this.direction = 1;
        		  this.player.scale.x *= -1;
    		  }
    	  }
    	  
    	  
    	  if(this.shootcooldown == 0){
        	  for (var i = 0; i < this.bulletpershoot; i++) {
        		  this.fireBullet();
        	  }
        	  this.shootcooldown = this.shootspeed;
    	  }
    	  
      }

      if(this.shootcooldown > 0){
    	  this.shootcooldown--;
      }
  },
 
  render: function()
 
    {
 
        this.game.debug.text("FPS: " + this.game.time.fps + "   Health: " + this.health || '--', 20, 70, "#00ff00", "40px Courier");
        //this.game.debug.text("Fisch: "+this.bulletangle|| '--', 20, 70, "#00ff00", "40px Courier");
        
    },
 
	fireBullet: function() {
	  	    var bullet = this.bullets.getFirstExists(false);
	  	  	
	  	    this.playermidx = this.player.x+25;
	  	    this.playermidy = this.player.y+25;
	  	    
	  	    this.mousx = this.game.input.mousePointer.x;
	  	    this.mousy = this.game.input.mousePointer.y;
	  	    
	  	    this.bulletangle = Math.atan((this.mousy-this.playermidy)/(this.mousx-this.playermidx))+(this.game.rnd.integerInRange(-this.bulletspred, this.bulletspred)/100);   
	  	    
	  	    if (bullet && this.shootcooldown == 0)
	  	    {	
	  	    	//left
	  	    	if(this.direction == -1){
	  	  	    	//  And fire it
	  	  	        //bullet.reset(this.player.x+10, this.player.y+27);
	  	    		bullet.reset(this.player.x, this.player.y);
	  	  	        
	  	  	        this.game.physics.arcade.velocityFromRotation(this.bulletangle,-this.bulletspeed,bullet.body.velocity);
	  	  	        
	  	  	        bullet.rotation = this.bulletangle+Math.PI;
	  	    	}else if(this.direction == 1){
	  	    		//right
	  	  	    	//  And fire it
	  	    		//bullet.reset(this.player.x+42, this.player.y+27);
	  	    		bullet.reset(this.player.x, this.player.y);
	  	    		this.game.physics.arcade.velocityFromRotation(this.bulletangle,this.bulletspeed,bullet.body.velocity);
	  	    		bullet.rotation = this.bulletangle;
	  	    	}
	  	    }
	  	    
	  	    //  Make bullet come out of tip of ship with right angle
	  	    

	  	    
	},
	
	collectBullet: function (platform, bullet){
		bullet.kill();
    }
  
  
  
};
































/*

// create BasicGame Class
BasicGame = {

};

// create Game function in BasicGame
BasicGame.Game = function (game) {
};


var player;
var platforms;
var cursors;
var stars;
var score = 0;
var scoreText;

// set Game function prototype
BasicGame.Game.prototype = {

    init: function () {
        // set up input max pointers
        this.input.maxPointers = 1;
        // set up stage disable visibility change
        this.stage.disableVisibilityChange = true;
        // Set up the scaling method used by the ScaleManager
        // Valid values for scaleMode are:
        // * EXACT_FIT
        // * NO_SCALE
        // * SHOW_ALL
        // * RESIZE
        // See http://docs.phaser.io/Phaser.ScaleManager.html for full document
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        // If you wish to align your game in the middle of the page then you can
        // set this value to true. It will place a re-calculated margin-left
        // pixel value onto the canvas element which is updated on orientation /
        // resizing events. It doesn't care about any other DOM element that may
        // be on the page, it literally just sets the margin.
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;
        // Force the orientation in landscape or portrait.
        // * Set first to true to force landscape. 
        // * Set second to true to force portrait.
        this.scale.forceOrientation(true, false);
        // Sets the callback that will be called when the window resize event
        // occurs, or if set the parent container changes dimensions. Use this 
        // to handle responsive game layout options. Note that the callback will
        // only be called if the ScaleManager.scaleMode is set to RESIZE.
        this.scale.setResizeCallback(this.gameResized, this);
        // Set screen size automatically based on the scaleMode. This is only
        // needed if ScaleMode is not set to RESIZE.
        this.scale.setScreenSize(true);
        // Re-calculate scale mode and update screen size. This only applies if
        // ScaleMode is not set to RESIZE.
        this.scale.refresh();

    },


    preload: function () {

        // Here we load the assets required for our preloader (in this case a 
        // background and a loading bar)
        //this.load.image('logo', 'asset/phaser.png');
        this.load.image('sky','asset/sky.png');
        this.load.image('ground','asset/platform.png');
        this.load.image('star','asset/star.png');
        this.load.spritesheet('dude','asset/dude.png', 32, 48);
    },

    create: function () {
        this.physics.startSystem(Phaser.Physics.ARCADE);
        this.sky = this.add.sprite(0,0, 'sky');
        this.sky.scale.setTo(4,1);
        
        platforms = this.add.group();
        
        platforms.enableBody = true;
        
        var ground = platforms.create(0, this.world.height - 64, 'ground');
        ground.scale.setTo(5,2);
        ground.body.immovable = true;
        var ledge = platforms.create(400,300, 'ground');
        ledge.body.immovable = true;
        
        ledge = platforms.create(-150, 250, 'ground');
        
        ledge.body.immovable = true;
        
        // Add logo to the center of the stage
        //this.logo = this.add.sprite(
           // this.world.centerX, // (centerX, centerY) is the center coordination
           // this.world.centerY,
           // 'logo');
        //this.star = this.add.sprite(0,0, 'star');
        // Set the anchor to the center of the sprite
        //this.logo.anchor.setTo(0.5, 0.5);
        
        
            // The player and its settings
        player = this.add.sprite(32, this.world.height - 150, 'dude');

        //  We need to enable physics on the player
        this.physics.arcade.enable(player);

        //  Player physics properties. Give the little guy a slight bounce.
        player.body.bounce.y = 0.2;
        player.body.gravity.y = 300;
        player.body.collideWorldBounds = true;

        //  Our two animations, walking left and right.
        player.animations.add('left', [0, 1, 2, 3], 10, true);
        player.animations.add('right', [5, 6, 7, 8], 10, true);
        
        stars = this.add.group();
        stars.enableBody = true;
        
        for(var i = 0; i < 12; i++){
            var star = stars.create(i * 70, 0, 'star');
            star.body.gravity.y = 200;
            star.body.bounce.y = 0.3 + Math.random() * 0.2;
        }
        
        scoreText = this.add.text(16,16, 'score: 0', { fontSize: '32px', fill: '#000'});
        
        
        cursors = this.input.keyboard.createCursorKeys();

    },
    
    update: function () {
        this.physics.arcade.collide(player, platforms);
        this.physics.arcade.collide(stars, platforms);
        this.physics.arcade.overlap(player, stars, this.collectStar, null, this);
        
            //  Reset the players velocity (movement)
        player.body.velocity.x = 0;

        if (cursors.left.isDown)
        {
            //  Move to the left
            player.body.velocity.x = -150;

            player.animations.play('left');
        }
        else if (cursors.right.isDown)
        {
            //  Move to the right
            player.body.velocity.x = 150;

            player.animations.play('right');
        }
        else
        {
            //  Stand still
            player.animations.stop();

            player.frame = 4;
        }

        //  Allow the player to jump if they are touching the ground.
        if (cursors.up.isDown && player.body.touching.down)
        {
            player.body.velocity.y = -275;
        }
    },

        
        
    collectStar: function (player, star){
        star.kill();
        score += Number.MAX_VALUE;
        scoreText.text = 'Score: ' + score;
    },

    gameResized: function (width, height) {

        // This could be handy if you need to do any extra processing if the 
        // game resizes. A resize could happen if for example swapping 
        // orientation on a device or resizing the browser window. Note that 
        // this callback is only really useful if you use a ScaleMode of RESIZE 
        // and place it inside your main game state.

    }


};*/
