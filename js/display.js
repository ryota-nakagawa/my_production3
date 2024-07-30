
var config = {
    type: Phaser.AUTO, 
    width: 480, 
    height: 320,
    backgroundColor: "#eee",
    scale: {
        mode: Phaser.Scale.WIDTH_CONTROLS_HEIGHT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    physics: {
        default: "arcade",
    }
};
var ball;

function preload(){
    this.load.image("ball", "ball.png");
    this.load.image("background", "../assets/img/space3.png");
}

function create(){
    ball = this.add.sprite(50, 50, "ball");
    this.add.image(240, 160, "background");
}

function update(){
    
}

var game = new Phaser.Game(config);