var bgcanvas = document.getElementById("background");
var midcanvas = document.getElementById("middleground");
var fgcanvas = document.getElementById("foreground");
var bgctx = bgcanvas.getContext("2d");
var midctx = midcanvas.getContext("2d");
var fgctx = fgcanvas.getContext("2d");
var button = document.getElementById("button");
var rightPressed = leftPressed = upPressed = downPressed = spacePressed = false;
var lives = 3;
var score = 0;
var startTime, currentTime, sec;
//画像オブジェクトを生成
var akuru = new Image();
var ship = new Image();
var plane = new Image();
var submarine = new Image();
var torpedo = new Image();
var bomb = new Image();
//各オブジェクトのパロメータを設定
akuru.src = "assets/img/akuru/akuru.png"; 
var akuruWidth = 220, akuruHeight = 176;
var initAkuruX = midcanvas.width/2 - akuruWidth/2, initAkuruY = 500;
var akuruX = initAkuruX, akuruY = initAkuruY;
var akuruSpeed = 3;
var shipWidth = 100, shipHeight = 60;
var initShipX = midcanvas.width, initShipY = midcanvas.height/2 - shipHeight*5/6;
var shipX = initShipX, shipY = initShipY;
var ship_direction;
var shipSpeed = 3;
var planeX, planeY;
var planeWidth = 84, planeHeight = 48;
var planeSpeed = 5;
var plane_number;
var plane_direction;
var smX, smY;
var smWidth = 100, smHeight = 60;
var sm_direction;
var smSpeed = 1;
var tpX, tpY;
var tpWidth = 80, tpHeight = 8;
var tpSpeed = 8;
var bombX, bombY;
var bombWidth = 40, bombHeight = 20;
var bombSpeed = 8;
//魚雷を発射・爆弾を投下するときかどうかを判断
var torpedoJudge;
var bombJudge;
//魚雷や爆弾が瞬間的に1回当たったかどうか判断
var torpedoAttackJudge;
var bombAttackJudge;
var imageURLs = ["assets/img/akuru/akuru_attack.png","assets/img/akuru/akuru_down.png","assets/img/akuru/akuru_left.png","assets/img/akuru/akuru_right.png",
                 "assets/img/akuru/akuru_up.png","assets/img/akuru/akuru.png","assets/img/weapon/bomb_left.png","assets/img/weapon/bomb_right.png",
                 "assets/img/weapon/effect.png","assets/img/weapon/plane_left.png","assets/img/weapon/plane_right.png","assets/img/weapon/ship_left.png",
                 "assets/img/weapon/ship_right.png","assets/img/weapon/sm_left.png","assets/img/weapon/sm_right.png","assets/img/weapon/torpedo_left.png","assets/img/weapon/torpedo_right.png"
                ];

//キーイベントを追加
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("keypress", keyEnterPress);

//背景画面を作成
function drawScene(){
    var ifOriginal = false;
    var seaweed = new Image();
    var cloud1 = new Image();
    var cloud2 = new Image();
    var cloud3 = new Image();
    seaweed.src = "assets/img/scene/seaweed.jpg";
    cloud1.src = "assets/img/scene/cloud1.jpg";
    cloud2.src = "assets/img/scene/cloud2.jpg";
    cloud3.src = "assets/img/scene/cloud3.jpg";
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
        akuru.src = "assets/img/akuru/akuru_attack.png";
    }
    if(rightPressed && akuruX <= bgcanvas.width - akuruWidth + akuruSpeed){
        if(!spacePressed){
            akuru.src = "assets/img/akuru/akuru_right.png";
        }
        akuruX += akuruSpeed;
    }else if(leftPressed && akuruX - akuruSpeed >= 0){
        if(!spacePressed){
            akuru.src = "assets/img/akuru/akuru_left.png";
        }
        akuruX -= akuruSpeed;
    }else if(upPressed && akuruY - akuruSpeed >= midcanvas.height/2 - akuruHeight*4/5){
        if(!spacePressed){
            akuru.src = "assets/img/akuru/akuru_up.png";
        }
        akuruY -= akuruSpeed;
    }else if(downPressed && akuruY <= bgcanvas.height - akuruHeight + akuruSpeed){
        if(!spacePressed){
            akuru.src = "assets/img/akuru/akuru_down.png";
        }
        akuruY += akuruSpeed;
    }else if(!upPressed && !downPressed && !rightPressed && !leftPressed){
        if(!spacePressed){
            akuru.src = "assets/img/akuru/akuru.png";
        }
    }
    midctx.drawImage(akuru, akuruX, akuruY, akuruWidth, akuruHeight);
}

//船の方向を決定
function decide_ship(){
    ship_direction = Math.round(Math.random());
    if(ship_direction === 0){
        ship.src = "assets/img/weapon/ship_right.png"
        shipX = -shipWidth;
        shipY = initShipY;
    }else{
        ship.src = "assets/img/weapon/ship_left.png"
        shipX = initShipX;
        shipY = initShipY;
    }
    setInterval(decide_ship, 8000);
}

//船を描画
function drawShip(){
    ship.onload = function(){
        midctx.drawImage(ship, shipX, shipY, shipWidth, shipHeight);
    }
    if(ship_direction === 0){
        shipX += shipSpeed;
    }else{
        shipX -= shipSpeed;
    }
    midctx.drawImage(ship, shipX, shipY, shipWidth, shipHeight);
}

//潜水艦の方向を決定
function decide_submarine(){
    torpedoJudge = false;
    torpedoAttackJudge = false;
    if(smSpeed < 0){
        smSpeed = -smSpeed;
    }
    sm_direction = Math.round(Math.random());
    if(sm_direction === 0){
        smX = -smWidth;
        smY = midcanvas.height - smHeight*2;
        submarine.src = "assets/img/weapon/sm_right.png";
    }else{
        smX = midcanvas.width;
        smY = midcanvas.height/2 + smHeight;
        submarine.src = "assets/img/weapon/sm_left.png";
    }
    setInterval(decide_submarine, 6000);
}

//潜水艦を描画
function drawSubmarine(){
    var d = sm_direction;
    if(d === 0){
        if(smX === smWidth/2){
            smSpeed = -smSpeed;
            torpedoJudge = true;
        }
        smX += smSpeed;
    }else{
        if(smX === midcanvas.width - smWidth*3/2){
            smSpeed = -smSpeed;
            torpedoJudge = true;
        }
        smX -= smSpeed;
    }
    submarine.onload = function(){
        midctx.drawImage(submarine, smX, smY, smWidth, smHeight);
    }
    midctx.drawImage(submarine, smX, smY, smWidth, smHeight);
}

//魚雷を描画
function drawTorpedo(){
    if(torpedoAttackJudge === true){
        tpX = -tpWidth*2;
        tpY = -tpHeight*2
    }else{
        if(torpedoJudge === true){
            if(sm_direction === 0){
                tpX += tpSpeed;
                torpedo.src = "assets/img/weapon/torpedo_right.png";
            }else{
                tpX -= tpSpeed;
                torpedo.src = "assets/img/weapon/torpedo_left.png";
            }
        }else{
            tpX = smX;
            tpY = smY + smHeight*2/3;
        }
        torpedo.onload = function(){
            midctx.drawImage(torpedo, tpX, tpY, tpWidth, tpHeight);
        }
        midctx.drawImage(torpedo, tpX, tpY, tpWidth, tpHeight);
    }
}

//戦闘機の数と方向を決定
function decide_plane(){
    bombJudge = false;
    bombAttackJudge = false;
    plane_number = Math.round(Math.random()) + 1;
    plane_direction = Math.round(Math.random());
    if(plane_direction === 0){
        planeX = -planeWidth;
        planeY = planeHeight*2;
        plane.src = "assets/img/weapon/plane_right.png";
    }else{
        planeX = midcanvas.width;
        planeY = planeHeight;
        plane.src = "assets/img/weapon/plane_left.png";
    }
    setInterval(decide_plane, 7000);
}

//戦闘機を描画
function drawPlane(){
    var n = plane_number;
    var d = plane_direction;
    if(akuruX <= planeX && planeX <= akuruX + akuruWidth){
        bombJudge = true;
    }
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
        planeX += planeSpeed;
    }else{
        planeX -= planeSpeed;
    }
}

//爆弾を描画
function drawBomb(){
    if(bombAttackJudge === true || bombY > midcanvas.height/2 - bombHeight){
        bombX = -planeWidth*10;
        bombY = -planeHeight*10;
    }else{
        if(plane_direction === 0){
            bomb.src = "assets/img/weapon/bomb_right.png";
        }else{
            bomb.src = "assets/img/weapon/bomb_left.png";
        }
        if(bombJudge === true){
            bombY += bombSpeed;
            if(plane_direction === 0){
                bombX += planeSpeed;
            }else{
                bombX -= planeSpeed;
            }
        }else{
            bombX = planeX + planeWidth/3;
            bombY = planeY + planeHeight/2;
        }
        if(plane_number === 1){
            bomb.onload = function(){
                midctx.drawImage(bomb, bombX, bombY, bombWidth, bombHeight);
            }
            midctx.drawImage(bomb, bombX, bombY, bombWidth, bombHeight);
        }else{
            bomb.onload = function(){
                midctx.drawImage(bomb, bombX, bombY, bombWidth, bombHeight);
                midctx.drawImage(bomb, bombX + planeWidth, bombY, bombWidth, bombHeight);
            }
            midctx.drawImage(bomb, bombX, bombY, bombWidth, bombHeight);
            midctx.drawImage(bomb, bombX + planeWidth, bombY, bombWidth, bombHeight);
        }
    }
}

//残りライフと得点を表示
function drawDetails(){
    fgctx.clearRect(870, 570, 245, 160);
    fgctx.fillStyle = "rgba(255,255,255,0.8)";
    fgctx.fillRect(870, 570, 245, 160);
    fgctx.fillStyle = "black";
    fgctx.lineWidth = 3;
    fgctx.font = "38px Century Gothic";
    fgctx.fillText(`LIVES :  ${lives}`, 910, 630);
    fgctx.fillText(`SCORE :  ${score}`, 880, 700);
}

//残り時間を表示
function clock(){
    currentTime = new Date();
    fgctx.save();
    fgctx.clearRect(10, 10, 130, 130);
    fgctx.fillStyle = "rgba(225, 221, 0, 0.8)";
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
  
    sec = currentTime.getSeconds() - startTime.getSeconds();
  
    fgctx.fillStyle = "black";
  
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

//全ての画像を読み込む
async function loadImages(imageUrls) {
    const promises = imageUrls.map(url => new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = url;
    }));
    await Promise.all(promises);
    return true;
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

function keyEnterPress(e){
    if(e.key === "Enter"){
        fgctx.clearRect(200, 270, 1000, 65);
        startTime = new Date();
        draw();
        decide_submarine();
        decide_plane();
        decide_ship();
        window.requestAnimationFrame(clock);
    }
    return false;
}

//プレイ動作
function draw(){
    if(lives === 0){
        alert("終了！");
        sessionStorage.setItem("lives", lives);
        sessionStorage.setItem("score", score);
        location.href = "result.html";
    }else{
        midctx.clearRect(akuruX, akuruY, akuruWidth, akuruHeight);
        midctx.clearRect(shipX, shipY, shipWidth, shipHeight);
        midctx.clearRect(bombX, bombY, bombWidth, bombHeight);
        midctx.clearRect(bombX + planeWidth, bombY, bombWidth, bombHeight);
        midctx.clearRect(-planeWidth*2, planeHeight, midcanvas.width + planeWidth*2, planeHeight*2);
        midctx.clearRect(tpX, tpY, tpWidth, tpHeight);
        midctx.clearRect(smX, smY, smWidth, smHeight);
        drawAkuru();
        drawShip();
        drawTorpedo();
        drawBomb();
        drawSubmarine();
        drawPlane();
        drawDetails();
        if(spacePressed){
            if(akuruX + akuruWidth/4 <= shipX + shipWidth/2 && shipX + shipWidth/2 <= akuruX + akuruWidth*3/4){
                if(akuruY + akuruHeight/2 <= shipY + shipHeight/2 && shipY + shipHeight/2 <= akuruY + akuruHeight){
                    score += 1;
                    ship.src = "assets/img/weapon/effect.png";
                }
            }
        }
        if(plane_number === 1 || plane_number === 2){
            if(akuruX <= bombX && bombX <= akuruX + akuruWidth){
                if(akuruY <= bombY && bombY <= akuruY + akuruHeight){
                    if(bombAttackJudge === false){
                        lives-= 1;
                        bombAttackJudge = true;
                    }
                }
            }
        }
        if(plane_number === 2){
            if(akuruX <= bombX + planeWidth && bombX + planeWidth <= akuruX + akuruWidth){
               if(akuruY <= bombY && bombY <= akuruY + akuruHeight){
                   if(bombAttackJudge === false){
                        lives -= 1;
                        bombAttackJudge = true;
                    }
                }
            } 
        }
        if(akuruX <= tpX && tpX <= akuruX + akuruWidth){
            if(akuruY <= tpY && tpY <= akuruY + akuruHeight){
                if(torpedoAttackJudge === false){
                    lives -= 1;
                    torpedoAttackJudge = true;
                }
            }
        }
        if(-1 <= sec && sec < 0){
            alert("終了！");
            sessionStorage.setItem("lives", lives);
            sessionStorage.setItem("score", score);
            location.href = "result.html";
        }else if(-10 <= sec && sec <= -8){
            fgctx.fillStyle = "red";
            fgctx.lineWidth = 3;
            fgctx.font = "35px Century Gothic";
            fgctx.fillText("あと10秒!", 500, 40);
        }else{
            fgctx.clearRect(0, 0, midcanvas.width, midcanvas.height/8);
        }
        requestAnimationFrame(draw);
    }
};

//プレイ前の画面描画
drawScene();
drawSea();
drawAkuru();
drawDetails();
fgctx.fillStyle = "green";
fgctx.lineWidth = 3;
fgctx.font = "35px Century Gothic";
fgctx.fillText("1回Enterしてスタート!", 380, 300);
fgctx.font = "30px Century Gothic";
fgctx.fillText("※もし動かなければタイトル画面に戻ってみてください", 200, 330);
//if(await loadImages(imageUrls)){
//    fgctx.fillStyle = "green";
//   fgctx.lineWidth = 3;
//    fgctx.font = "35px Century Gothic";
//    fgctx.fillText("1回Enterしてスタート!", 380, 300);
//    fgctx.font = "30px Century Gothic";
//    fgctx.fillText("※もし動かなければタイトル画面に戻ってみてください", 200, 330);
//}else{
//    fgctx.fillStyle = "green";
//    fgctx.lineWidth = 3;
//    fgctx.font = "35px Century Gothic";
//    fgctx.fillText("少々お待ちください", 380, 300);
//}