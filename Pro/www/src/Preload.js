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
	this.load.tilemap('mainmap', 'asset/mainmap.json', null, Phaser.Tilemap.TILED_JSON);
	this.load.image('airstrip', 'asset/Sprites/transparent/airstrip_sheet.png');
	this.load.image('apartments', 'asset/Sprites/transparent/apartments_sheet.png');
	this.load.image('church', 'asset/Sprites/transparent/church_sheet.png');
	this.load.image('cityhall', 'asset/Sprites/transparent/cityhall_sheet.png');
	this.load.image('docks', 'asset/Sprites/transparent/docks_sheet.png');
	this.load.image('hospital', 'asset/Sprites/transparent/hospital_sheet.png');
	this.load.image('house', 'asset/Sprites/transparent/house_sheet.png');
	this.load.image('offices2', 'asset/Sprites/transparent/offices_2_sheet.png');
	this.load.image('offices3', 'asset/Sprites/transparent/offices_3_sheet.png');
	this.load.image('offices', 'asset/Sprites/transparent/offices_sheet.png');
	this.load.image('shack', 'asset/Sprites/transparent/shack_sheet.png');
	this.load.image('silo', 'asset/Sprites/transparent/silo_sheet.png');
	this.load.image('streetbarriers1', 'asset/Sprites/transparent/streetbarriers_1_sheet.png');
	this.load.image('streetbarriers2', 'asset/Sprites/transparent/streetbarriers_2_sheet.png');
	this.load.image('supermarket', 'asset/Sprites/transparent/supermarket_sheet.png');
	this.load.image('warehouse', 'asset/Sprites/transparent/warehouse_sheet.png');
	this.load.image('grass', 'asset/grass.png');
	this.load.image('background', 'asset/background_gradient_3.png');
	this.load.image('playerspawn', 'asset/playerspawn.png');

    this.load.image('star','asset/star.png');
    this.load.image('bullet','asset/bullet.png');
    this.load.spritesheet('dude','asset/Player.png', 50, 50);
    
 
  },
 
  create: function() {
 
   this.state.start('Game');
 
  }
 
};