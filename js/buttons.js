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
        elHint.style.opacity = 0.4
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
    if (gIsFirst) return
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

function startManual(elManualBtn) {
    if (!gIsFirst) return
    var elGameContainer = document.querySelector('.game-container')
    var elOpenManual = document.querySelector('.open-manual')
    
    if (gIsManual) {
        elOpenManual.style.display = 'none'
        elManualBtn.style.display = 'none'
        gIsManual = false
        elGameContainer.classList.toggle('manual-mode')
        hideAllCells()
        renderBoard()
        return initManualGame()

    } else {
        elOpenManual.style.display = 'block'
        elManualBtn.innerText = 'Start the game'
        gIsManual = true
        elGameContainer.classList.toggle('manual-mode')
        
    }

}
