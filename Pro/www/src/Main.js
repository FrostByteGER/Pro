/**
 * 
 */

var ProShooter = ProShooter || {};


ProShooter.game = new Phaser.Game(1280, 600, Phaser.AUTO, '');
 
ProShooter.game.state.add('Boot', ProShooter.Boot);
 
ProShooter.game.state.add('Preload', ProShooter.Preload);

ProShooter.game.state.add('MainMenu', ProShooter.MainMenu);

ProShooter.game.state.add('EndScreen', ProShooter.EndMenu);
 
ProShooter.game.state.add('Game', ProShooter.Game);
 
ProShooter.game.state.start('Boot');