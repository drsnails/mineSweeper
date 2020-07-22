'use strict'

function setMinesNegsCount() {
    for (var i = 0; i < gLevel.SIZE; i++) {
        for (var j = 0; j < gLevel.SIZE; j++) {
            var currCell = gBoard[i][j]
            var currCellNegsCnt = countMinesNegs(i, j)
            currCell.minesAroundCount = currCellNegsCnt
        }
    }
}

function countMinesNegs(cellI, cellJ) {
    var minesSum = 0
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= gLevel.SIZE) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue;
            if (j < 0 || j >= gLevel.SIZE) continue;
            if (gBoard[i][j].isMine) minesSum++;
        }
    }
    return minesSum;
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
    gBoard = createBoard()
    gBoard[1][1].isMine = true
    gBoard[2][3].isMine = true
    setMinesNegsCount()
    renderBoard()
}

function toggleDiffBtnsColor(elBtn) {
    var elDiffBtns = document.querySelectorAll('.diff-btns button');
    for (var i = 0; i < elDiffBtns.length; i++) {
        if (elDiffBtns[i].className === elBtn.className) {
            elDiffBtns[i].style.backgroundColor = 'rgb(155, 200, 243)';

        } else {
            elDiffBtns[i].style.backgroundColor = 'rgb(253, 246, 209)';
        }
    }
}

function resetDiffBtnsColor() {
    var elDiffBtns = document.querySelectorAll('.diff-btns button');
    for (var i = 0; i < elDiffBtns.length; i++) {
        elDiffBtns[i].style.backgroundColor = 'rgb(253, 246, 209)'
    }
}


function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}


function firstClick(firstPos) {
    gBoard = createBoard()
    var cell = gBoard[firstPos.i][firstPos.j]
    setMines(firstPos)
    countMinesNegs()
    setMinesNegsCount()
    
}


function setMines(firstPos) {
    var minesCoords = getMinesCoords(firstPos)
    for (var i = 0; i < minesCoords.length; i++) {
        var mineCoord = minesCoords[i]
        gBoard[mineCoord.i][mineCoord.j].isMine = true
    }
}

function getMinesCoords(firstCellPos) {
    var allCoords = getAllCellsCoords()
    var minesCoords = []
    for (var i = 0; i < gLevel.MINES; i++) {
        var randIdx = getRandomInt(0, allCoords.length)
        var randPos = allCoords[randIdx]
        while (distance(randPos, firstCellPos) <= 1.5) {
            randIdx = getRandomInt(0, allCoords.length)
            randPos = allCoords[randIdx]
        }
        randPos = allCoords.splice(randIdx, 1)[0]

        minesCoords.push(randPos)
    }

    return minesCoords
}




function getAllCellsCoords(emptyArg) {
    var cellsCoords = []
    for (var i = 0; i < gLevel.SIZE; i++) {
        for (var j = 0; j < gLevel.SIZE; j++) {
            cellsCoords.push({ i, j })
        }
    }
    return cellsCoords
}


function distance(pos1, pos2) {
    var dist = Math.sqrt((pos1.i - pos2.i) ** 2 + (pos1.j - pos2.j) ** 2)
    return dist
}





function drawRandCell(cells) {
    var cellsLength = cells.length
    for (var i = 0; i < cellsLength; i++) {
        var randIdx = getRandomIntInclusive(0, cells.length - 1);
        var randCell = cells.splice(randIdx, 1)[0];
        return randCell
    }

}


/////////////////////////////////////////////
function getIdx(location) {
    for (var idx = 0; idx < gGhosts.length; idx++) {
        var ghost = gGhosts[idx]
        if (ghost.location.i === location.i && ghost.location.j === location.j) {
            return idx
        }
    }
    return -1
}


function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}













function shuffle(nums) {
    var numsLength = nums.length
    var shuffledNums = [];
    for (var i = 0; i < numsLength; i++) {
        var randIdx = getRandomInt(0, nums.length);
        var randNum = nums.splice(randIdx, 1)[0];
        shuffledNums.push(randNum)
    }
    return shuffledNums
}
