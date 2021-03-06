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
		this.music_heavy = this.game.add.audio('actionheavy1');
		this.music_heavy.volume = 0.2;
		this.music_heavy.loop = true;
		this.damagesfx = this.game.add.audio('damage');
		this.damagesfx.volume  = 0.2;
		this.lasersfx1 = this.game.add.audio('laserbullet1');
		this.lasersfx1.volume = 0.05;
		this.lasersfx2 = this.game.add.audio('laserbullet2');
		this.lasersfx2.volume = 0.2;
		this.healsfx = this.game.add.audio('heal');
		this.healsfx.volume = 0.3;
		this.bossmusic1 = this.game.add.audio('boss1');
		this.bossmusic1.loop = true;
		this.bossmusic1.volume = 0.2;
		this.music.loop = true;
		this.music.volume = 0.12;
		this.music.play();
	},

	create : function() {
		
		// Modus
		this.modus = 0;
		
		this.modusRush = 1;
		this.modusBoss = 2;
		this.modusChalange = 3;
		this.modeTime = 30;
		this.modeMaxTime = 30;
		this.modes = 3;
		this.enemyamount = 80;
		
		// redWall
		this.redWallSpeed = 2;
		this.redWallbuffer = 250;
		this.redWallX = -this.redWallbuffer-1000;
		
		this.boundsXmax = 1600;
		this.boundsXmin = 0;
		this.game.world.setBounds(this.boundsXmin, 0, this.boundsXmax, 600);
		
		// Map
		this.map = this.add.group();
		this.map.create(0,0, 'background');

		this.player = this.add.sprite(32, this.world.height - 150, 'dude');
		this.game.physics.arcade.enable(this.player);

		// Player Movementspeed
		this.player.speedx = 300;
		this.player.hitxSpeed = 0;
		this.player.speedy = -475;
		this.player.health = 100;
		this.player.medikits = 0;
		this.player.score = 0;
		this.player.damage = 10;
		this.player.body.gravity.y = 1000;
		this.player.body.bounce.y = 0.0;
		this.player.sfx = this.damagesfx;
		this.player.deathsfx = this.damagesfx;
		this.player.body.collideWorldBounds = true;
		this.player.animations.add('walk_normal', [0, 1, 2, 3, 4, 5, 6, 7, 8],
				10, true);
		this.player.animations.add('walk_northwest', [9, 10, 11, 12, 13, 14, 15, 16, 17], 10, true);
		this.player.animations.add('walk_southwest', [18, 19, 20, 21, 22, 23, 24, 25, 26], 10, true);
		this.player.anchor.setTo(.5, 0);
		
		// Change to constant camera speed
		this.game.camera.follow(this.player);

		// Ground
		this.platforms = this.add.group();
		this.platforms.enableBody = true;
		this.platformsize = 4;
		this.platformSizeMax = 9;
		this.platformSizeMin = 6;
		
		this.lastPlatformY = this.world.height - 48;
		this.lastPlatformX = 4*16;
		this.addPlatform(0,this.world.height - 48,5);
		
		this.medikits = this.add.group();
		this.medikits.enableBody = true;
		this.medikits.health = 50;
		
		// obstacles
		this.obstacles = this.add.group();
		this.obstacles.enableBody = true;
		
		this.obstacleamount = 90;
		
		this.cursors = this.input.keyboard.createCursorKeys();
		this.wasd = {
			up : this.game.input.keyboard.addKey(Phaser.Keyboard.W),
			down : this.game.input.keyboard.addKey(Phaser.Keyboard.S),
			left : this.game.input.keyboard.addKey(Phaser.Keyboard.A),
			right : this.game.input.keyboard.addKey(Phaser.Keyboard.D),
		};
		this.heal = {
				heal: this.game.input.keyboard.addKey(Phaser.Keyboard.H),
		};
		this.esc = {
				esc: this.game.input.keyboard.addKey(Phaser.Keyboard.ESC),
		};
		
		this.direction = 1;

		// shoot
		this.bullets = this.game.add.group();
		this.bullets.enableBody = true;
		this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
		this.bullets.createMultiple(60, 'bullet');
		this.bullets.setAll('anchor.x', 0.5);
		this.bullets.setAll('anchor.y', 1);
		this.bullets.setAll('checkWorldBounds', true);
		this.enemybullets = this.game.add.group();
		this.enemybullets.enableBody = true;
		this.enemybullets.physicsBodyType = Phaser.Physics.ARCADE;
		this.enemybullets.createMultiple(50, 'laserbullet');
		this.enemybullets.setAll('anchor.x', 0.5);
		this.enemybullets.setAll('anchor.y', 1);
		this.enemybullets.setAll('checkWorldBounds', true);

		this.shootspeed = 7;
		this.shootcooldown = 0;
		this.bulletspeed = 700;
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
		
		// bosse
		
		this.bosse = this.add.group();
		this.bosse.enableBody = true;
		this.bosse.physicsBodyType = Phaser.Physics.ARCADE;	
		
		// pickups
		this.pickupAmount = 3;
		this.pickups = this.game.add.group();
		this.pickups.enableBody = true;
		this.pickups.physicsBodyType = Phaser.Physics.ARCADE;
		this.pickups.setAll('outOfBoundsKill', true);
		this.pickups.setAll('checkWorldBounds', true);

		this.uiText = this.game.add.bitmapText(50, 50,'mainfont', '', 38);
		this.uiText.fixedToCamera = true;
		
		this.debug = 0;
		this.matchtime = 0;
		
	},

	update : function() {
		this.matchtime += this.game.time.physicsElapsedMS * 0.001;
		this.uiText.setText('Health: ' + this.player.health + '    Score: ' + this.player.score + '    Time: ' + Math.round(this.matchtime) + '    Medikits: ' + this.player.medikits);
		this.physics.arcade.overlap(this.bullets, this.platforms, this.collectBullet, null, this);
		this.physics.arcade.overlap(this.player, this.obstacles, this.touchSpike, null, this);
		this.physics.arcade.overlap(this.mobs, this.bullets, this.hitMob, null, this);
		this.physics.arcade.overlap(this.bosse, this.bullets, this.hitBoss, null, this);
		this.physics.arcade.overlap(this.pickups, this.player, this.pickpuSomething, null, this);
		this.physics.arcade.overlap(this.player, this.enemybullets, function(player, source){
			this.damagePlayer(player, source);
			this.collectBullet(source);
		}, null, this);
		this.physics.arcade.overlap(this.enemybullets, this.platforms, this.collectBullet, null, this);
		this.physics.arcade.collide(this.player, this.platforms,function(player, source) {
			player.hitxSpeed = 0;
		  }, null, this);

		this.physics.arcade.overlap(this.player, this.mobs,this.touchSpike, null, this);
		this.physics.arcade.collide(this.mobs, this.ground);
		this.physics.arcade.collide(this.mobs, this.platforms);
		this.physics.arcade.collide(this.pickups, this.platforms);
		
		
		for (var i = 0; i < this.mobs.children.length; i++) {
			var enemy = this.mobs.children[i];
			if(enemy.inCamera){
				if (enemy.fireCooldown == 0) {
					for (var i = 0; i < enemy.bulletsPerSalve; i++) {
						var x = 0;
						if(enemy.direction == 'left'){
							x = -1;
						}else{
							x = 1;
						}
						if(this.game.rnd.integerInRange(0,100) > enemy.fireChange){
							if(enemy.x > this.player.x && x == -1){
								this.fireBullet(enemy.x, enemy.y - 30, enemy.x + x, enemy.y - 30, this.enemybullets, 2, 300, this.lasersfx2, enemy);
							}else if(enemy.x < this.player.x && x == 1){
								this.fireBullet(enemy.x, enemy.y - 30, enemy.x + x, enemy.y - 30, this.enemybullets, 2, 300, this.lasersfx2, enemy);
							}
						}		
					}
					enemy.fireCooldown = enemy.bulletInterval;
				}

				if (enemy.fireCooldown > 0) {
					enemy.fireCooldown--;
				}
			}
			if(enemy.direction == 'right' && enemy.x <= enemy.range + enemy.spawnposition.x){
				enemy.x += enemy.speed;
			}else if(enemy.direction == 'right'){
				enemy.direction = 'left';
				enemy.scale.x *= -1;
			}
			
			if(enemy.direction == 'left' && enemy.x >= enemy.spawnposition.x - enemy.range){
				enemy.x -= enemy.speed;
			}else if(enemy.direction == 'left'){
				enemy.direction = 'right';
				enemy.scale.x *= -1;
			}
			if(enemy.name == 'enemy0'){
				enemy.animations.play('walk');
			}
		}
		
		if(this.heal.heal.isDown){
			if(this.player.health < 100 && this.player.medikits > 0){
				this.player.health += this.medikits.health;
				this.player.medikits--;
				this.healsfx.play();
			}
		}
		
		if(this.esc.esc.isDown){
			this.endGame();
		}

		// Reset the players velocity (movement)
		this.player.body.velocity.x = this.player.hitxSpeed;		
		if (this.wasd.left.isDown) {
			this.player.body.velocity.x = -this.player.speedx + this.player.hitxSpeed;
			
			this.player.animations.play('walk_normal');
			this.direction = -1;
			this.player.scale.x = this.direction;
			this.playerShootAngleX = -1;
		} else if (this.wasd.right.isDown) {
			
			this.player.body.velocity.x = this.player.speedx + this.player.hitxSpeed;

			this.player.animations.play('walk_normal');
			this.direction = 1;
			this.player.scale.x = this.direction;
			this.playerShootAngleX = 1;
		} else if (this.player.body.velocity.x == 0
				|| this.player.body.velocity.y == 0
				
				&& this.player.body.touching.down) {
			this.player.animations.stop();
			if (this.direction == -1) {
				this.player.frame = 0;		
				this.player.scale.x = this.direction;
			} else if (this.direction == 1) {
				this.player.frame = 0;
				this.player.scale.x = this.direction;
			}
		}
		
		if ((this.wasd.up.isDown)
				&& this.player.body.touching.down) {
			this.player.body.velocity.y = this.player.speedy;

		}

		if(this.player.y >= this.world.height - 51){
			this.player.kill();
			this.endGame();
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
	
		if(this.lastPlatformX-1500 < this.game.camera.x){
			this.addRandomPlatform();
		}
		
		if(this.player.x + 800 > this.boundsXmax){
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
				tile.body.velocity.y += this.redWallSpeed;
				tile.body.rotation +=10;
			}
			
			if(this.debug == 0){
				this.debug = tile;
			}
			
			if(tile.y > this.world.height){
				this.platforms.remove(tile);
				tile.kill();
				tile.destroy();
			}
		}
		
		for(var i = 0 ; i < this.obstacles.length ; i++){
			var tile = this.obstacles.children[i];
			
			if(tile.x < this.boundsXmin || tile.x < this.redWallX){					
				tile.body.velocity.y += this.redWallSpeed;
				tile.body.rotation +=10;
			}
			if(tile.y > this.world.height){
				this.obstacles.remove(tile);
				tile.kill();
				tile.destroy();
			}
		}
		
		for (var i = 0; i < this.bosse.children.length; i++) {
			var boss = this.bosse.children[i];
			boss.x = this.game.camera.x;
			
			if(boss.x < this.player.x-500){
				boss.x = this.player.x-500;
			}else if(boss.x > this.player.x-500){
				boss.x = (this.player.x-500);
			}
			
			if(boss.y < this.player.y){
				boss.y += this.player.y/boss.y;
			}else if(boss.y > this.player.y && boss.y > boss.higth){
				boss.y -= boss.y/this.player.y;
			}
			
			if(boss.cooldown == 0){
				for(var i = 0 ;i < boss.bulletspershoot ; i++){
					this.fireBullet(boss.x+boss.bulletOffsetX, boss.y+boss.bulletOffsetY , this.player.x, this.player.y, this.enemybullets, boss.bulletSpread, boss.bulletSpeed, this.lasersfx2 ,boss);
				}
				boss.cooldown = boss.maxcooldown;
			}else{
				boss.cooldown--;
			}
		}
		
		this.redWallX += this.redWallSpeed;
		
		if(this.matchtime >= this.modeTime && this.modus != this.modusBoss){
			this.changeMode(this.game.rnd.integerInRange(0,this.modes))
			this.modeTime = this.matchtime+this.modeMaxTime;
		}else if(this.modus != this.modusBoss){
		}
				
		this.mobs.forEachDead(function(mob) {
		    mob.destroy();
		  });
		
		for (var i = 0; i < this.bullets.children.length; i++) {
			var bullet = this.bullets.children[i];
		    if(bullet.x > this.game.camera.x + this.game.camera.width){
		    	this.collectBullet(bullet);
		    }else if(bullet.x < this.game.camera.x){
		    	this.collectBullet(bullet);
		    }
		  }

		for (var i = 0; i < this.enemybullets.children.length; i++) {
				var bullet = this.bullets.children[i];
		    if(bullet.x > this.game.camera.x + this.game.camera.width){
		    	this.collectBullet(bullet);
		    }else if(bullet.x < this.game.camera.x){
		    	this.collectBullet(bullet);
		    }
		}
	},

	render : function(){
	},

	fireBullet : function(scrIntx, scrInty, endIntx, endInty, bulletGroup,
			bulletSpread, bulletSpeed, sfx, parent) {
		var bullet = bulletGroup.getFirstExists(false);
		

		this.bulletangle = Math.atan((endInty - scrInty) / (endIntx - scrIntx))
				+ (this.game.rnd.integerInRange(-bulletSpread, bulletSpread) / 100);

		if (bullet) {
			bullet.damage = parent.damage;
			sfx.play();
			if (scrIntx <= endIntx) {
				// right
				// And fire it
				bullet.reset(scrIntx, scrInty);
				this.game.physics.arcade.velocityFromRotation(this.bulletangle,
						bulletSpeed, bullet.body.velocity);
				bullet.rotation = this.bulletangle;
			} else {
				// And fire it
				bullet.reset(scrIntx, scrInty);

				this.game.physics.arcade.velocityFromRotation(this.bulletangle, -bulletSpeed, bullet.body.velocity);

				bullet.rotation = this.bulletangle + Math.PI;
			}
			
		}
	},

	fireBulletPlayer : function() {
		var bullet = this.bullets.getFirstExists(false);

		this.playermidx = this.player.x + 25;
		this.playermidy = this.player.y + 25;

		this.mousx = this.game.input.mousePointer.x + this.game.camera.x;
		this.mousy = this.game.input.mousePointer.y;

		if (this.direction == -1) {
			this.fireBullet(this.player.x - 25, this.player.y + 21,this.player.x - 25 + this.playerShootAngleX,
					this.player.y + 21 + this.playerShootAngleY, this.bullets, this.bulletspred,
					this.bulletspeed, this.lasersfx1, this.player);
		} else {
			this.fireBullet(this.player.x + 25, this.player.y + 27, this.player.x + 25 + this.playerShootAngleX,
					this.player.y + 27 + this.playerShootAngleY, this.bullets, this.bulletspred,
					this.bulletspeed, this.lasersfx1, this.player);
		}
	},
	
	collectBullet : function(bullet) {
		bullet.kill();
	},
	
	addMedikit : function(){
		this.player.medikits += 1;
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
		
		var inx = this.game.rnd.integerInRange(1,200);
		
		this.lastPlatformX = this.lastPlatformX+(this.platformsize+1)*(16)+inx;
		
		this.lastPlatformY = this.lastPlatformY+(this.game.rnd.integerInRange(-50,50)*(2-(this.game.rnd.integerInRange(1,200)/200)));
		
		this.platformsize = this.game.rnd.integerInRange(3,5);
		
		if(this.lastPlatformY < 250){
			this.lastPlatformY = 250+this.game.rnd.integerInRange(0,50);
		}
		if(this.lastPlatformY > this.world.height - 70){
			this.lastPlatformY = this.world.height-70-this.game.rnd.integerInRange(0,50);
		}
		
		if(this.game.rnd.integerInRange(0,100) > this.enemyamount){
			
			this.platformsize += 8;
			
			temp = {};
			temp.x = this.lastPlatformX+((this.platformsize+1)*8);
			temp.y = this.lastPlatformY;
			if(this.game.rnd.integerInRange(0,100) > 50){
				this.spawnMob(temp, 'enemy0', 1, 20, ((this.platformsize+1)*8)-35,this.damagesfx,this.damagesfx, 50 ,3);
			}else if(this.game.rnd.integerInRange(0,100) > 50){				
				this.spawnMob(temp, 'enemy1', 10, 40, ((this.platformsize+1)*8)-50,this.damagesfx,this.damagesfx, 100 ,2, 30);
			}else{
				this.spawnMob(temp, 'enemy2', 30, 55, ((this.platformsize+1)*8)-50,this.damagesfx,this.damagesfx, 50 ,1, 50);
			}

		}else if(this.game.rnd.integerInRange(0,100) > 95){
			
			temp = {};
			temp.x = this.lastPlatformX+((this.platformsize+1)*8);
			temp.y = this.lastPlatformY;
			
			this.spawnPickup(temp);
		}else if(this.game.rnd.integerInRange(0,100) > this.obstacleamount ){
			
			this.platformsize += 4;
			
			for(var i = 2 ; i <  this.platformsize-2 ; i++){
				if(this.game.rnd.integerInRange(0,100) > 80){
					this.addObstacles(this.lastPlatformX+(i*16) , this.lastPlatformY-16);
				}
			}
		}
		
		this.addPlatform(this.lastPlatformX , this.lastPlatformY , this.platformsize);
		
	},
	
	addObstacles :function(intx,inty){
		var spike = this.obstacles.create(intx,inty, 'spike');
		spike.damage = 10;
		spike.body.immovable = true;
	},
	
	touchSpike : function(player, source){
	    if(source.x < player.x){
	    	player.hitxSpeed = player.speedx/2;
	    	player.body.velocity.y = player.speedy/2;
	    }else{
	    	player.hitxSpeed = -player.speedx/2;
	    	player.body.velocity.y = player.speedy/2;
	    }
		this.damagePlayer(player, source);
	},
	
	spawnPickup : function(position){
		
		var temp = this.game.rnd.integerInRange(0,this.pickupAmount);
		
		if(temp == 0){
			var pickup = this.pickups.create(position.x, position.y, 'pickup0');
			pickup.name = 'pickup0';
		}else if(temp == 1){
			var pickup = this.pickups.create(position.x, position.y, 'pickup1');
			pickup.name = 'pickup1';
		}else if(temp == 2){
			var pickup = this.pickups.create(position.x, position.y, 'pickup2');
			pickup.name = 'pickup2';
		}else{
			var pickup = this.pickups.create(position.x, position.y, 'medikit');
			pickup.name = 'medikit';
			pickup.health = 50;
		}

		pickup.body.gravity.y = 1000;
		pickup.spawnposition = position;
		pickup.anchor.setTo(.5, 1);
		
	},
	
	pickpuSomething : function(player, source){
		
		if(source.name == 'pickup0'){
			this.shootspeed = 7;
			this.bulletspeed = 500;
			this.bulletspred = 2;
			this.bulletpershoot = 1;
			this.player.damage = 15;
			this.pickups.remove(source);
		}else if(source.name == 'pickup1'){
			this.shootspeed = 3;
			this.bulletspeed = 500;
			this.bulletspred = 20;
			this.bulletpershoot = 1;
			this.player.damage = 5;
			this.pickups.remove(source);
		}else if(source.name == 'pickup2'){
			this.shootspeed = 25;
			this.bulletspeed = 500;
			this.bulletspred = 30;
			this.bulletpershoot = 5;
			this.player.damage = 7;
			this.pickups.remove(source);
		}else if(source.name == 'medikit'){
			this.addMedikit();
			this.medikits.remove(source);
		}
		this.player.score += 10;
		source.kill();
	},
	
	damagePlayer : function(player, source) {
		if(player.health > 0){
			player.health -= source.damage;
			player.sfx.play();
			if(player.health <= 0){
				player.kill();
				player.deathsfx.play();
				this.endGame();
			}
		}else{
			player.kill();
			player.deathsfx.play();
			this.endGame();
		}
	},
	
	hitMob : function(mob, source) {
		this.collectBullet(source);
		if(mob.health > 0){
			mob.health -= source.damage;
			mob.sfx.play();
			if(mob.health <= 0){
				mob.kill();
				this.player.score += mob.points;
				mob.deathsfx.play();
			}
		}else {
			if(this.game.rnd.integerInRange(0,100) > 80){
				this.spawnPickup(mob.spawnposition);
			}
		}	
	},
	
	spawnMob : function(position, sprite, damage, health, range, sfx, deathsfx, points,speed, bulletInterval) {
		var mob = this.mobs.create(position.x, position.y, sprite);
		if(sprite == 'enemy0'){
			mob.animations.add('walk', [0, 1], 10, true);
		}
		mob.damage = damage;
		mob.health = health;
		mob.range = range;
		mob.name = sprite;
		mob.body.gravity.y = 1000;
		if(this.game.rnd.integerInRange(0,100) > 50){
			mob.direction = 'right';
		}else{
			mob.direction = 'left';
			mob.scale.x *= -1;
		}
		
		mob.anchor.setTo(.5, 1);
		mob.fireCooldown = 20;
		mob.fireChange = 50;
		mob.spawnposition = position;
		mob.bulletInterval = bulletInterval;
		mob.damage = damage;
		mob.bulletsPerSalve = 1;
		mob.sfx = sfx;
		mob.deathsfx = deathsfx;
		mob.points = points;
		mob.speed = speed;
		return mob;
	},
	
	spwanBoss : function(position){
		if(this.game.rnd.integerInRange(0,100) > 50){
			var boss = this.bosse.create(position.x, position.y, 'boss1');	
			boss.higth = 159*0.8;
			boss.health = 800;
			boss.name = name;
			boss.bulletSpeed = 500;
			boss.bulletOffsetX = 0;
			boss.bulletOffsetY = 0;
			boss.maxcooldown = 170;
			boss.cooldown = boss.maxcooldown;
			boss.bulletSpread = 7;
			boss.bulletspershoot = 2;
			boss.anchor.setTo(.5, 0.8);
			boss.damage = 10;
			boss.spawnposition = position;
			boss.points = 500;
			boss.sfx = this.damagesfx;
		}else{
			var boss = this.bosse.create(position.x, position.y, 'boss2');
			boss.higth = 197*0.8;
			boss.health = 1000;
			boss.name = name;
			boss.bulletSpeed = 500;
			boss.maxcooldown = 300;
			boss.bulletOffsetX = 70;
			boss.bulletOffsetY = -110;
			boss.damage = 10;
			boss.cooldown = boss.maxcooldown;
			boss.bulletSpread = 8;
			boss.bulletspershoot = 3;
			boss.anchor.setTo(.5, 0.8);
			boss.spawnposition = position;
			boss.points = 500;
			boss.sfx = this.damagesfx;
		}
	},
	
	hitBoss : function(boss, source){
		this.collectBullet(source);
		if(boss.health > 0){
			boss.health -= source.damage;
			boss.sfx.play();
			if(boss.health <= 0){
				boss.alive = false;
				this.player.score += boss.points;
				boss.kill();
				this.bosse.remove(boss);
				this.modus = 0;
			}
		}else {
			boss.kill();
			this.player.score += boss.points;
			this.bosse.remove(boss);
			this.modus = 0;
		}
		
	},
	
	changeMode : function(to){
		
		if(this.modus != to){
			
			if(to == this.modusRush){
				this.enemyamount = 90;
				this.redWallSpeed = 4;
				this.modus = to;
				this.obstacleamount = 30;
				this.music_heavy.play();
				this.bossmusic1.stop();
				this.music.stop();
				this.platformSizeMax = 7;
				this.platformSizeMin = 4;
			}else if(to == this.modusChalange){
				this.enemyamount = 60;
				this.redWallSpeed = 2;
				this.modus = to;
				this.obstacleamount = 90;
				this.music_heavy.play();
				this.bossmusic1.stop();
				this.music.stop();
				this.platformSizeMax = 9;
				this.platformSizeMin = 6;
			}else if(to == this.modusBoss){
				this.platformSizeMax = 10;
				this.platformSizeMin = 8;
				this.enemyamount = 85;
				this.redWallSpeed = 1;	
				temp = {};
				temp.x = this.player.x;
				temp.y = this.player.y+1000;
				this.modus = to;
				this.obstacleamount = 10;
				this.spwanBoss(temp);
				this.music.stop();
				this.music_heavy.stop();
				this.bossmusic1.play();
			}else{
				this.enemyamount = 80;
				this.redWallSpeed = 2;
				this.modus = to;
				this.obstacleamount = 90;
				this.music_heavy.play();
				this.bossmusic1.stop();
				this.music.stop();
				this.platformSizeMax = 9;
				this.platformSizeMin = 6;
				this.music_heavy.stop();
				this.bossmusic1.stop();
				this.music.play();
			}
		}	
	},
	
	shutdown: function(game) {
		this.bossmusic1.stop();
		this.music_heavy.stop();
		this.music.stop();
	},
	
	endGame : function(){
		this.game.score = this.player.score;
		this.game.playtime = Math.round(this.matchtime);
		if(this.game.score > this.game.highscore){
			this.game.highscore = this.game.score;
		}
		if(this.game.playtime > this.game.besttime){
			this.game.besttime = this.game.playtime;
		}
		
		this.game.world.setBounds(0, 0, 1600, 600);
		
		this.restartGame();
	},
	
	restartGame : function(){

		this.state.start('EndScreen');
	}
};