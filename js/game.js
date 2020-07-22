'use strict'
const NORMAL = "&#128526"
const DEAD = "&#128565"
const MINE = "&#128163"
const HINT = "💡"

var gBoard;

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
    gGame.isOn = true
    gGame.shownCount = 0
    gLevel.SIZE = 4
    gBoard = createBoard()
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

            strHtml += `data-i="${i}" data-j="${j}" class="cell ${cellClass}" onclick="cellClicked(this, ${i}, ${j})">`
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
    resetDiffBtnsColor()
}


function cellClicked(elCell, i, j) {
    if (!gGame.isOn) return
    if (gGame.shownCount === 0) {
        firstClick({i, j})
    }
    var cell = gBoard[i][j]
    console.log(cell);
    if (cell.isMine) gameOver()
    cell.isShown = !cell.isShown
    gGame.shownCount++
    renderBoard()
}