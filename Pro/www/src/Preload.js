/**
 * 
 */

var ProShooter = ProShooter || {};
 
//loading the game assets
 
ProShooter.Preload = function(){};
 
ProShooter.Preload.prototype = {
 
  preload: function() {
 
    //show loading screen
 
    //this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'preloadbar');
 
    //this.preloadBar.anchor.setTo(0.5);
 
    //this.preloadBar.scale.setTo(3);
 
    //this.load.setPreloadSprite(this.preloadBar);
 
    //load game assets
	
	this.load.audio('levelmusic', 'asset/smb.ogg');
    this.load.image('sky','asset/sky.png');
    this.load.image('ground','asset/platform.png');
    this.load.image('star','asset/star.png');
    this.load.image('bullet','asset/bullet.png');
    this.load.image('map','asset/maps/mainmap.png');
    this.load.image('surface', 'asset/maps/mapsurface.png');
    this.load.image('plat', 'asset/plat.png');
    this.load.image('plat_start', 'asset/plat_start.png');
    this.load.image('plat_mit', 'asset/plat_mit.png');
    this.load.image('plat_end', 'asset/plat_end.png');
    this.load.spritesheet('alien', 'asset/alien.png', 140, 80);
    this.load.spritesheet('dude','asset/Player.png', 50, 50);
    
 
  },
 
  create: function() {
 
   this.state.start('Game');
 
  }
 
};