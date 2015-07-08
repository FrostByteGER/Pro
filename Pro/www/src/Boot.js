/**
 * 
 */
var ProShooter = ProShooter || {};

ProShooter.Boot = function(){};

ProShooter.Boot.prototype = {
		 
		  preload: function() {
		  },
		 
		  create: function() {
		    this.game.stage.backgroundColor = '#fff';
		    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		    this.scale.pageAlignHorizontally = true;
		    this.scale.pageAlignVertically = true;
		    this.scale.setScreenSize(true);
		    this.game.physics.startSystem(Phaser.Physics.ARCADE);   
		    this.state.start('Preload');
		  }
		 
};