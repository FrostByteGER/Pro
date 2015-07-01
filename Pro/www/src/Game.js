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
      this.player.body.collideWorldBounds = true;
      this.player.animations.add('left', [16, 17, 18, 19, 20 , 21, 22, 23], 10, true);
      this.player.animations.add('right', [8, 9, 10, 11, 12, 13, 14, 15], 10, true);
      this.player.animations.add('jump', [4, 6], 10, true);
      // Change to constant camera speed
      this.game.camera.follow(this.player);
      
      
      // Ground
      this.platforms = this.add.group();
      this.platforms.enableBody = true;
      var ground = this.platforms.create(0, this.world.height - 10, 'ground');
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
      
      this.shootspeed = 0;
      this.shootcooldown = 0;
      this.bulletspeed = 500;
      this.bulletspred = 20;
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
    			  this.player.anchor.setTo(0.5,0.5);
    			  this.player.scale.x *= -1;
    		  }
    	  }else{
    		  if(this.direction == -1){
        		  this.direction = 1;
        		  this.player.anchor.setTo(0.5,0.5);
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
	    this.game.debug.cameraInfo(this.game.camera, 550, 32);
        this.game.debug.text("FPS: " + this.game.time.fps + "   Health: " + this.health || '--', 20, 70, "#00ff00", "40px Courier");
        this.game.debug.text("Mouse X: " + this.game.input.mousePointer.x + "   Mouse Y: " + this.game.input.mousePointer.y || '--', 20, 140, "#00ff00", "20px Courier");
        this.game.debug.text("Player X: " + this.player.x+25 + "   Player Y: " + this.player.y+25|| '--', 20, 200, "#00ff00", "20px Courier");
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
