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
    this.load.image('sky','asset/sky.png');
    this.load.image('ground','asset/platform.png');
    this.load.image('star','asset/star.png');
    this.load.image('bullet','asset/bullet.png');
    this.load.spritesheet('dude','asset/Player.png', 50, 50);
    
 
  },
 
  create: function() {
 
   this.state.start('Game');
 
  }
 
};