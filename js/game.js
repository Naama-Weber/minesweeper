'use strict'

const MINE = '💣';
const FLAG = '🚩';

var gLevel = {
    SIZE: 4,
    MINES: 2
}

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    lives: 3
    // secsPassed: 0
}

var gBoard;
function initGame() {
    gBoard = buildBoard();
    renderBoard(gBoard);
    gGame.isOn = true;
    gGame.markedCount = 0;
    //     console.log('gBoard ', gBoard)
    // var randMineCell1 = putRandMine();
    // console.log('randMineCell1 ', randMineCell1)
    // setSmiley();
}

function changeLevel(level) {
    gLevel.SIZE = level;
    if (level === 4) gLevel.MINES = 2;
    if (level === 8) gLevel.MINES = 16;
    if (level === 12) gLevel.MINES = 36;
    initGame(level)
}

function buildBoard() {
    var board = createMat(gLevel.SIZE, gLevel.SIZE);
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            board[i][j] = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false
            };
        }
    }
    for (var k = 0; k < gLevel.MINES; k++) {
        putRandMine(board)
    }
    console.table(board);
    return board;
}


function renderBoard(board) {
    var strHTML = '';
    for (var i = 0; i < board.length; i++) {
        strHTML += `<tr>\n`;
        for (var j = 0; j < board[0].length; j++) {
            // var randMineCell1 = putRandMine();
            // console.log('randMineCell1 ', randMineCell1)
            var negsCount = setMinesNegsCount(gBoard, i, j);
            var strIdx = `cell-${i}-${j}`;
            var coord = getCellCoord(strIdx)
            if (board[coord.i][coord.j].isMine) {
                strHTML += `\t<td id = "${strIdx}" onclick = "cellClicked(this, ${i}, ${j})"><span id = "span-${strIdx}"  class = "hiddenSymbol">${MINE}</span>\n`;
            } else {
                strHTML += `\t<td id = "${strIdx}" onclick = "cellClicked(this, ${i}, ${j})"><span id = "span-${strIdx}" class = "hiddenSymbol">${negsCount}</span>\n`;
            }
            strHTML += `\t</td>\n`;
        }
    }
    strHTML += '</tr>\n';
    var elBoard = document.querySelector('.board');
    elBoard.innerHTML = strHTML;
    setSmiley();
}





// counts mines around cells and sets the cell's minesAroundCount
function setMinesNegsCount(board, rowIdx, colIdx) {
    var minesAroundCount = 0;
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i > board.length - 1) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j > board[0].length - 1) continue
            if (i === rowIdx && j === colIdx) continue
            var cell = board[i][j].isMine;
            if (cell) minesAroundCount++
        }
    }
    return minesAroundCount
}

function cellClicked(elSpanCell, i, j) {
    gBoard[i][j].isShown = true;
    gBoard[i][j].isMarked = true;
    if (!gGame.IsOn) {
        gGame.IsOn = true
        setTimer();
    }
    var elSpanCell = document.getElementById(`span-cell-${i}-${j}`);
    elSpanCell.classList.remove('hiddenSymbol');

    console.log(gBoard[i][j].isMine)
    if (gBoard[i][j].isMine) {

        var gameOver = checkGameOver();
        console.log('gameOver ', gameOver)
        var smiley = document.querySelector('.smiley');
        smiley.innerText = '😭'
    }
}


function putRandMine(board) {
    var randomI = getRandomInt(0, board.length);
    var randomJ = getRandomInt(0, board[0].length);
    var randMineCell = board[randomI][randomJ];
    while (randMineCell.isMine) {
        randomI = getRandomInt(0, board.length);
        randomJ = getRandomInt(0, board[0].length);
        randMineCell = board[randomI][randomJ];
    }
    randMineCell.isMine = true;
}


function getClassName(location) {
    var cellClass = 'cell-' + location.i + '-' + location.j;
    return cellClass;
}


function getCellCoord(strCellId) {
    var coord = {};
    var parts = strCellId.split('-');
    // console.log('parts', parts)
    coord.i = +parts[1]
    coord.j = +parts[2];
    return coord;
}



// Called on right click to mark a cell (suspected to be a mine)
// Search the web (and implement) how to hide the context menu on right click 
function cellMarked(elCell) {
    
}



// Game ends when all mines are marked, and all the other cells are shown
function checkGameOver() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            if (gBoard[i][j].isMine && gBoard[i][j].isShown) {
                // console.log('game over')
                setSmiley()
                var elModal = document.querySelector('.modal')
                console.log(elModal)
                elModal.classList.remove('hiddenModal')
                // clearInterval(setTime);

                return true;
            }
        }
    } return false;
}


// when user clicks a cell with no mines around - opens not only that cell,
// but also its neighbors
function expandShown(board, elCell, i, j) {

}

function setSmiley() {
    var smiley = document.querySelector('.smiley');
    smiley.innerText = '😀';
    // if () {
    //     gGame.isOn = false;
    //     smiley.innerText = '😭'
    // }
}

