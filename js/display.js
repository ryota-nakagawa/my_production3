var bgcanvas = document.getElementById("background");
var midcanvas = document.getElementById("middleground");
var fgcanvas = document.getElementById("foreground");
var bgctx = bgcanvas.getContext("2d");
var midctx = midcanvas.getContext("2d");
var fgctx = fgcanvas.getContext("2d");
var rightPressed = leftPressed = upPressed = downPressed = spacePressed = false;
var lives = 3;
var score = 0;
var akuru = new Image();
var ship = new Image();
var plane = new Image();
var submarine = new Image();
var torpedo = new Image();
var akuruWidth = 220, akuruHeight = 176;
var initAkuruX = midcanvas.width/2 - akuruWidth/2, initAkuruY = 500;
var akuruX = initAkuruX, akuruY = initAkuruY;
var akuruSpeed = 3;
var shipWidth = 100, shipHeight = 60;
var initShipX = midcanvas.width, initShipY = midcanvas.height/2 - shipHeight*5/6;
var shipX = initShipX, shipY = initShipY;
var shipSpeed = 2;
var planeX, planeY;
var planeWidth = 84, planeHeight = 48;
var planeSpeed = 5;
var plane_number;
var plane_direction;
var smX, smY;
var smWidth = 100, smHeight = 60;
var sm_direction;
var smSpeed = 1;
var tpX = 0, tpY = 0;
var tpWidth = 80, tpHeight = 8;
akuru.src = "assets/img/akuru.png"; 
ship.src = "assets/img/ship_left.png";

//キーイベントを追加
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

//背景画面を作成
function drawScene(){
    var ifOriginal = false;
    var seaweed = new Image();
    var cloud1 = new Image();
    var cloud2 = new Image();
    var cloud3 = new Image();
    seaweed.src = "assets/img/seaweed.jpg";
    cloud1.src = "assets/img/cloud1.jpg";
    cloud2.src = "assets/img/cloud2.jpg";
    cloud3.src = "assets/img/cloud3.jpg";
    seaweed.onload = function(){
        bgctx.drawImage(seaweed, -10, 635, 125, 125);
    }
    cloud1.onload = function(){
        bgctx.drawImage(cloud1, 370, 5, 280, 280);
    }
    cloud2.onload = function(){
        bgctx.drawImage(cloud2, 70, -90, 370, 370);
    }
    cloud3.onload = function(){
        bgctx.drawImage(cloud3, 800, -90, 370, 370);
    }
    function Scene(){
        if(ifOriginal){
            bgctx.drawImage(cloud1, 370, 0, 280, 280);
            bgctx.drawImage(cloud2, 70, -95, 370, 370);
            bgctx.drawImage(cloud3, 800, -95, 370, 370);
            ifOriginal = false;
        }else{
            bgctx.drawImage(cloud1, 370, 23, 280, 234);
            bgctx.drawImage(cloud2, 70, -65, 370, 310);
            bgctx.drawImage(cloud3, 800, -65, 370, 310);
            ifOriginal = true;
        }
    }
    setInterval(Scene, 500);
}

//海を描画
function drawSea(){
    fgctx.fillStyle = "rgba(0,128,255,0.4)";
    fgctx.fillRect(0, fgcanvas.height/2, fgcanvas.width, fgcanvas.height/2);
}

//主人公のモンスターを描画
function drawAkuru(){
    akuru.onload = function(){
        midctx.drawImage(akuru, akuruX, akuruY, akuruWidth, akuruHeight);
    }
    if(spacePressed){
        akuru.src = "assets/img/akuru_attack.png";
    }
    if(rightPressed && akuruX <= bgcanvas.width - akuruWidth + akuruSpeed){
        if(!spacePressed){
            akuru.src = "assets/img/akuru_right.png";
        }
        akuruX += akuruSpeed;
    }else if(leftPressed && akuruX - akuruSpeed >= 0){
        if(!spacePressed){
            akuru.src = "assets/img/akuru_left.png";
        }
        akuruX -= akuruSpeed;
    }else if(upPressed && akuruY - akuruSpeed >= midcanvas.height/2 - akuruHeight*4/5){
        if(!spacePressed){
            akuru.src = "assets/img/akuru_up.png";
        }
        akuruY -= akuruSpeed;
    }else if(downPressed && akuruY <= bgcanvas.height - akuruHeight + akuruSpeed){
        if(!spacePressed){
            akuru.src = "assets/img/akuru_down.png";
        }
        akuruY += akuruSpeed;
    }else if(!upPressed && !downPressed && !rightPressed && !leftPressed){
        if(!spacePressed){
            akuru.src = "assets/img/akuru.png";
        }
    }
    midctx.drawImage(akuru, akuruX, akuruY, akuruWidth, akuruHeight);
}

//船を描画する
var ships = []
function drawShip(){
    ship.onload = function(){
        midctx.drawImage(ship, shipX, shipY, shipWidth, shipHeight);
    }
    if(shipX + shipWidth >= 0){
        shipX -= shipSpeed;
    }else{
        shipX = initShipX;
    }
    midctx.drawImage(ship, shipX, shipY, shipWidth, shipHeight);
}

//潜水艦の方向を決定する
function decide_submarine(){
    if(smSpeed < 0){
        smSpeed = -smSpeed;
    }
    sm_direction = Math.round(Math.random());
    if(sm_direction === 0){
        smX = -smWidth;
        smY = midcanvas.height - smHeight*2;
        submarine.src = "assets/img/sm_right.png";
    }else{
        smX = midcanvas.width;
        smY = midcanvas.height/2 + smHeight;
        submarine.src = "assets/img/sm_left.png";
    }
    setInterval(decide_submarine, 7000);
}

//潜水艦を描画する
function drawSubmarine(){
    var d = sm_direction;
    if(d === 0){
        if(smX === smWidth/2){
            smSpeed = -smSpeed;
        }
        smX += smSpeed;
    }else{
        if(smX === midcanvas.width - smWidth*3/2){
            smSpeed = -smSpeed;
        }
        smX -= smSpeed;
    }
    submarine.onload = function(){
        midctx.drawImage(submarine, smX, smY, smWidth, smHeight);
    }
    midctx.drawImage(submarine, smX, smY, smWidth, smHeight);
}

//戦闘機の数と方向を決定する
function decide_plane(){
    plane_number = Math.round(Math.random()) + 1;
    plane_direction = Math.round(Math.random());
    if(plane_direction === 0){
        planeX = midcanvas.width;
        planeY = planeHeight;
        plane.src = "assets/img/plane_left.png";
    }else{
        planeX = -planeWidth;
        planeY = planeHeight*2;
        plane.src = "assets/img/plane_right.png";
    }
    setInterval(decide_plane, 8000);
}

//戦闘機を描画する
function drawPlane(){
    var n = plane_number;
    var d = plane_direction;
    if(n === 1){
        plane.onload = function(){
            midctx.drawImage(plane, planeX, planeY, planeWidth, planeHeight);
        }
        midctx.drawImage(plane, planeX, planeY, planeWidth, planeHeight);
    }else{
        plane.onload = function(){
            midctx.drawImage(plane, planeX, planeY, planeWidth, planeHeight);
            midctx.drawImage(plane, planeX + planeWidth, planeY, planeWidth, planeHeight);
        }
        midctx.drawImage(plane, planeX, planeY, planeWidth, planeHeight);
        midctx.drawImage(plane, planeX + planeWidth, planeY, planeWidth, planeHeight);
    }
    if(d === 0){
        planeX -= planeSpeed;
    }else{
        planeX += planeSpeed;
    }
}

//残りライフと得点を表示させる
function drawDetails(){
    fgctx.fillStyle = "rgba(255,255,255,0.7)";
    fgctx.fillRect(870, 553, 245, 187);
}

//残り時間を表示させる
function clock() {
    const now = new Date();
    fgctx.save();
    fgctx.clearRect(10, 10, 130, 130);
    fgctx.fillStyle = "rgba(225, 221, 0, 0.8)";
    //fgctx.fillStyle = "rgba(225, 225, 225, 0.8)";
    fgctx.fillRect(10, 10, 130, 130);
    fgctx.translate(75, 75);
    fgctx.scale(0.4, 0.4);
    fgctx.rotate(-Math.PI / 2);
    fgctx.strokeStyle = "black";
    fgctx.fillStyle = "white";
    fgctx.lineWidth = 8;
    fgctx.lineCap = "round";
  
    // 文字盤の時
    fgctx.save();
    for (let i = 0; i < 12; i++) {
      fgctx.beginPath();
      fgctx.rotate(Math.PI / 6);
      fgctx.moveTo(100, 0);
      fgctx.lineTo(120, 0);
      fgctx.stroke();
    }
    fgctx.restore();
  
    // 文字盤の分
    fgctx.save();
    fgctx.lineWidth = 5;
    for (let i = 0; i < 60; i++) {
      if (i % 5 !== 0) {
        fgctx.beginPath();
        fgctx.moveTo(117, 0);
        fgctx.lineTo(120, 0);
        fgctx.stroke();
      }
      fgctx.rotate(Math.PI / 30);
    }
    fgctx.restore();
  
    const sec = now.getSeconds() + now.getMilliseconds() / 1000;
    const min = now.getMinutes();
    const hr = now.getHours() % 12;
  
    fgctx.fillStyle = "black";
  
    // Write Hours
    fgctx.save();
    fgctx.rotate(
      (Math.PI / 6) * hr + (Math.PI / 360) * min + (Math.PI / 21600) * sec,
    );
    fgctx.lineWidth = 14;
    fgctx.beginPath();
    fgctx.moveTo(-20, 0);
    fgctx.lineTo(80, 0);
    fgctx.stroke();
    fgctx.restore();
  
    // 分針
    fgctx.save();
    fgctx.rotate((Math.PI / 30) * min + (Math.PI / 1800) * sec);
    fgctx.lineWidth = 10;
    fgctx.beginPath();
    fgctx.moveTo(-28, 0);
    fgctx.lineTo(112, 0);
    fgctx.stroke();
    fgctx.restore();
  
    // 秒針
    fgctx.save();
    fgctx.rotate((sec * Math.PI) / 30);
    fgctx.strokeStyle = "#D40000";
    fgctx.fillStyle = "#D40000";
    fgctx.lineWidth = 6;
    fgctx.beginPath();
    fgctx.moveTo(-30, 0);
    fgctx.lineTo(83, 0);
    fgctx.stroke();
    fgctx.beginPath();
    fgctx.arc(0, 0, 10, 0, Math.PI * 2, true);
    fgctx.fill();
    fgctx.beginPath();
    fgctx.arc(95, 0, 10, 0, Math.PI * 2, true);
    fgctx.stroke();
    fgctx.fillStyle = "rgb(0, 0, 0, 0)";
    fgctx.arc(0, 0, 3, 0, Math.PI * 2, true);
    fgctx.fill();
    fgctx.restore();
  
    fgctx.beginPath();
    fgctx.lineWidth = 14;
    fgctx.strokeStyle = "#325FA2";
    fgctx.arc(0, 0, 142, 0, Math.PI * 2, true);
    fgctx.stroke();
  
    fgctx.restore();

    window.requestAnimationFrame(clock);
  }

function keyDownHandler(e){
    if(e.keyCode === 32){
        spacePressed = true;
    }
    if(e.key === "Right" || e.key === "ArrowRight"){
        rightPressed = true;
    }else if(e.key === "Left" || e.key === "ArrowLeft"){
        leftPressed = true;
    }else if(e.key === "Up" || e.key === "ArrowUp"){
        upPressed = true;
    }else if(e.key === "Down" || e.key === "ArrowDown"){
        downPressed = true;
    }
}

function keyUpHandler(e){
    if(e.keyCode === 32){
        spacePressed = false;
    }
    if(e.key === "Right" || e.key === "ArrowRight"){
        rightPressed = false;
    }else if(e.key === "Left" || e.key === "ArrowLeft"){
        leftPressed = false;
    }else if(e.key === "Up" || e.key === "ArrowUp"){
        upPressed = false;
    }else if(e.key === "Down" || e.key === "ArrowDown"){
        downPressed = false;
    }
}

//プレイ動作
function draw(){
    midctx.clearRect(akuruX, akuruY, akuruWidth, akuruHeight);
    midctx.clearRect(shipX, shipY, shipWidth, shipHeight);
    midctx.clearRect(0, planeHeight, midcanvas.width, planeHeight*2);
    midctx.clearRect(smX, smY, smWidth, smHeight);
    drawAkuru();
    drawShip();
    drawSubmarine();
    drawPlane();
    drawDetails();
    requestAnimationFrame(draw);
};

//プレイ前の画面描画
drawScene();
drawSea();
drawAkuru();
draw();
decide_submarine();
decide_plane();
torpedo.src = "assets/img/torpedo_left.png";
torpedo.onload = function(){
    midctx.drawImage(torpedo, tpX, tpY, tpWidth, tpHeight);
}
window.requestAnimationFrame(clock);