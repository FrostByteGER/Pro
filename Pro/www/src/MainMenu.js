/**
 * 
 */

var ProShooter = ProShooter || {};
 
//loading the game assets
 
ProShooter.MainMenu = function(){};
 
ProShooter.MainMenu.prototype = {
 
  create: function() {
		this.mainmenuHeader = this.game.add.sprite(this.game.width/2 - 279/2, 100, 'header');
		this.startButton = this.add.button(this.game.width/2 - 125/2, 250,'play', this.startGame, this, 0, 0, 0);
  },
  
  startGame: function() {
	  this.state.start('Game');
  }
 
};