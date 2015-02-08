/**
 * Created by wuyanc on 2/4/2015.
 */
    //thinking:
    // 1.Use Matrix to reocrd every postion, when it is down.use active block to overlap top block array. And then go into clear process.
    //2.clear process:when color is same then clear col blocks until can't, then continueCheck row clear
    //3.out of clear process.
    //4.create new block
    //5.continueCheck for overlap

//additional: use animations to change color
"use strict";
Game.Play = function () {
    this.inputx = 0;
    this.activeBlock = void 0;
    this.TweenPlayer = void 0;
}
Game.Play.prototype = {
    preload: function () {
        for (var i = 0; i < SIZE; i++) //init one 7*7 matrix value to 0;
        {
            Matrix[i] = NOT_FILLED;

        }
    },
    getRandomColorIndex: function () {
        return game.rnd.integerInRange(1, Object.keys(COLOR).length);
    },
    initBlock: function (x, y, colorIndex, level) {
        if (typeof colorIndex === 'undefined') {
            colorIndex = 1;
        }
        if (typeof level === 'undefined') {
            level = 5;
        }
        var sprite = BLOCKS.create(x, y, 'green',colorIndex);
        sprite.animations.add('green1', [0], 10, false);
        sprite.animations.add('green2', [1], 10, false);
        sprite.animations.add('green3', [2], 10, false);
        sprite.animations.add('green4', [3], 10, false);
        sprite.animations.add('green5', [4], 10, false);
        game.physics.arcade.enable(sprite);

        sprite.body.collideWorldBounds = true;
        sprite.body.gravity.y = SPEED * level;

        sprite.colorIndex = colorIndex;
        //sprite.animations.play(COLOR[colorIndex]);
//        sprite.frame = colorIndex;
        sprite.body.immovable = true;
        return sprite;
    },
    putBlock: function (row, col, colorIndex, level) {
        return  this.initBlock(BasePostion.x + (col - 1) * BasePostion.width,
                BasePostion.y + BasePostion.height * (row - 1), colorIndex, level);
    },
    create: function () {
        //1.draw background & stage
        this.stage.backgroundColor = '#ffffff';
        var graphics = game.add.graphics(0, 0);
        graphics.beginFill(0x000000, 0.3);
        graphics.drawRect(BasePostion.x + 0, BasePostion.y, WIDTH - 2 * BasePostion.x, HEIGHT - BasePostion.y);
        graphics.endFill();

        //2.set physics & input
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.input.onDown.add(this.move, this);
        game.input.maxPointers = 1;

        //3. add block group
        BLOCKS = game.add.group();
        BLOCKS.enableBody = true;
        this.putBlock(12, 1, 3,0);
        this.putBlock(12, 2, 3,0);
        this.putBlock(12, 3, 2,0);
        this.putBlock(12, 4, 3,0);
        this.putBlock(11, 1, 2,0);
        this.putBlock(11, 2, 2,0);
        this.putBlock(11, 4, 2,0);
        this.putBlock(11, 3, 1,0);
        this.activeBlock = this.putBlock(1, 3, 1);
        this.activeBlock.body.immovable = false;
        //4. add light block that when click , it will show
        this.lightBlock = game.add.sprite(BasePostion.x, BasePostion.y, 'lightBlock');
        this.lightBlock.alpha = 0;

    },
    update: function () {
      if (IsMergingSignal === 0) {
          if(typeof this.activeBlock ==="undefined" ){ //if no active block then new one
              BLOCKS.setAll("body.immovable",true);
              this.activeBlock = this.putBlock(1, 2, 1);

              this.activeBlock.body.immovable = false;
          }
          else {
              //whether active block  collide block group?
              if(game.physics.arcade.collide(this.activeBlock, BLOCKS, this.checkOverLap, null, this))
              {
                  //do overLap
              }
              else{//if no
                  if(this.activeBlock.y===(HEIGHT-BLOCKHEIGHT)){//reach the bottom line

                      this.activeBlock =undefined;
                  }
              }

          }
        }
    },

    checkOverLap: function (activeBlockA, blockB) {

        if (blockB.colorIndex === activeBlockA.colorIndex && activeBlockA.colorIndex !== 4) {
            IsMergingSignal++;

             //block update function
            BLOCKS.remove(activeBlockA);
            var tempBlock = game.add.sprite(blockB.x, blockB.y - BLOCKHEIGHT, 'green');
            tempBlock.frame =  blockB.colorIndex;
            this.activeBlock=undefined;
            this.mergeTwoBlock(blockB, tempBlock);

        }
        else{
            if(activeBlockA.y===(blockB.y-BLOCKHEIGHT)){
                activeBlockA.body.gravity.y =0;
                this.activeBlock =undefined;
            }
        }

    },
    mergeTwoBlock: function (blockA, blockB) {
        var fade = game.add.tween(blockB);
        var mov = game.add.tween(blockB);
        mov.to({y: (blockA.height).toString()}, 500);//mov to blockA's position
        fade.to({alpha: 0}, 1000);
        mov.onComplete.add(function () {

            blockA.frame = blockA.colorIndex +1; //change to deeper color
            blockA.colorIndex ++;
        }, this);
        fade.onComplete.add(function () {
            var nextRowBlock = this.getNextRowBlock(blockA);
            if(nextRowBlock){//if can be merged

                this.checkOverLap(blockA,nextRowBlock); //this is async execution
            }
            else{
                this.checkLineClear(blockA); //this is  sync execution

                this.activeBlock = undefined;
            }
            IsMergingSignal--;
        }, this);
        fade.start();
        mov.start();


    },

    getNextRowBlock: function (block) {
        var nextRowBlockCanbeMerged = null;
        BLOCKS.forEach(function (item) {
            if (item.x === block.x && ((item.y - block.y) === BLOCKHEIGHT) && item.colorIndex ===block.colorIndex) {
                nextRowBlockCanbeMerged = item;
                return;
            }
        }, this, true);

        return  nextRowBlockCanbeMerged ;
    },
    checkLineClear:function(block){
        var clearList = [];
        BLOCKS.forEach(function(item){
            if(item.y===block.y){
                clearList.push(item);
                return;
            }
        },this,true);
        if(  clearList.length===NUM_OF_CLEAR){
            this.clearLine(clearList);
            BLOCKS.setAll('body.velocity.y',100); //TODO-move it when in actual ,put it here for mock test

        }

    },

    clearLine: function (clearList) {
        for (var _i = 0; _i < NUM_OF_CLEAR; _i++)
        {
            BLOCKS.remove(clearList[_i]);

        }

    },
    move: function (point) {
        if(IsMergingSignal===0&&this.activeBlock) {
            if (point.x < BasePostion.x || point.x > (WIDTH - BasePostion.x)) {
                this.inputx = "out of edge";
                return;
            }
            this.inputx = Math.floor((point.positionDown.x - BasePostion.x) / BasePostion.width);
            //get inputx's highest block
            //then judge whether can be moved
            this.lightBlock.x = BasePostion.x + this.inputx * BasePostion.width;
            this.activeBlock.x = BasePostion.x + this.inputx * BasePostion.width;
            game.add.tween(this.lightBlock).to({alpha: 0.5}, 100).to({alpha: 0}, 100).start();
        }
    },
    whetherExist:function(position){
        BLOCKS.forEach(function(item){
            if(item.x ===position['x']&&item.y===position['y']){
                return true;
            }
        },this,true);
        return false;
    },
    over: function () {
        game.state.start('Over');
    },
    render: function () {
        game.debug.text(this.inputx, 100, 200, "#000000");
        // game.debug.pointer(game.input.mousePointer);
        game.debug.pointer(game.input.activePointer);
       //game.debug.body(this.activeBlock);

    }
}