/**
 * 
 */

var ProShooter = ProShooter || {};
 
//loading the game assets
 
ProShooter.EndMenu = function(){};
 
ProShooter.EndMenu.prototype = {
 
  create: function() {
		this.gameOver = this.game.add.sprite(this.game.width/2 - 279/2, 100, 'gameOver');
		this.currentScore = this.add.sprite(this.game.width/2 - 338/2, 250,'score');
		this.currentTime = this.add.sprite(this.game.width/2 - 338/2, 300,'time');
		this.highscore = this.add.sprite(this.game.width/2 - 338/2, 350,'highscore');
		this.bestTime = this.add.sprite(this.game.width/2 - 338/2, 400,'besttime');
		
		this.retryButton = this.add.button(this.game.width/2 - 338/2, 475,'retry', function(){
			this.state.start('Game');
		}, this, 0, 0, 0);
		this.backButton = this.add.button(this.game.width/2 + 338/2, 475,'back', function(){
		this.state.start('MainMenu');
		}, this, 0, 0, 0);
  }
 
};