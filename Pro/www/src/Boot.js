/**
 * 
 */
var ProShooter = ProShooter || {};

ProShooter.Boot = function(){};

ProShooter.Boot.prototype = {
		 
		  preload: function() {
		 
		    //assets we'll use in the loading screen
		 
		    //this.load.image('preloadbar', 'assets/images/preloader-bar.png');
		  },
		 
		  create: function() {
		 
		    //loading screen will have a white background
		 
			 
		 
		    //scaling options
		 
		    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		 
		    //have the game centered horizontally
		 
		    this.scale.pageAlignHorizontally = true;
		 
		    this.scale.pageAlignVertically = true;
		 
		    //screen size will be set automatically
		 
		    this.scale.setScreenSize(true);
		 
		    //physics system
		 
		    this.game.physics.startSystem(Phaser.Physics.ARCADE);
		 
		    this.state.start('Preload');
		 
		  }
		 
};