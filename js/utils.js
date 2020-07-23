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


function setMinesFirst(firstPos) {
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


function getAllCellsCoords() {
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


// sorry about that
function expandShown(negsCoords, visited) {
    var nextNegsCoords = []
    for (var i = 0; i < negsCoords.length; i++) {
        var cellCoord = negsCoords[i]
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


function showAllMineCells() {
    for (var i = 0; i < gLevel.SIZE; i++) {
        for (var j = 0; j < gLevel.SIZE; j++) {
            var currCell = gBoard[i][j]
            if (currCell.isMine) currCell.isShown = true
        }
    }
}


function copyBoard() {
    var newBoard = [];
    for (var i = 0; i < gLevel.SIZE; i++) {
        newBoard[i] = [];
        for (var j = 0; j < gLevel.SIZE; j++) {
            var newCell = copyObj(gBoard[i][j]);
            newBoard[i].push(newCell)
        }
    }
    return newBoard;
}


function copyObj(obj) {
    var copyObj = JSON.parse(JSON.stringify(obj))
    return copyObj
}

function reAssignObjValues(mainObj, tempObj) {
    for (var key in mainObj) {
        mainObj[key] = tempObj[key]
    }  
}