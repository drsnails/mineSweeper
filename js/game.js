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




function init() {
    clearInterval(gTimeInterval)
    initHints()
    gIsFirst = true
    gRecentBoards = []
    gRecenGameStats = []
    var elTime = document.querySelector('.display .value')
    var elRestart = document.querySelector('.restart-container p .restart')
    elRestart.innerText = NORMAL
    elTime.innerText = '0.00'
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
            if (cell.isMarked) {cellClass += ' mark'}
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


function cellClicked(ev, i, j) {
    var cell = gBoard[i][j]
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



function mark(i, j) {
    if (!gGame.isOn) return
    var cell = gBoard[i][j]

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


function initHints() {
    if (gElHintClicked) {
        gElHintClicked.classList.remove('hint-mode')
    }
    var elHints = document.querySelectorAll('.hints span');
    for (var i = 0; i < elHints.length; i++) {
        var elHint = elHints[i]
        if (elHint.classList.contains('hint-mode')) {
            elHint.classList.remove('hint-mode')
        }
        elHint.style.display = 'inline'
        elHint.style.cursor = 'auto'
        elHint.style.opacity = 0.5
    }
}

function alowHintsFirstClick() {
    var elHints = document.querySelectorAll('.hints span');
    for (var i = 0; i < elHints.length; i++) {
        var elHint = elHints[i]
        elHint.style.cursor = 'pointer'
        elHint.style.opacity = 1

    }
}


function showHintCells(cellI, cellJ) {
    gElHintClicked.style.display = 'none'
    gElHintClicked = null
    var newShownCells = [];
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= gLevel.SIZE) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= gLevel.SIZE) continue;
            var currCell = gBoard[i][j];
            if (!currCell.isShown) {
                currCell.isShown = true;

                newShownCells.push(currCell);
            }
        }
    }
    renderBoard()
    setTimeout(hideHintCells, 1000, newShownCells)
}


function hideHintCells(shownCells) {
    for (var i = 0; i < shownCells.length; i++) {
        var currCell = shownCells[i];
        currCell.isShown = false
    }
    renderBoard()
}


function hintClickedHtml(elHint) {
    console.log(elHint);
    if (gGame.shownCount === 0) return
    var currHintName = elHint.className;
    if (gElHintClicked) {
        if (gElHintClicked.className === currHintName) {
            elHint.classList.remove('hint-mode');
            gElHintClicked = null
        } else {
            gElHintClicked.classList.remove('hint-mode')
            elHint.classList.add('hint-mode')
            gElHintClicked = elHint
        }

    } else {
        gElHintClicked = elHint
        elHint.classList.add('hint-mode')
    }
}


function undoMove() {
    if (gRecentBoards.length === 0 || !gGame.isOn) return
    var prevMove = gRecentBoards.pop()
    var prevStats = gRecenGameStats.pop()
    for (var i = 0; i < gLevel.SIZE; i++) {
        for (var j = 0; j < gLevel.SIZE; j++) {
            var prevCell = prevMove[i][j]
            var currCell = gBoard[i][j]
            reAssignObjValues(currCell, prevCell)
        }
    }

    reAssignObjValues(gGame, prevStats)
    console.log(gGame);
    renderBoard()
}

