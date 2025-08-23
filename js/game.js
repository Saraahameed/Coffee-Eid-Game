const startScreen = document.getElementById('startScreen')
const livingRoomScreen = document.getElementById('livingRoomScreen')
const askingScreen = document.getElementById('askingScreen')
const fatherScreen = document.getElementById('fatherScreen')
const gameScreen = document.getElementById('gameScreen')
const winScreen = document.getElementById('winScreen')
const loseScreen = document.getElementById('loseScreen')

const startBtn = document.getElementById('startBtn')
const talkFatherBtn = document.getElementById('talkFatherBtn')
const nextFromAskingBtn = document.getElementById('nextFromAskingBtn')
const startMiniGameBtn = document.getElementById('startMiniGameBtn')
const muteBtn = document.getElementById('muteBtn')
const playAgainWin = document.getElementById('showNextImage')
const playAgainLose = document.getElementById('showNextImageLose')

const oneBD = document.getElementById('oneBD')
const canvas = document.getElementById('gameCanvas')
const ctx = canvas.getContext('2d')
const scoreDisplay = document.getElementById('scoreDisplay')

const bgMusic = document.getElementById('bgMusic')
const winSound = document.getElementById('winSound')
const loseSound = document.getElementById('loseSound')

let isMuted = false
let gameInterval, spawnInterval
let objects = []
let score = 0

const ahmedImg = new Image()
ahmedImg.src = "assets/pictures/Ahmed.PNG"
const beanImg = new Image()
beanImg.src = "assets/pictures/bean.PNG"
const sugarImg = new Image()
sugarImg.src = "assets/pictures/sugar.PNG"

const player = { x: canvas.width/2-32, y: canvas.height-80, width: 64, height: 64, speed: 7 }

const keys = {}
document.addEventListener('keydown', e => keys[e.key] = true)
document.addEventListener('keyup', e => keys[e.key] = false)

startBtn.addEventListener('click', () => {
  startScreen.style.display = 'none'
  livingRoomScreen.style.display = 'flex'
})

talkFatherBtn.addEventListener('click', () => {
  livingRoomScreen.style.display = 'none'
  askingScreen.style.display = 'flex'
})

nextFromAskingBtn.addEventListener('click', () => {
  askingScreen.style.display = 'none'
  fatherScreen.style.display = 'flex'
})

startMiniGameBtn.addEventListener('click', () => {
  fatherScreen.style.display = 'none'
  gameScreen.style.display = 'flex'
  bgMusic.play()
  startGame()
})

muteBtn.addEventListener('click', () => {
  isMuted = !isMuted
  bgMusic.muted = isMuted
  muteBtn.classList.toggle('active', isMuted)
})

const winMessage = document.createElement('div')
winMessage.classList.add('message')
winMessage.textContent = "You Win"

const loseMessage = document.createElement('div')
loseMessage.classList.add('message')
loseMessage.textContent = "You Lose"

function startGame() {
  score = 0
  scoreDisplay.textContent = "Score: 0"
  objects = []
  if(gameInterval) clearInterval(gameInterval)
  if(spawnInterval) clearInterval(spawnInterval)
  gameInterval = setInterval(updateGame, 30)
  spawnObjects()
}

function spawnObjects() {
  spawnInterval = setInterval(() => {
    const type = Math.random() < 0.7 ? 'bean' : 'sugar'
    const x = Math.random()*(canvas.width-32)
    objects.push({x:x, y:0, type:type, width:32, height:32})
  }, 1000)
}

function updateGame() {
  ctx.clearRect(0,0,canvas.width,canvas.height)
  if(keys['ArrowLeft'] && player.x>0) player.x -= player.speed
  if(keys['ArrowRight'] && player.x<canvas.width-player.width) player.x += player.speed
  ctx.drawImage(ahmedImg, player.x, player.y, player.width, player.height)
  for(let i=objects.length-1;i>=0;i--){
    objects[i].y += 4
    const img = objects[i].type==='bean'?beanImg:sugarImg
    ctx.drawImage(img, objects[i].x, objects[i].y, objects[i].width, objects[i].height)
    if(objects[i].y+objects[i].height>player.y &&
       objects[i].x+objects[i].width>player.x &&
       objects[i].x<player.x+player.width){
      if(objects[i].type==='bean'){
        score++
        objects.splice(i,1)
        scoreDisplay.textContent = "Score: " + score
      }else{
        endGame(false)
        return
      }
    }else if(objects[i].y>canvas.height){
      objects.splice(i,1)
    }
  }
  if(score>=10) endGame(true)
}

function endGame(won){
  clearInterval(gameInterval)
  clearInterval(spawnInterval)
  gameScreen.style.display='none'
  if(won){
    winScreen.style.display='flex'
    oneBD.style.display = 'block'
    winSound.play()
    winScreen.insertBefore(winMessage, winScreen.firstChild)
  }else{
    loseScreen.style.display='flex'
    oneBD.style.display = 'none'
    loseSound.play()
    loseScreen.insertBefore(loseMessage, loseScreen.firstChild)
  }
}

playAgainWin.addEventListener('click',()=>{
  winScreen.style.display='none'
  startScreen.style.display='flex'
  winScreen.removeChild(winMessage)
})

playAgainLose.addEventListener('click',()=>{
  loseScreen.style.display='none'
  startScreen.style.display='flex'
  loseScreen.removeChild(loseMessage)
})
