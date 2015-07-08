/**
 * 
 */

var ProShooter = ProShooter || {};
 
//loading the game assets
 
ProShooter.EndMenu = function(){};
 
ProShooter.EndMenu.prototype = {
 
  create: function() {
	    this.endbg = this.add.sprite(0,0, 'background');
		this.end = this.game.add.audio('main');
		this.end.volume = 0.2;
		this.end.loop = true;
	    this.end.play();
		this.gameOver = this.add.sprite(this.game.width/2 - 360/2, 100, 'gameOver');
		this.currentScore = this.add.sprite(this.game.width/2 - 319/2 - 75, 200,'score');
		this.currentTime = this.add.sprite(this.game.width/2 - 319/2 - 75, 250,'time');
		this.highscore = this.add.sprite(this.game.width/2 - 319/2 - 75, 300,'highscore');
		this.bestTime = this.add.sprite(this.game.width/2 - 319/2 - 75, 350,'besttime');
		
		this.retryButton = this.add.button(this.game.width/2 - 338, 425,'retry', function(){
			this.end.stop();
			this.state.start('Game');
		}, this, 0, 0, 0);
		this.backButton = this.add.button(this.game.width/2, 425,'back', function(){
			this.end.stop();
		this.state.start('MainMenu');
		}, this, 0, 0, 0);
		
		this.scoreText = this.add.bitmapText(this.game.width/2 + 150, 200,'mainfont', this.score, 38);
		this.highscoreText = this.add.bitmapText(this.game.width/2 + 150, 250,'mainfont', this.highscore, 38);
		this.timeText = this.add.bitmapText(this.game.width/2 + 150, 300,'mainfont', this.playtime, 38);
		this.besttimeText = this.add.bitmapText(this.game.width/2 + 150, 350,'mainfont', this.besttime, 38);
  },

  update : function(){
	  this.scoreText.setText(this.game.score + '');
	  this.highscoreText.setText(this.game.highscore + '');
	  this.timeText.setText(this.game.playtime + '');
	  this.besttimeText.setText(this.game.besttime + '');
  }
 
};