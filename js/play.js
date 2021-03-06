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

    this.activeBlock = void 0;
    this.noMoveDownGroup = void 0;
}
Game.Play.prototype = {
    preload: function () {
        for (var i = 0; i < SIZE; i++) //init one 7*7 matrix value to 0;
        {
            Matrix[i] = NOT_FILLED;

        }
    },
    getRandomColorIndex: function () {
        //return game.rnd.integerInRange(0, Object.keys(COLOR).length-1);

        return game.rnd.pick(Block_Color_Pick_Array);
    },
    getRandomColumn: function () {
        return game.rnd.integerInRange(0, 3);
    },
    initBlock: function (x, y, colorIndex, level) {
        if (typeof colorIndex === 'undefined') {
            colorIndex = 1;
        }
        if (typeof level === 'undefined') {
            level = 5;
        }
        var sprite = BLOCKS.create(x, y, 'green', colorIndex);
        game.physics.arcade.enable(sprite);
        sprite.body.collideWorldBounds = true;
        sprite.body.gravity.y = SPEED * level;

        sprite.colorIndex = colorIndex;

        sprite.body.immovable = true;
        return sprite;
    },
    putBlock: function (row, col, colorIndex, level) {
        return  this.initBlock(BasePostion.x + (col ) * BasePostion.width,
                BasePostion.y + BasePostion.height * (row ), colorIndex, level);
    },
    create: function () {
        //1.draw background & stage
        this.stage.backgroundColor = '#ffffff';
        var graphics = game.add.graphics(0, 0);
        graphics.beginFill(0x000000, 0.3);
        //TODO narrow background
        graphics.drawRect(BasePostion.x + 0, BasePostion.y, WIDTH - 2 * BasePostion.x, HEIGHT - BasePostion.y);
        graphics.endFill();

        //2.set physics & input
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.input.onDown.add(this.move, this);
        game.input.maxPointers = 1;

        //3. add block group
        BLOCKS = game.add.group();
        BLOCKS.enableBody = true;
        this.noMoveDownGroup = game.add.group();
        //4. add light block that when click , it will show
        this.lightBlock = game.add.sprite(BasePostion.x, BasePostion.y, 'lightBlock');
        this.lightBlock.alpha = 0;
        this.activeBlock = this.putBlock(11, 1, 4, 0);
        this.activeBlock = this.putBlock(11, 2, 4, 0);
        this.activeBlock = this.putBlock(11, 3, 4, 0);
        this.activeBlock = this.putBlock(10, 1, 3, 0);
        this.activeBlock = this.putBlock(10, 2, 3, 0);
        this.activeBlock = this.putBlock(1,3, 3, 3);
        this.activeBlock.body.immovable = false;
    },
    update: function () {
        if (IsMergingSignal === 0) {
            if (typeof this.activeBlock === "undefined") { //if no active block then new one
                BLOCKS.setAll("body.immovable", true);

                if (this.isOvered() === 0)
                    this.over();
                //this.activeBlock = this.putBlock(0, this.getRandomColumn(), this.getRandomColorIndex(),0.5);
                this.activeBlock = this.putBlock(0, 0, 2, 3);
                this.activeBlock.body.immovable = false;
            }
            else {
                //whether active block  collide block group?
                if (game.physics.arcade.collide(this.activeBlock, BLOCKS, this.checkOverLap, null, this)) {
                    //do overLap
                }
                else {//if no
                    if (this.activeBlock.y === (HEIGHT - BLOCKHEIGHT)) {//reach the bottom line
                        this.checkBottomLineClear(this.activeBlock);
                        this.activeBlock = undefined;
                    }
                    else {

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
            tempBlock.frame = blockB.colorIndex;
            this.activeBlock = undefined;
            this.mergeTwoBlock(blockB, tempBlock);

        }
        else {
            if (activeBlockA.y === (blockB.y - BLOCKHEIGHT)) {
                activeBlockA.body.gravity.y = 0;
                this.activeBlock = undefined;
            }
        }

    },
    mergeTwoBlock: function (blockA, blockB) {
        var fade = game.add.tween(blockB);
        var mov = game.add.tween(blockB);
        mov.to({y: (blockA.height).toString()}, 500);//mov to blockA's position
        fade.to({alpha: 0}, 1000);
        mov.onComplete.add(function () {

            blockA.frame = blockA.colorIndex + 1; //change to deeper color
            blockA.colorIndex++;
        }, this);
        fade.onComplete.add(function () {
            var nextRowBlock = this.getNextRowBlock(blockA);
            if (nextRowBlock) {//if can be merged

                this.checkOverLap(blockA, nextRowBlock); //this is async execution
            }
            else {
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
        var len = BLOCKS.length;
        for (var _i = 0; _i < len; _i++) {
            var item = BLOCKS.getChildAt(_i);
            if (item.x === block.x && ((item.y - block.y) === BLOCKHEIGHT) && item.colorIndex === block.colorIndex) {
                nextRowBlockCanbeMerged = item;
                break;
            }
        }


        return  nextRowBlockCanbeMerged;
    },
    checkBottomLineClear: function (block) {

        this.checkLineClear(block);

    },
    checkLineClear: function (block) {
        IsMergingSignal++;
        var clearList = [];
        var len = BLOCKS.length;
        for (var _i = 0; _i < len; _i++) {
            var item = BLOCKS.getChildAt(_i);
            if (item.y === block.y && item.colorIndex === block.colorIndex) {
                clearList.push(item);

            }
        }

        var clearLineY = block.y;
        if (clearList.length === NUM_OF_CLEAR) {
            this.clearLine(clearList);

            //move down up blocks
            this.moveDownBlocks(clearLineY);
        }
        else {
            IsMergingSignal--;
        }

    },
    moveDownBlocks: function (height) {
        //var len = BLOCKS.length;

        var tempSpriteList = [];
        for (var _i = 0; _i < BLOCKS.length; _i++) {
            var item = BLOCKS.getChildAt(_i);
            if ((item.y < height)) {
                tempSpriteList.push(item);

            }
        }

        var len = tempSpriteList.length;
        if (len > 0) {

            for (var _k = 0; _k < len; _k++) {
                var down = game.add.tween(tempSpriteList[_k]).to({y: BasePostion.height.toString()}, 500);
                if (_k === len - 1) {//if it is last tween
                    down.onComplete.add(function () {
                        IsMergingSignal--;
                    }, this);
                }
                down.start();
            }

        }
        else {

            IsMergingSignal--;
        }
    },
    clearLine: function (clearList) {
        for (var _i = 0; _i < NUM_OF_CLEAR; _i++) {
            BLOCKS.remove(clearList[_i]);

        }

    },
    move: function (point) {
        if (IsMergingSignal === 0 && this.activeBlock) {
            if (point.x < BasePostion.x || point.x > (WIDTH - BasePostion.x)) {
                this.inputx = "out of edge";
                return;
            }
            var inputCol = Math.floor((point.positionDown.x - BasePostion.x) / BasePostion.width);
            //get inputx's highest block
            //then judge whether can be moved
            var currectCol = Math.floor((this.activeBlock.x - BasePostion.x) / BasePostion.width);
            var res = this.canBeMoved(currectCol, inputCol);
            if (res === 0) {
                this.lightBlock.x = BasePostion.x + inputCol * BasePostion.width;
                this.activeBlock.x = BasePostion.x + inputCol * BasePostion.width;
                game.add.tween(this.lightBlock).to({alpha: 0.5}, 100).to({alpha: 0}, 100).start();
            }
            else if (res === 1) {
                //this.activeBlock.body.velocity.y = FASTSPEED;
            }
            else {
                //TODO play a warning sound,like b~~
            }
        }
    },
    canBeMoved: function (from, to) {// check can be move from xxx column to yyy column
        if (from === to)
            return 1;
        var direct = (to > from) ? 1 : -1;
        var currentPosition = this.activeBlock.y;
        var count = Math.abs(to - from);
        for (var _from = from + direct, _to = to, _c = 0; _c != count; _from = _from + direct, _c++) {
            var tempHighest = this.getHighest(_from);
            if (tempHighest - currentPosition <= BasePostion.height) //if
                return -1;
        }
        return 0;

    },
    getHighest: function (col) {
        //BLOCKS.sort('x',Phaser.SORT_DESCENDING);
        var Highest = HEIGHT;//pick a un existed num
        var len = BLOCKS.length;
        for (var _i = 0; _i < len; _i++) {
            var item = BLOCKS.getChildAt(_i);
            if (col === Math.floor(((item.x - BasePostion.x) / BasePostion.width))) {
                if (item.y < Highest) { // actually y is more small ,more higher it is
                    Highest = item.y;
                }
            }
        }

        return Highest;
    },
    isOvered: function () {
        var len = BLOCKS.length;
        for (var _i = 0; _i < len; _i++) {
            var item = BLOCKS.getChildAt(_i);
            if (item.y <= BasePostion.y) {
                return 0;
            }
        }
        return -1;
    },
    over: function () {
        game.state.start('Over');
    },
    render: function () {
        //game.debug.text(this.inputx, 100, 200, "#000000");
        // game.debug.pointer(game.input.mousePointer);
        //game.debug.pointer(game.input.activePointer);
        //game.debug.body(this.activeBlock);

    }
}