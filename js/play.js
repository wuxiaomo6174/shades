/**
 * Created by wuyanc on 2/4/2015.
 */
    //thinking:
    // 1.Use Matrix to reocrd every postion, when it is down.use active block to overlap top block array. And then go into clear process.
    //2.clear process:when color is same then clear col blocks until can't, then check row clear
    //3.out of clear process.
    //4.create new block
    //5.check for overlap

//additional: use animations to change color
"use strict";
Game.Play = function () {
    this.inputx =0;
    this.activeBlock = void 0;
}
Game.Play.prototype = {
    preload: function () {
        for (var i = 0; i < SIZE; i++) //init one 7*7 matrix value to 0;
        {
            Matrix[i] = NOT_FILLED;

        }
    },


    create:function(){
        this.stage.backgroundColor = '#ffffff';
        game.physics.startSystem(Phaser.Physics.ARCADE);
        BLOCKS = game.add.group();
        var colorIndex = game.rnd.integerInRange(1, Object.keys(COLOR).length );
        //add random position here
        var block = BLOCKS.create(BasePostion.x+0, BasePostion.y+BasePostion.height*5, COLOR[colorIndex]);
        game.physics.arcade.enable(block);
        block.body.collideWorldBounds = true;
        block.body.gravity.y = SPEED*2;
        block.colorIndex = colorIndex;
        this.activeBlock=block;
        var block2 = BLOCKS.create(BasePostion.x+0, BasePostion.y+0, COLOR[colorIndex]);
        game.physics.arcade.enable(block2);
        block2.body.collideWorldBounds = true;
        block2.body.gravity.y = SPEED;
        block2.colorIndex= colorIndex;

        this.activeBlock2 = block2;
        game.input.onDown.add(this.move,this);
        this.lightBlock = game.add.sprite(BasePostion.x,BasePostion.y,'lightBlock');
        this.lightBlock.alpha = 0;
        game.input.maxPointers =1;
    },
    update:function(){
        game.physics.arcade.collide(this.activeBlock,this.activeBlock2,this.checkOverLap,null,this);
        //game.physics.arcade.overlap(this.activeBlock,this.activeBlock2,this.checkOverLap,null,this);
    },
    checkOverLap:function(){
        this.inputx="over;;";
    },
    move:function(point){
        if(point.x<BasePostion.x||point.x> (WIDTH - BasePostion.x))
        {
            this.inputx = "out of edge";
            return;
        }

        this.inputx = Math.floor((point.positionDown.x-BasePostion.x)/BasePostion.width);
        this.lightBlock.x = BasePostion.x + this.inputx * BasePostion.width ;
        this.activeBlock.x =  BasePostion.x + this.inputx * BasePostion.width ;
        game.add.tween(this.lightBlock).to({alpha:0.5},100).to({alpha:0},100).start();

    },
    over:function(){
        game.state.start('Over');
    },
    render:function(){
        game.debug.text(this.inputx,100,200,"#000000");
       // game.debug.pointer(game.input.mousePointer);
        game.debug.pointer(game.input.activePointer);
    }
}