/**
 * Created by wuyanc on 2/4/2015.
 */
var Game = {};
Game.Load = function (game) {
}
Game.Load.prototype = {
    preload: function () {
        game.load.spritesheet('green','res/green_frame.png',90,35);
        game.load.image('green1', 'res/g1.png');
        game.load.image('green2', 'res/g2.png');
        game.load.image('green3', 'res/g3.png');
        game.load.image('green4', 'res/g4.png');
        game.load.image('green5', 'res/g5.png');
        game.load.image('yellow', 'res/yellow.png');
        game.load.image('lightBlock','res/lightBlock.png');
        //game.load.audio('clear',['audio/clear.wav']);



    },
    create: function () {
        game.stage.backgroundColor = '#ffffff';
        introText = game.add.text(game.world.centerX - 60, game.world.centerY, 'Click to start', {
            font: "300 20px Roboto, Helvetica Neue, Helvetica, Arial, sans-serif",
            fill: "#999",
            align: "center"
        });


        //return game.input.onDown.addOnce(function() {

        return game.state.start('Play');
        //});

    }
}