'use strict'
const NORMAL = '😃'
const WIN = "😎"
const DEAD = "😵"
const MINE = "&#128163"
const HINT = "💡"

var gIsFirst = true
var gBoard;
var gTime;
var gTimeInterval;
var gCorrectMarks;
var gElHintClicked = null
var gRecentBoards = []
var gRecenGameStats = []
var gIsManual = false

var gLevel = {
    SIZE: 4,
    MINES: 2
}
var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
}

// im sorry about the mess.. it was a hard problem and ill try to make it more readeble and nit on the weekend


function init() {
    clearInterval(gTimeInterval)
    initHints()
    gIsFirst = true
    gRecentBoards = []
    gRecenGameStats = []
    gIsManual = false

    ////// css stuff
    var elTime = document.querySelector('.display .value')
    var elRestart = document.querySelector('.restart-container p .restart')
    var elManualBtn = document.querySelector('.manual-btn')
    var elGameContainer = document.querySelector('.game-container')
    if (elGameContainer.classList.contains('manual-mode')) {
        elGameContainer.classList.remove('manual-mode')
    }
    var elOpenManual = document.querySelector('.open-manual')
    elOpenManual.style.display = 'none'
    elManualBtn.style.display = 'block'
    elManualBtn.innerText = 'Manual'
    elRestart.innerText = NORMAL
    elTime.innerText = '0.00'
    //////////////////

    gGame.isOn = true
    gGame.shownCount = 0
    gGame.markedCount = 0
    gGame.secsPassed = 0
    gCorrectMarks = 0
    gLevel.SIZE = 4
    gLevel.MINES = 2
    gBoard = createBoard()
    resetDiffBtnsColor()
    renderBoard()
}




function renderBoard() {
    var board = gBoard;
    var strHtml = '';
    for (var i = 0; i < board.length; i++) {
        strHtml += '<tr>'
        for (var j = 0; j < board[i].length; j++) {
            strHtml += '<td '
            var cell = board[i][j];
            var cellClass = '';
            var cellContent = (cell.minesAroundCount) ? cell.minesAroundCount : ''

            if (!cell.isShown) cellClass += ' hidden'
            if (cell.isMarked) cellClass += ' mark';
            if (cell.isMine) {
                cellClass += ' mine'
                cellContent = MINE
                strHtml += `style="background-color: rgb(241, 46, 12);"`
            }

            strHtml += `class="cell ${cellClass}" onclick="cellClicked(event, ${i}, ${j}), setMinesManual(this, ${i}, ${j})" 
            oncontextmenu="mark(${i},${j})">`
            strHtml += `${cellContent}</td>`
        }
        strHtml += '</tr>'
    }

    var elCells = document.querySelector('.game-cells');
    elCells.innerHTML = strHtml
}


function createBoard() {
    var board = []
    for (var i = 0; i < gLevel.SIZE; i++) {
        board[i] = []
        for (var j = 0; j < gLevel.SIZE; j++) {
            board[i][j] = createCell(i, j)
        }
    }
    return board
}


function createCell(i, j) {
    var cell = {
        location: { i, j },
        minesAroundCount: 0,
        isShown: false,
        isMine: false,
        isMarked: false,
    }

    return cell
}


function cellClicked(ev, i, j) {
    var cell = gBoard[i][j]
    if (gIsManual) return
    if (!gGame.isOn) return
    if (cell.isMarked) return
    if (gElHintClicked) {
        return showHintCells(i, j)
    }
    if (cell.isMine) gameOver(false)



    if (gIsFirst) {
        gIsFirst = false
        firstClick({ i, j })

    } else {
        gRecentBoards.push(copyBoard(gBoard))
        var gameCopy = copyObj(gGame)
        gRecenGameStats.push(gameCopy)
    }


    if (cell.minesAroundCount === 0) {
        expandShown([{ i, j }], [])
    }

    cell.isShown = true
    gGame.shownCount++
    gElHintClicked = null
    renderBoard()
}


function firstClick(firstPos) {
    var elManualBtn = document.querySelector('.manual-btn')
    elManualBtn.style.display = 'none'
    gTime = Date.now()
    gTimeInterval = setInterval(renderTime, 10)
    alowHintsFirstClick()
    gBoard = createBoard()
    var cell = gBoard[firstPos.i][firstPos.j]
    if (cell.isMine) gameOver(false)
    setMinesFirst(firstPos)
    countMinesNegs()
    setMinesNegsCount()

    // adding for the Undo
    gRecentBoards.push(copyBoard(gBoard))
    console.log(gBoard);
    var gameCopy = copyObj(gGame)
    gRecenGameStats.push(gameCopy)
}


function winCheck() {
    for (var i = 0; i < gLevel.SIZE; i++) {
        for (var j = 0; j < gLevel.SIZE; j++) {
            var cell = gBoard[i][j]
            if (!(cell.isMarked === cell.isMine)) return false
        }
    }
    return true
}


function gameOver(isWin) {
    showAllMineCells()
    clearInterval(gTimeInterval)
    gGame.isOn = false
    console.log("Game Over!")
    var elRestart = document.querySelector('.restart-container p .restart')
    elRestart.innerText = (isWin) ? WIN : DEAD
    gGame.isOn = false
}


function mark(i, j) {
    if (!gGame.isOn) return
    var cell = gBoard[i][j]
    if (gIsFirst) return
    if (cell.isShown) return
    // adding for the Undo
    gRecentBoards.push(copyBoard(gBoard))
    var gameCopy = copyObj(gGame)
    gRecenGameStats.push(gameCopy)

    if (cell.isMarked) {
        cell.isMarked = false
        gGame.markedCount--
    } else {
        cell.isMarked = true
        gGame.markedCount++
        renderBoard()
        if (winCheck()) return gameOver(true)
    }
    renderBoard()
}

function renderTime() {
    var currTime = Date.now()
    var elLogScreen = document.querySelector('.display .value')
    var timePassed = currTime - gTime
    gGame.secsPassed = (timePassed / 1000).toFixed(2)
    elLogScreen.innerText = `${gGame.secsPassed}`
}





function setMinesManual(elCell, i, j) {
    if (!gIsManual) return
    console.log(elCell);

    var cell = gBoard[i][j]
    cell.isMine = true
    cell.isShown = true
    renderBoard()

}


function initManualGame() {
    gIsFirst = false
    gIsManual = false
    alowHintsFirstClick()
    countMinesNegs()
    setMinesNegsCount()
    // adding for the Undo
    gRecentBoards.push(copyBoard(gBoard))
    console.log(gBoard);
    var gameCopy = copyObj(gGame)
    gRecenGameStats.push(gameCopy)
    gTime = Date.now()
    gTimeInterval = setInterval(renderTime, 10)
}

