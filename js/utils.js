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
    gGame.shownCount = 0
    gGame.markedCount = 0
    gBoard = createBoard()
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
    // renderBoard()
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


function expandShown(negsCoords, visited) {
    console.log(negsCoords);
    var nextNegsCoords = []
    for (var i = 0; i < negsCoords.length; i++) {
        var cellCoord = negsCoords[i]
        // var currCell = gBoard[cellCoord.i][cellCoord.j]
        var currNegsPos = getNegiboars(cellCoord.i, cellCoord.j)
        for (var j = 0; j < currNegsPos.length; j++) {
            var currNegPos = currNegsPos[j];
            var negCell = gBoard[currNegPos.i][currNegPos.j]
            if (negCell.minesAroundCount >= 0) {
                negCell.isShown = true
                if (!isVisited(currNegPos, visited) && negCell.minesAroundCount === 0) {
                    visited.push(currNegPos)
                    nextNegsCoords.push(currNegPos)
                }
            }

        }
    }
    if (nextNegsCoords.length === 0) {
        return
    }
    return expandShown(nextNegsCoords, visited);
}

function visitedCells() {

}

function getNegiboars(cellI, cellJ) {
    var negsCoords = []
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= gLevel.SIZE) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            // if (i === cellI && j === cellJ) continue;
            if (j < 0 || j >= gLevel.SIZE) continue;
            negsCoords.push({ i, j })
        }
    }
    return negsCoords
}


function isVisited(location, visitedList) {
    for (var idx = 0; idx < visitedList.length; idx++) {
        var pos = visitedList[idx]
        if (pos.i === location.i && pos.j === location.j) {
            return true
        }
    }
    return false
}


/////////////////////////////////////////////


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
