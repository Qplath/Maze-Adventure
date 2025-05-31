const size = 16
const maze = []
const visited = []
for (let y = 0; y < size; y++) {
    maze[y] = []
    visited[y] = []
    for (let x = 0; x < size; x++) {
        maze[y][x] = {top: true, right: true, bottom: true, left: true}
        visited[y][x] = false
    }
}
function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[a[i], a[j]] = [a[j], a[i]]
    }
    return a
}
function carve(x, y) {
    visited[y][x] = true
    shuffle([[0,-1,'top','bottom'],[1,0,'right','left'],[0,1,'bottom','top'],[-1,0,'left','right']]).forEach(([dx,dy,dir,opp])=>{
        const nx = x+dx, ny = y+dy
        if (ny>=0&&ny<size&&nx>=0&&nx<size&&!visited[ny][nx]) {
            maze[y][x][dir]=false
            maze[ny][nx][opp]=false
            carve(nx,ny)
        }
    })
}
carve(0,0)
const mazeDiv = document.getElementById('maze')
mazeDiv.innerHTML = ''
for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
        const cell = document.createElement('div')
        cell.className = 'cell'
        if (maze[y][x].top) cell.style.borderTop = '4px solid #111'
        if (maze[y][x].right) cell.style.borderRight = '4px solid #111'
        if (maze[y][x].bottom) cell.style.borderBottom = '4px solid #111'
        if (maze[y][x].left) cell.style.borderLeft = '4px solid #111'
        cell.style.gridRowStart = y+1
        cell.style.gridColumnStart = x+1
        mazeDiv.appendChild(cell)
    }
}
const player = document.createElement('div')
player.id = 'player'
mazeDiv.appendChild(player)
const goal = document.createElement('div')
goal.id = 'goal'
mazeDiv.appendChild(goal)
let px = 0, py = 0
function setPlayerPos() {
    const cellW = mazeDiv.offsetWidth / size
    const cellH = mazeDiv.offsetHeight / size
    player.style.left = (px * cellW + 2) + 'px'
    player.style.top = (py * cellH + 2) + 'px'
}
function setGoalPos() {
    const cellW = mazeDiv.offsetWidth / size
    const cellH = mazeDiv.offsetHeight / size
    goal.style.left = ((size - 1) * cellW + 2) + 'px'
    goal.style.top = ((size - 1) * cellH + 2) + 'px'
}
setPlayerPos()
setGoalPos()
window.addEventListener('resize', () => {
    setPlayerPos()
    setGoalPos()
})
const overlay = document.getElementById('overlay')
const winMessage = document.getElementById('win-message')
const timerResult = document.getElementById('timer-result')
let startTime = null
let timerInterval = null

function startTimer() {
    startTime = Date.now()
}
function stopTimer() {
    if (timerInterval) clearInterval(timerInterval)
}
function getElapsedTime() {
    if (!startTime) return 0
    return Math.floor((Date.now() - startTime) / 1000)
}
function formatTime(sec) {
    const m = Math.floor(sec / 60)
    const s = sec % 60
    return m > 0 ? `${m}m ${s < 10 ? '0' : ''}${s}s` : `${s}s`
}
function showOverlayWin() {
    winMessage.textContent = 'You Win!'
    timerResult.textContent = 'Time: ' + formatTime(getElapsedTime())
    overlay.classList.add('active')
}
function showOverlay(msg) {
    winMessage.textContent = msg
    timerResult.textContent = ''
    overlay.classList.add('active')
}
function hideOverlay() {
    overlay.classList.remove('active')
    winMessage.textContent = ''
    timerResult.textContent = ''
}
hideOverlay()
function move(dx,dy) {
    let nx = px+dx, ny = py+dy
    if (nx<0||nx>=size||ny<0||ny>=size) return
    if (dx===-1&&maze[py][px].left) return
    if (dx===1&&maze[py][px].right) return
    if (dy===-1&&maze[py][px].top) return
    if (dy===1&&maze[py][px].bottom) return
    px = nx
    py = ny
    setPlayerPos()
    if (px===size-1&&py===size-1) {
        stopTimer()
        setTimeout(()=>showOverlayWin(),300)
        document.removeEventListener('keydown',keyHandler)
        removeArrowListeners()
    }
}
function keyHandler(e) {
    if (overlay.classList.contains('active')) return
    if (e.key==='ArrowUp') move(0,-1)
    if (e.key==='ArrowDown') move(0,1)
    if (e.key==='ArrowLeft') move(-1,0)
    if (e.key==='ArrowRight') move(1,0)
}
document.addEventListener('keydown',keyHandler)
function arrowTouchHandler(dir) {
    if (overlay.classList.contains('active')) return
    if (dir === 'up') move(0, -1)
    if (dir === 'down') move(0, 1)
    if (dir === 'left') move(-1, 0)
    if (dir === 'right') move(1, 0)
}
function addArrowListeners() {
    document.getElementById('arrow-up').addEventListener('touchstart', e => { e.preventDefault(); arrowTouchHandler('up') })
    document.getElementById('arrow-down').addEventListener('touchstart', e => { e.preventDefault(); arrowTouchHandler('down') })
    document.getElementById('arrow-left').addEventListener('touchstart', e => { e.preventDefault(); arrowTouchHandler('left') })
    document.getElementById('arrow-right').addEventListener('touchstart', e => { e.preventDefault(); arrowTouchHandler('right') })
    document.getElementById('arrow-up').addEventListener('mousedown', e => { e.preventDefault(); arrowTouchHandler('up') })
    document.getElementById('arrow-down').addEventListener('mousedown', e => { e.preventDefault(); arrowTouchHandler('down') })
    document.getElementById('arrow-left').addEventListener('mousedown', e => { e.preventDefault(); arrowTouchHandler('left') })
    document.getElementById('arrow-right').addEventListener('mousedown', e => { e.preventDefault(); arrowTouchHandler('right') })
}
function removeArrowListeners() {
    document.getElementById('arrow-up').replaceWith(document.getElementById('arrow-up').cloneNode(true))
    document.getElementById('arrow-down').replaceWith(document.getElementById('arrow-down').cloneNode(true))
    document.getElementById('arrow-left').replaceWith(document.getElementById('arrow-left').cloneNode(true))
    document.getElementById('arrow-right').replaceWith(document.getElementById('arrow-right').cloneNode(true))
}
addArrowListeners()
overlay.addEventListener('click',()=>{
    location.reload()
})
startTimer()