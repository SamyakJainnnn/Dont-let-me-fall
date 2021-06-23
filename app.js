const grid = document.querySelector('.grid');
const doodler = document.createElement('div');
let doodlerLeftSpace = 50;
let startPoint = 250;
let doodlerBottomSpace = startPoint;
let gameIsOver = false;
let platCount=5;
let platforms = [];
let upTimerId;
let downTimerId;
let isJumping = true;
let isMovingLeft = false;
let isMovingRight = false;
let leftTimerId;
let rightTimerId;
let score = 0;


function createDoodler(){
    grid.appendChild(doodler);
    doodler.classList.add('doodler');
    doodlerLeftSpace = platforms[0].left;
    doodler.style.left = doodlerLeftSpace +"px";
    doodler.style.bottom = doodlerBottomSpace + "px";
}

class platform{
    constructor(newPlatBottom){
        this.bottom = newPlatBottom;
        this.left = Math.random()*630;
        this.visual = document.createElement('div');

        const visual = this.visual;
        visual.setAttribute('class','platform');
        visual.style.left = this.left + 'px';
        visual.style.bottom = this.bottom + 'px';
        grid.appendChild(visual);
    }
}
function createPlatforms(){
    for(i=0;i<platCount;i++){
        let platGap = 570/platCount;
        let newPlatBottom = 100 + i*platGap;
        let newPlatform = new platform(newPlatBottom);
         platforms.push(newPlatform);
         console.log(platforms)
    }
}
function movePlatforms(){
    if(doodlerBottomSpace>200){
        platforms.forEach(function(block){                //block is platform
            block.bottom-=4 ;
            let visual = block.visual;
            visual.style.bottom = block.bottom + 'px';

            if(block.bottom<10){
                let firstPlatform = platforms[0].visual;
                firstPlatform.classList.remove('platform');
                platforms.shift();
                score++;       
                document.getElementById('score').innerHTML= score;
                let newPlatform = new platform(570);
                platforms.push(newPlatform);
            }
        })
    }
}
function jump(){
    clearInterval(downTimerId);
    isJumping = true;
    const jumpSound = new Audio('jump sound.wav');
    jumpSound.play();
    upTimerId = setInterval(function(){
        doodlerBottomSpace+=20;
        doodler.style.bottom = doodlerBottomSpace + 'px';         
        if(doodlerBottomSpace>startPoint + 190){
            fall();
        }  
    },30)
}
function fall(){
    clearInterval(upTimerId);
    isJumping = false;
    downTimerId =  setInterval(function(){
        doodlerBottomSpace-=5;
        doodler.style.bottom = doodlerBottomSpace + 'px'; 
        if(doodlerBottomSpace <=0 ){
            gameOver();
        }
        platforms.forEach(function(platform){
            if(
                doodlerBottomSpace>=platform.bottom &&
                doodlerBottomSpace<=platform.bottom + 15 &&
                (doodlerLeftSpace+60)>= platform.left &&
                doodlerLeftSpace<= platform.left + 170 
            ){
                startPoint = doodlerBottomSpace;
                jump()
            }
        })
    },30)       
}
function gameOver(){
    gameIsOver=true;
    while(grid.firstChild){
        grid.removeChild(grid.firstChild);
    };
    const outSound = new Audio('gameOver.wav');
    outSound.play();

    if(localStorage.getItem("HighScore")== null){        ////setting highscore
        localStorage.setItem("HighScore","0");
    }
    var highScore = parseInt(localStorage.getItem("HighScore"));
    if(highScore<score){
        highScore = localStorage.setItem("HighScore",score);
        highScore = localStorage.getItem("HighScore");
    }
    console.log(localStorage);

    grid.innerHTML = '<p id = "endscore">Score:'+ score +"</p>" + '<p id = "highScore">' + 
                     "HighScore: "+ highScore +"</p>" + '<button id = "reset">Reset</button>';
    clearInterval(downTimerId);
    clearInterval(upTimerId);
    clearInterval(leftTimerId);
    clearInterval(rightTimerId);

    let s =  document.querySelector('#reset');       //restart button
    s.addEventListener('click',restart);
}
function control(e){
    if(e.key === "ArrowLeft"){
        moveLeft();
    }else if(e.key ==="ArrowRight"){
        moveRight();
    }else if(e.key ==="ArrowUp"){
        moveStraight();
    }
}
    function moveLeft(){
        if(isMovingRight=true){
            clearInterval(rightTimerId);
            isMovingRight = false;
        }
        if(isMovingLeft===false){
        isMovingLeft = true;
        leftTimerId = setInterval(function(){
            if(doodlerLeftSpace>=0){
            doodlerLeftSpace -=5;
            doodler.style.left = doodlerLeftSpace + 'px';
            }else{
                moveRight();
            }
        },20)
    }
    }
    function moveRight(){
        if(isMovingLeft=true){
            clearInterval(leftTimerId);
            isMovingLeft= false;
        }
        if(isMovingRight === false){
        isMovingRight = true;
        rightTimerId = setInterval(function(){
            if(doodlerLeftSpace<=740){
            doodlerLeftSpace +=5;
            doodler.style.left = doodlerLeftSpace + 'px';
            }else{
                moveLeft();
            }
        },20)
        }
    }
function moveStraight(){
    isMovingLeft = false;
    isMovingRight = false;
    clearInterval(rightTimerId);
    clearInterval(leftTimerId);
}

function start(){
    if (gameIsOver === false){
        const gameSound = new Audio('gameSound.wav');
        gameSound.play();
        createPlatforms();
        createDoodler();
        setInterval(movePlatforms,30);
        jump();
        document.addEventListener('keydown',control);
    }
}
function restart(){
    window.location.reload();
}
 start()//attach to a button later


