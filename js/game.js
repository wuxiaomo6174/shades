/**
 * Created by wuyanc on 2/4/2015.
 */

var WIDTH=400;
var HEIGHT=490;
var BLOCKHEIGHT= 35;
var BLOCKWIDTH=90;
var ROW=12;
var COL=4;
var LineBorder =0;
var SPEED= 400;
var FASTSPEED=800;
var BasePostion={x:20,y:70,width:BLOCKWIDTH,height:BLOCKHEIGHT};
var IsMergingSignal = 0;
var NUM_OF_CLEAR =4;
var SIZE= 48; //BLCOK NUMBER 4*12
var SIZEX= 4;
var SIZEY= 12;
var Block_Color_Pick_Array=[0,0,0,0,0,1,1,1,1,2,2,2,3,3,4]; //let have more shadow color blocks, less deep color blocks
var ScoreText=void 0 ; // equal to "undefined"
var GlobalScore =0;
var Matrix=[];
var NotUsedMatrix = [];  //  stand for not used;
var COLOR={1:"green1",2:"green2",3:"green3",4:"green4",5:"green5"};
var BLOCKS=void 0;
var SUBBLOCKS= void 0;
var HAS_BEEN_FILLED=1;
var NOT_FILLED=0;

var game = new Phaser.Game(WIDTH,HEIGHT,Phaser.AUTO,"gameContainer");

game.state.add('Load', Game.Load);
game.state.add('Play', Game.Play);
game.state.add('Over', Game.Over);

game.state.start('Load');