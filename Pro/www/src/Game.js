var ProShooter = ProShooter || {};

ProShooter.Game = function() {
};

ProShooter.Game.prototype = {

	preload : function() {
		this.game.time.advancedTiming = true;

		this.musictrack = this.game.rnd.integerInRange(0,2);
		if(this.musictrack == 2){
			this.music = this.game.add.audio('action1');
		}else if(this.musictrack == 1){
			this.music = this.game.add.audio('action2');
		}else{
			this.music = this.game.add.audio('action3');
		}
		this.damagesfx = this.game.add.audio('damage');
		this.damagesfx.volume  = 0.2;
		this.lasersfx1 = this.game.add.audio('laserbullet1');
		this.lasersfx1.volume = 0.05;
		this.lasersfx2 = this.game.add.audio('laserbullet2');
		this.lasersfx2.volume = 0.2;
		this.music.loop = true;
		this.music.volume = 0.12;
		this.music.play();
	},

	create : function() {
		
		// redWall
		
		this.redWallSpeed = 2;
		this.redWallbuffer = 50;
		this.redWallX = -this.redWallbuffer;
		
		
		this.boundsXmax = 1600;
		this.boundsXmin = 0;
		this.game.world.setBounds(this.boundsXmin, 0, this.boundsXmax, 600);
		
		// Map
		this.map = this.add.group();
		this.map.create(0,0, 'background');
		//this.map.create(0,0, 'buildings')
		//this.game.add.sprite(0, 0, 'map');

		this.player = this.add.sprite(32, this.world.height - 150, 'dude');
		this.game.physics.arcade.enable(this.player);

		// Player Movementspeed
		this.player.speedx = 300;
		this.player.speedy = -475;
		this.player.health = 100;
		this.player.body.gravity.y = 1000;
		this.player.body.bounce.y = 0.0;
		this.player.sfx = this.damagesfx;
		this.player.deathsfx = this.damagesfx;
		this.player.body.collideWorldBounds = true;
		this.player.animations.add('left', [ 16, 17, 18, 19, 20, 21, 22, 23 ],
				10, true);
		this.player.animations.add('right', [ 8, 9, 10, 11, 12, 13, 14, 15 ],
				10, true);
		this.player.animations.add('jump', [ 4, 6 ], 10, true);
		// Change to constant camera speed
		this.game.camera.follow(this.player);

		// Ground
		this.platforms = this.add.group();
		this.platforms.enableBody = true;
		this.ground = this.add.sprite(0, this.world.height - 32, 'surface');
		this.game.physics.arcade.enable(this.ground);
		this.ground.body.immovable = true;
		
		this.addPlatform(0,this.world.height - 48,5);
		this.platformsize = 5;
		
		this.lastPlatformY = this.world.height - 48;
		this.lastPlatformX = 6*16;
		

		this.cursors = this.input.keyboard.createCursorKeys();
		this.wasd = {
			up : this.game.input.keyboard.addKey(Phaser.Keyboard.W),
			down : this.game.input.keyboard.addKey(Phaser.Keyboard.S),
			left : this.game.input.keyboard.addKey(Phaser.Keyboard.A),
			right : this.game.input.keyboard.addKey(Phaser.Keyboard.D),
		};

		this.direction = 1;

		// shoot
		this.bullets = this.game.add.group();
		this.bullets.enableBody = true;
		this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
		this.bullets.createMultiple(30, 'bullet');
		this.bullets.setAll('anchor.x', 0.5);
		this.bullets.setAll('anchor.y', 1);
		this.bullets.setAll('outOfBoundsKill', true);
		this.bullets.setAll('checkWorldBounds', true);
		this.enemybullets = this.game.add.group();
		this.enemybullets.enableBody = true;
		this.enemybullets.physicsBodyType = Phaser.Physics.ARCADE;
		this.enemybullets.createMultiple(25, 'laserbullet');
		this.enemybullets.setAll('anchor.x', 0.5);
		this.enemybullets.setAll('anchor.y', 1);
		this.enemybullets.setAll('outOfBoundsKill', true);
		this.enemybullets.setAll('checkWorldBounds', true);

		this.shootspeed = 5;
		this.shootcooldown = 0;
		this.bulletspeed = 500;
		this.bulletspred = 2;
		this.bulletpershoot = 1;
		this.bulletxp = 0;
		
		this.playerShootAngleY = 0;
		this.playerShootAngleX = 0;
		
		this.fireButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		
		// mobs
		this.mobs = this.add.group();
		
		this.mobs.enableBody = true;
		this.mobs.physicsBodyType = Phaser.Physics.ARCADE;
		
		this.pickups = this.game.add.group();
	    //music.play();

	},

	update : function() {

		this.physics.arcade.overlap(this.bullets, this.platforms, this.collectBullet, null, this);
		this.physics.arcade.overlap(this.player, this.mobs, this.damagePlayer, null, this);
		this.physics.arcade.overlap(this.mobs, this.bullets, this.hitMob, null, this);
		this.physics.arcade.overlap(this.player, this.enemybullets, this.damagePlayer, null, this);
		this.physics.arcade.overlap(this.enemybullets, this.platforms, this.collectBullet, null, this);
		this.physics.arcade.collide(this.player, this.platforms);
		this.physics.arcade.collide(this.player, this.ground);
		this.physics.arcade.collide(this.mobs, this.ground);
		this.physics.arcade.collide(this.mobs, this.platforms);
		
		for(var i = 0; i < this.mobs.length; i++){
			var enemy = this.mobs.getAt(i);
			if(enemy.inCamera){
				if (enemy.fireCooldown == 0) {
					for (var i = 0; i < enemy.bulletsPerSalve; i++) {
						var x = 0;
						if(enemy.direction == 'left'){
							x = -1;
						}else{
							x = 1;
						}
						if(enemy.x > this.player.x && x == -1){
							this.fireBullet(enemy.x, enemy.y - 30, enemy.x + x, enemy.y - 30, this.enemybullets, 2, 300, this.lasersfx2);
						}else if(enemy.x < this.player.x && x == 1){
							this.fireBullet(enemy.x, enemy.y - 30, enemy.x + x, enemy.y - 30, this.enemybullets, 2, this.lasersfx2);
						}
						
					}
					enemy.fireCooldown = 20;
				}

				if (enemy.fireCooldown > 0) {
					enemy.fireCooldown--;
				}
				

			}
		}


		// Reset the players velocity (movement)
		this.player.body.velocity.x = 0;		
		if (this.wasd.left.isDown) {
			this.player.body.velocity.x = -this.player.speedx;
			
			this.player.animations.play('left');
			this.direction = -1;
			this.playerShootAngleX = -1;
		} else if (this.wasd.right.isDown) {
			
			this.player.body.velocity.x = this.player.speedx;

			this.player.animations.play('right');
			this.direction = 1;
			this.playerShootAngleX = 1;
		} else if (this.player.body.velocity.x == 0
				|| this.player.body.velocity.y == 0
				&& this.player.body.touching.down) {
			
			this.player.animations.stop();
			if (this.direction == -1) {
				this.player.frame = 1;			
			} else if (this.direction == 1) {
				this.player.frame = 0;
			}
		}
		
		if ((this.wasd.up.isDown)
				&& this.player.body.touching.down) {
			this.player.body.velocity.y = this.player.speedy;

		}
		
		if(this.cursors.up.isDown){
			this.playerShootAngleY = -1;
		}else if(this.cursors.down.isDown){
			this.playerShootAngleY = 1;
		}else{
			this.playerShootAngleY = 0;
		}
		
		if(this.cursors.left.isDown){
			this.playerShootAngleX = -1;
		}else if(this.cursors.right.isDown){
			this.playerShootAngleX = 1;
		}else{
			this.playerShootAngleX = 0;
		}
		
		if(this.playerShootAngleX == 0 && this.playerShootAngleY == 0){
			this.playerShootAngleX = this.direction;
		}
		
		if (this.fireButton.isDown) {
			if (this.shootcooldown == 0) {
				for (var i = 0; i < this.bulletpershoot; i++) {
					this.fireBulletPlayer();
				}
				this.shootcooldown = this.shootspeed;
			}

		}

		if (this.shootcooldown > 0) {
			this.shootcooldown--;
		}
		
		for(var i = 0; i < this.mobs.length; i++){
			var mob = this.mobs.getAt(i);
			if(mob.direction == 'right' && mob.x <= mob.range + mob.spawnposition.x){
				mob.x += 2;
			}else if(mob.direction == 'right'){
				mob.direction = 'left';
				mob.scale.x *= -1;
			}
			
			if(mob.direction == 'left' && mob.x >= mob.spawnposition.x - mob.range){
				mob.x -= 2;
			}else if(mob.direction == 'left'){
				mob.direction = 'right';
				mob.scale.x *= -1;
			}
		}
	
		if(this.lastPlatformX-2000 < this.game.camera.x){
			this.addRandomPlatform();
		}
		
		if(this.player.x+800 > this.boundsXmax){
			this.map.x = this.player.x-800;
			this.boundsXmax = this.player.x+1600;
			this.boundsXmin = this.player.x-800;
			if(this.boundsXmin < 0){
				this.boundsXmin = 0;
			}
			this.game.world.setBounds(this.boundsXmin, 0, this.boundsXmax, 600);
		}
		
		if(this.redWallX < this.boundsXmin-this.redWallbuffer){
			this.redWallX = this.boundsXmin-this.redWallbuffer;
		}
		
		for(var i = 0 ; i < this.platforms.length ; i++){
			var tile = this.platforms.children[i];
			
			if(tile.x < this.boundsXmin || tile.x < this.redWallX){					
				this.platforms.remove(tile);
				tile.kill;
			}
		}
		
		this.redWallX += this.redWallSpeed;
		
	},

	render : function(){
		//this.game.debug.body(this.player);
		for(var i = 0; i < this.mobs.countLiving(); i++){
			//this.game.debug.body(this.mobs.getAt(i));
		}
		this.game.debug.cameraInfo(this.game.camera, 550, 32);
		this.game.debug.text("FPS: " + this.game.time.fps + "   Health: "
				+ this.mobs.getAt(0).health || '--', 20, 70, "#00ff00", "40px Courier");
		this.game.debug.text("Mouse X: " + this.game.input.mousePointer.x
				+ "   Mouse Y: " + this.game.input.mousePointer.y || '--', 20,
				140, "#00ff00", "20px Courier");
		this.game.debug.text("Player X: " + this.player.x + 25
				+ "   Player Y: " + this.player.y + 25 || '--', 20, 200,
				"#00ff00", "20px Courier");
		this.game.debug.text(this.boundsXmax+" "+this.boundsXmin || '--', 20, 230,
				"#00ff00", "20px Courier");
	},

	fireBullet : function(scrIntx, scrInty, endIntx, endInty, bulletGroup,
			bulletSpread, bulletSpeed, sfx) {
		var bullet = bulletGroup.getFirstExists(false);

		this.bulletangle = Math.atan((endInty - scrInty) / (endIntx - scrIntx))
				+ (this.game.rnd.integerInRange(-bulletSpread, bulletSpread) / 100);

		if (bullet) {
			if (scrIntx <= endIntx) {
				// right
				// And fire it
				bullet.reset(scrIntx, scrInty);
				// bullet.reset(this.player.x, this.player.y);
				this.game.physics.arcade.velocityFromRotation(this.bulletangle,
						bulletSpeed, bullet.body.velocity);
				bullet.rotation = this.bulletangle;
			} else {
				// And fire it
				bullet.reset(scrIntx, scrInty);
				// bullet.reset(this.player.x, this.player.y);

				this.game.physics.arcade.velocityFromRotation(this.bulletangle, -bulletSpeed, bullet.body.velocity);

				bullet.rotation = this.bulletangle + Math.PI;
			}
			sfx.play();
		}
	},

	fireBulletPlayer : function() {
		var bullet = this.bullets.getFirstExists(false);

		this.playermidx = this.player.x + 25;
		this.playermidy = this.player.y + 25;

		this.mousx = this.game.input.mousePointer.x + this.game.camera.x;
		this.mousy = this.game.input.mousePointer.y;

		if (this.direction == -1) {
			this.fireBullet(this.player.x + 10, this.player.y + 27,this.player.x + 10 + this.playerShootAngleX,
					this.player.y + 27 + this.playerShootAngleY, this.bullets, this.bulletspred,
					this.bulletspeed, this.lasersfx1);
		} else {
			this.fireBullet(this.player.x + 42, this.player.y + 27, this.player.x + 42 + this.playerShootAngleX,
					this.player.y + 27 + this.playerShootAngleY, this.bullets, this.bulletspred,
					this.bulletspeed, this.lasersfx1);
		}
	},
	
	addPlatform : function(intx ,inty ,size){
		
		var palt = this.platforms.create(intx,inty, 'plat_start');
		palt.body.immovable = true;
		
		for (var i = 1; i < size; i++) {
			var palt = this.platforms.create(intx+(i*palt.width),inty, 'plat_mit');
			palt.body.immovable = true;
		}
		
		var palt = this.platforms.create(intx+(size*palt.width),inty, 'plat_end');
		palt.body.immovable = true;
		
	},
	
	addRandomPlatform : function(){
		
		this.lastPlatformX = this.lastPlatformX+(this.platformsize+1)*(16)+this.game.rnd.integerInRange(0,200);
		
		this.lastPlatformY = this.lastPlatformY+this.game.rnd.integerInRange(-50,50);
		
		this.platformsize = this.game.rnd.integerInRange(5,10);
		
		if(this.lastPlatformY < 100){
			this.lastPlatformY = 200+this.lastPlatformY+this.game.rnd.integerInRange(0,50);
		}
		if(this.lastPlatformY > this.world.height - 50){
			this.lastPlatformY = this.world.height-50;
		}
		
		if(this.game.rnd.integerInRange(0,50) > 45){
			
			this.platformsize = this.game.rnd.integerInRange(5,10)+10;
			
			
			temp = {};
			temp.x = this.lastPlatformX+((this.platformsize+1)*8);
			temp.y = this.lastPlatformY;
			this.spawnMob(temp, 'alien', 1, 50, ((this.platformsize+1)*8)-70,this.damagesfx,this.damagesfx);
		}
		
		this.addPlatform(this.lastPlatformX , this.lastPlatformY , this.platformsize);
		
	},

	collectBullet : function(bullet) {
		bullet.kill();
	},
	
	damagePlayer : function(player, source) {
		if(player.health > 0){
			player.health -= source.damage;
			player.sfx.play();
			if(player.health <= 0){
				player.alive = false;
				player.kill();
				player.deathsfx.play();
			}
		}else{
			player.alive = false;
			player.kill();
			player.deathsfx.play();
			//player.destroy(true);
		}
	},
	
	hitMob : function(mob, source) {
		this.collectBullet(source);
		if(mob.health > 0){
			mob.health -= 10;
			mob.sfx.play();
			if(mob.health <= 0){
				mob.alive = false;
				mob.kill();
				this.mobs.remove(mob);	
				mob.deathsfx.play();
			}
		}else {
			mob.kill();
			this.mobs.remove(mob);		
			mob.deathsfx.play();
		}
		
	},
	
	spawnMob : function(position, sprite, damage, health, range, sfx, deathsfx) {
		var mob = this.mobs.create(position.x, position.y, sprite);
		mob.damage = damage;
		mob.health = health;
		mob.range = range;
		mob.name = name;
		mob.body.gravity.y = 1000;
		mob.direction = 'right';
		mob.anchor.setTo(.5, 1);
		mob.fireCooldown = 20;
		mob.spawnposition = position;
		mob.damage = 100;
		mob.bulletsPerSalve = 1;
		mob.sfx = sfx;
		mob.deathsfx = deathsfx;
		return mob;
	}

};