'use strict'
const NORMAL = 'U+1F603'
const WON = "&#128526"
const DEAD = "&#128565"
const MINE = "&#128163"
const HINT = "💡"

var gBoard;
var gTime;
var gTimeInterval;
var gCorrectMarks;
var gLevel = {
    SIZE: 4,
    MINES: 2
}
var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}

function init() {
    clearInterval(gTimeInterval)
    var elTime = document.querySelector('.display .value')
    elTime.innerText = '0.00'
    gTime = Date.now()
    gGame.isOn = true
    gGame.shownCount = 0
    gGame.markedCount = 0
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
                strHtml += `style="background-color: red"`
            }

            strHtml += `class="cell ${cellClass}" onclick="cellClicked(event, ${i}, ${j})" 
            oncontextmenu="mark(${i},${j})">`
            // strHtml += cellContent
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
        isMarked: false
    }

    return cell
}


function gameOver() {
    
    console.log("Game Over!")
    gGame.isOn = false
    // resetDiffBtnsColor()
}


function cellClicked(ev, i, j) {
    // console.log('cell clicked:', gBoard[i][j]);
    var cell = gBoard[i][j]
    if (!gGame.isOn) return
    if (cell.isMarked) return
    if (cell.isMine) gameOver()
    if (gGame.shownCount === 0) {
        firstClick({ i, j })
    }
    if (cell.minesAroundCount === 0) {
        expandShown([{ i, j }], [])
    }

    cell.isShown = true
    gGame.shownCount++
    renderBoard()
}


function firstClick(firstPos) {
    gTimeInterval = setInterval(renderTime, 10)
    gBoard = createBoard()
    var cell = gBoard[firstPos.i][firstPos.j]
    setMines(firstPos)
    countMinesNegs()
    setMinesNegsCount()
    // renderBoard()
}

function mark(i, j) {
    var cell = gBoard[i][j]
    if (cell.isShown) return
    if (cell.isMarked) {
        cell.isMarked = false
        gGame.markedCount--
    } else {
        cell.isMarked = true
        gGame.markedCount++
        
    }
    renderBoard()
}

function renderTime() {
    var currTime = Date.now()
    var elLogScreen = document.querySelector('.display .value')
    var timePassed = currTime - gTime
    var timePassedSecs = (timePassed / 1000).toFixed(2)
    elLogScreen.innerText = ` ${timePassedSecs}`
}

function setDifficulty(elBtn) {
    if (!gGame.isOn || gGame.shownCount > 0) return
    toggleDiffBtnsColor(elBtn)
    var btnClassName = elBtn.className
    if (btnClassName === 'easy-btn') {
        gLevel.SIZE = 4;
        gLevel.MINES = 2
    } else if (btnClassName === 'medium-btn') {
        gLevel.SIZE = 8;
        gLevel.MINES = 12
    } else if (btnClassName === 'hard-btn') {
        gLevel.SIZE = 12;
        gLevel.MINES = 30
    }
    gGame.shownCount = 0
    gGame.markedCount = 0
    gCorrectMarks = 0
    gBoard = createBoard()
    setMinesNegsCount()
    renderBoard()
}

