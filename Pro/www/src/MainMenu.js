/**
 * 
 */

var ProShooter = ProShooter || {};
 
//loading the game assets
 
ProShooter.MainMenu = function(){};
 
ProShooter.MainMenu.prototype = {
 
  create: function() {
	    this.mainbg = this.add.sprite(0,0, 'background');
		this.main = this.game.add.audio('main');
		this.main.volume = 0.2;
		this.main.loop = true;
	    this.main.play();
		this.mainmenuHeader = this.game.add.sprite(this.game.width/2 - 279/2, 100, 'header');
		this.startButton = this.add.button(this.game.width/2 - 338/2, 250,'play', this.startGame, this, 0, 0, 0);
  },
  
  startGame: function() {
	  this.state.start('Game');
	  this.main.stop();
  }
 
};