/**
 * 
 */

var ProShooter = ProShooter || {};
 
//loading the game assets
 
ProShooter.MainMenu = function(){};
 
ProShooter.MainMenu.prototype = {
 
  create: function() {
		this.mainmenuHeader = this.game.add.sprite(this.game.width/2 - 279/2, 100, 'header');
  },
  
  startGame: function() {
	  this.state.start('Game');
  }
 
};