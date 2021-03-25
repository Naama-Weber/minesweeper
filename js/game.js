'use strict'

const MINE = '💣';
const FLAG = '🚩';
const GAME_ON = '😃'
const GAME_OVER = '😭'
const VICTORY = '😎'

var isFirstClick = true;
var fitstI = null;
var fitstJ = null;

var gLevel = {
    SIZE: 4,
    MINES: 2
}

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    negsCount: 0,
    lives: 2
    // secsPassed: 0
}
var gTimer;
var gBoard;

// starts the game
function initGame() {
    var elModal = document.querySelector('.modal');
    elModal.classList.add('hiddenModal');
    var elVicModal = document.querySelector('.victoryModal');
    elVicModal.classList.add('hiddenModal');
    gBoard = buildBoard();
    renderBoard(gBoard);
    gGame.isOn = false;
    gGame.markedCount = 0;
    gGame.lives = 2
    var elLives = document.querySelector('.livesSpan')
    elLives.innerText = gGame.lives
    resetTimer()

    if (fitstI !== null && fitstJ !== null){
        cellClicked(fitstI, fitstJ)
        fitstI = null;
        fitstJ = null;
        isFirstClick = true
    }
}

// changes the level 4/8/12
function changeLevel(level) {
    gLevel.SIZE = level;
    if (level === 4) gLevel.MINES = 2;
    if (level === 8) gLevel.MINES = 16;
    if (level === 12) gLevel.MINES = 36;
    initGame(level)
}

// builds mat
function buildBoard() {
    var board = createMat(gLevel.SIZE, gLevel.SIZE);
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            board[i][j] = {
                negsCount: 0,
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

// renders mat
function renderBoard(board) {
    var strHTML = '';
    for (var i = 0; i < board.length; i++) {
        strHTML += `<tr>\n`;
        for (var j = 0; j < board[0].length; j++) {
            gBoard[i][j].negsCount = setMinesNegsCount(gBoard, i, j);
            var strIdx = `cell-${i}-${j}`;
            var coord = getCellCoord(strIdx)
            if (board[coord.i][coord.j].isMine) {
                strHTML += `\t<td id = "${strIdx}" onclick = "cellClicked( ${i}, ${j})" oncontextmenu="cellRightClick(event, ${i}, ${j})" ><span id = "span-${strIdx}"  class = "hiddenSymbol">${MINE}</span>\n`;
            } else {
                strHTML += `\t<td id = "${strIdx}" onclick = "cellClicked( ${i}, ${j})" oncontextmenu="cellRightClick(event, ${i}, ${j})" ><span id = "span-${strIdx}" class = "hiddenSymbol">${gBoard[i][j].negsCount}</span>\n`;
            }
            strHTML += `\t</td>\n`;
        }
    }
    strHTML += '</tr>\n';
    var elBoard = document.querySelector('.board');
    elBoard.innerHTML = strHTML;
    setSmiley();
}

function cellRightClick(event, i, j) {
    event.preventDefault(); // stopps annoying popup when clicking right 
    if (gBoard[i][j].isShown) {
        return
    }
    if (gBoard[i][j].isMarked === false) {
        gBoard[i][j].isMarked = true;
        var elSpanCell = document.getElementById(`span-cell-${i}-${j}`);
        elSpanCell.innerText = FLAG;
        gGame.markedCount++
        elSpanCell.classList.remove('hiddenSymbol');
    } else {
        gBoard[i][j].isMarked = false;
        var elSpanCell = document.getElementById(`span-cell-${i}-${j}`);
        elSpanCell.classList.add('hiddenSymbol');
        if (gBoard[i][j].isMine) {
            elSpanCell.innerText = MINE;
        }
        else {
            elSpanCell.innerText = gBoard[i][j].negsCount;
            gGame.markedCount--
        }
    }
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
    } return minesAroundCount
}

function cellClicked( i, j) {
    if (gGame.lives === 0){
        return
    }
    if (isFirstClick && gBoard[i][j].isMine) {
        isFirstClick = false
        fitstI = i;
        fitstJ = j;
        initGame()
        return
    }
    isFirstClick = false

    if (gBoard[i][j].isMarked) {
        return
    }

    if(!gBoard[i][j].isMine && !gBoard[i][j].isShown ){
        gGame.negsCount++
    }

    var elSpanCell = document.getElementById(`span-cell-${i}-${j}`);
    elSpanCell.classList.remove('hiddenSymbol');
    if (gBoard[i][j].isMine) {
        gGame.lives--
        console.log('gGame.lives ', gGame.lives)
        var elLives = document.querySelector('.livesSpan');
        elLives.innerText = gGame.lives;
    }
    var totalNegsCount = (gLevel.SIZE ** 2) - gLevel.MINES;
    console.log('negsCount ', totalNegsCount)
    if (totalNegsCount === gGame.negsCount){
        isVictory();
    }
    gBoard[i][j].isShown = true;
    if (!gGame.isOn) {
        gGame.isOn = true
        setTimer()
    }
    
    if (gGame.lives === 0) {
        checkGameOver();
    }
}


function putRandMine(board) {
    var randomI = getRandomInt(0, board.length);
    var randomJ = getRandomInt(0, board[0].length);
    var randMineCell = board[randomI][randomJ];
    while (randMineCell.isMine && randomI !== fitstI && randomJ !== fitstJ) {
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



// Game ends when all mines are marked, and all the other cells are shown
function checkGameOver() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            if (gBoard[i][j].isMine && gBoard[i][j].isShown) {
                var elModal = document.querySelector('.modal')
                elModal.classList.remove('hiddenModal')
                stopTimer();
                var smiley = document.querySelector('.smiley');
                smiley.innerText = GAME_OVER;
                return true;
            }
        }
    } return false;
}

function isVictory() {
    var elVicModal = document.querySelector('.victoryModal')
    elVicModal.classList.remove('hiddenModal')
    stopTimer();
    var smiley = document.querySelector('.smiley');
    smiley.innerText = VICTORY;
}



// when user clicks a cell with no mines around - opens not only that cell,
// but also its neighbors
function expandShown(board, elCell, i, j) {

}

function setSmiley() {
    var smiley = document.querySelector('.smiley');
    smiley.innerText = GAME_ON;
}

