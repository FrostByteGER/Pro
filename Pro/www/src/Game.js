// create BasicGame Class
BasicGame = {

};

// create Game function in BasicGame
BasicGame.Game = function (game) {
};


var player;
var platforms;
var cursors;
var stars;
var score = 0;
var scoreText;

// set Game function prototype
BasicGame.Game.prototype = {

    init: function () {
        // set up input max pointers
        this.input.maxPointers = 1;
        // set up stage disable visibility change
        this.stage.disableVisibilityChange = true;
        // Set up the scaling method used by the ScaleManager
        // Valid values for scaleMode are:
        // * EXACT_FIT
        // * NO_SCALE
        // * SHOW_ALL
        // * RESIZE
        // See http://docs.phaser.io/Phaser.ScaleManager.html for full document
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        // If you wish to align your game in the middle of the page then you can
        // set this value to true. It will place a re-calculated margin-left
        // pixel value onto the canvas element which is updated on orientation /
        // resizing events. It doesn't care about any other DOM element that may
        // be on the page, it literally just sets the margin.
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;
        // Force the orientation in landscape or portrait.
        // * Set first to true to force landscape. 
        // * Set second to true to force portrait.
        this.scale.forceOrientation(true, false);
        // Sets the callback that will be called when the window resize event
        // occurs, or if set the parent container changes dimensions. Use this 
        // to handle responsive game layout options. Note that the callback will
        // only be called if the ScaleManager.scaleMode is set to RESIZE.
        this.scale.setResizeCallback(this.gameResized, this);
        // Set screen size automatically based on the scaleMode. This is only
        // needed if ScaleMode is not set to RESIZE.
        this.scale.setScreenSize(true);
        // Re-calculate scale mode and update screen size. This only applies if
        // ScaleMode is not set to RESIZE.
        this.scale.refresh();

    },


    preload: function () {

        // Here we load the assets required for our preloader (in this case a 
        // background and a loading bar)
        //this.load.image('logo', 'asset/phaser.png');
        this.load.image('sky','asset/sky.png');
        this.load.image('ground','asset/platform.png');
        this.load.image('star','asset/star.png');
        this.load.spritesheet('dude','asset/dude.png', 32, 48);
    },

    create: function () {
        this.physics.startSystem(Phaser.Physics.ARCADE);
        this.sky = this.add.sprite(0,0, 'sky');
        this.sky.scale.setTo(4,1);
        
        platforms = this.add.group();
        
        platforms.enableBody = true;
        
        var ground = platforms.create(0, this.world.height - 64, 'ground');
        ground.scale.setTo(5,2);
        ground.body.immovable = true;
        var ledge = platforms.create(400,300, 'ground');
        ledge.body.immovable = true;
        
        ledge = platforms.create(-150, 250, 'ground');
        
        ledge.body.immovable = true;
        
        // Add logo to the center of the stage
        //this.logo = this.add.sprite(
           // this.world.centerX, // (centerX, centerY) is the center coordination
           // this.world.centerY,
           // 'logo');
        //this.star = this.add.sprite(0,0, 'star');
        // Set the anchor to the center of the sprite
        //this.logo.anchor.setTo(0.5, 0.5);
        
        
            // The player and its settings
        player = this.add.sprite(32, this.world.height - 150, 'dude');

        //  We need to enable physics on the player
        this.physics.arcade.enable(player);

        //  Player physics properties. Give the little guy a slight bounce.
        player.body.bounce.y = 0.2;
        player.body.gravity.y = 300;
        player.body.collideWorldBounds = true;

        //  Our two animations, walking left and right.
        player.animations.add('left', [0, 1, 2, 3], 10, true);
        player.animations.add('right', [5, 6, 7, 8], 10, true);
        
        stars = this.add.group();
        stars.enableBody = true;
        
        for(var i = 0; i < 12; i++){
            var star = stars.create(i * 70, 0, 'star');
            star.body.gravity.y = 200;
            star.body.bounce.y = 0.3 + Math.random() * 0.2;
        }
        
        scoreText = this.add.text(16,16, 'score: 0', { fontSize: '32px', fill: '#000'});
        
        
        cursors = this.input.keyboard.createCursorKeys();

    },
    
    update: function () {
        this.physics.arcade.collide(player, platforms);
        this.physics.arcade.collide(stars, platforms);
        this.physics.arcade.overlap(player, stars, this.collectStar, null, this);
        
            //  Reset the players velocity (movement)
        player.body.velocity.x = 0;

        if (cursors.left.isDown)
        {
            //  Move to the left
            player.body.velocity.x = -150;

            player.animations.play('left');
        }
        else if (cursors.right.isDown)
        {
            //  Move to the right
            player.body.velocity.x = 150;

            player.animations.play('right');
        }
        else
        {
            //  Stand still
            player.animations.stop();

            player.frame = 4;
        }

        //  Allow the player to jump if they are touching the ground.
        if (cursors.up.isDown && player.body.touching.down)
        {
            player.body.velocity.y = -275;
        }
    },

        
        
    collectStar: function (player, star){
        star.kill();
        score += Number.MAX_VALUE;
        scoreText.text = 'Score: ' + score;
    },

    gameResized: function (width, height) {

        // This could be handy if you need to do any extra processing if the 
        // game resizes. A resize could happen if for example swapping 
        // orientation on a device or resizing the browser window. Note that 
        // this callback is only really useful if you use a ScaleMode of RESIZE 
        // and place it inside your main game state.

    }


};