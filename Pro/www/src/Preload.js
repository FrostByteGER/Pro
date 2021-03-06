/**
 * 
 */

var ProShooter = ProShooter || {};
 
//loading the game assets
 
ProShooter.Preload = function(){};
 
ProShooter.Preload.prototype = {
 
  preload: function() {
	this.loadingscreen = this.game.add.sprite(this.game.width/2 - 278, this.game.height/2 - 14.5, 'loading');
    this.load.setPreloadSprite(this.loadingscreen);
	 

	this.load.image('header','asset/menu/header.png');  
	this.load.image('play', 'asset/menu/btn_play.png');
	this.load.image('background', 'asset/maps/mapbackground1.png');
	this.load.image('controls','asset/menu/Controls.png');
	this.load.image('about','asset/menu/Credits.png');
    this.load.image('bullet','asset/bullet.png');
    this.load.image('enemy1', 'asset/enemy1.png');
    this.load.image('enemy2', 'asset/enemy2.png');
    this.load.image('plat', 'asset/plat.png');
    this.load.image('plat_start', 'asset/plat_start.png');
    this.load.image('plat_mit', 'asset/plat_mit.png');
    this.load.image('plat_end', 'asset/plat_end.png');
    this.load.image('laserbullet', 'asset/laserbullet.png');
    this.load.spritesheet('dude','asset/Player.png', 50, 50);
    this.load.spritesheet('enemy0','asset/enemy_sheet.png',36,38);
    this.load.image('pickup0', 'asset/R.png');
    this.load.image('pickup1', 'asset/M.png');
    this.load.image('pickup2', 'asset/S.png');
    this.load.image('spike', 'asset/spike.png');
    this.load.image('boss1', 'asset/boss.png');
    this.load.image('boss2', 'asset/boss2.png');
    this.load.image('medikit','asset/firstaid.png');
    this.load.image('gameOver','asset/menu/GameOver.png');
    this.load.image('playerscore','asset/menu/Score.png');
    this.load.image('playertime','asset/menu/Time.png');
    this.load.image('playerhighscore','asset/menu/Highscore.png');
    this.load.image('playerbesttime','asset/menu/BestTime.png');
    
    this.load.image('retry','asset/menu/btn_retry.png');
    this.load.image('back','asset/menu/btn_back.png');
    
    this.load.audio('heal', 'asset/sfx/heal.ogg');
    
    this.load.audio('action1', 'asset/sfx/bgm_action1.ogg');
    this.load.audio('action2', 'asset/sfx/bgm_action2.ogg');
    this.load.audio('action3', 'asset/sfx/bgm_action3.ogg');
    this.load.audio('actionheavy1', 'asset/sfx/bgm_action_heavy1.ogg');
    this.load.audio('boss1', 'asset/sfx/bgm_boss1.ogg');
    this.load.audio('main', 'asset/sfx/bgm_main.ogg');
    this.load.audio('damage', 'asset/sfx/hurt.ogg');
    this.load.audio('laserbullet1', 'asset/sfx/laser1.ogg');
    this.load.audio('laserbullet2', 'asset/sfx/laser2.ogg');
    this.load.bitmapFont('mainfont', 'asset/fonts/font.png', 'asset/fonts/font.fnt');
    
    this.game.score = 0;
    this.game.highscore = 0;
    this.game.playtime = 0;
    this.game.besttime = 0;
  },
 
  create: function() {
 
   this.state.start('MainMenu');
 
  }
 
};