var gTimer;


function createMat(ROWS, COLS) {
    var mat = []
    for (var i = 0; i < ROWS; i++) {
        var row = []
        for (var j = 0; j < COLS; j++) {
            row.push('')
        }
        mat.push(row)
    }
    return mat
}



// counts mines around cells and sets the cell's minesAroundCount
function setMinesNegsCount(board, rowIdx, colIdx) {
    var minesAroundCount = 0;
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i > board.length - 1) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j > board[0].length - 1) continue
            if (i === rowIdx && j === colIdx) continue
            console.log(board[i][j].isMine)
            if (board[i][j].isMine) minesAroundCount++
        }
    }
    return minesAroundCount
}

// function checkZerosNegs(gBoard, cellI, cellJ) {
//     for (var i = cellI - 1; i <= cellI + 1; i++) {
//         if (i < 0 || i > gBoard.length - 1) continue
//         for (var j = cellJ - 1; j <= cellJ + 1; j++) {
//             if (j < 0 || j > gBoard[0].length - 1) continue
//             if (i === cellI && j === cellJ) continue
//             if (gBoard[i][j] === '0') {
//                 elTdCell.style.backgroundColor = 'brown';
//                 elSpanCell.classList.add('zero');
//                 elSpanCell.classList.add('hiddenSymbol');
//                 gBoard[i][j].isShown = false;
//             }
//         }
//     }
// }


function getCellCoord(strCellId) {
    var coord = {};
    var parts = strCellId.split('-');
    // console.log('parts', parts)
    coord.i = +parts[1]
    coord.j = +parts[2];
    return coord;
}


function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min) + min); // Min is inclusive, Max is Exclusive
}

function getRandomCell() {
    var randIdxI = getRandomInt(0, board.length);
    console.log('random cell I: ', randIdxI);
    var randIdxJ = getRandomInt(0, board.length);
    console.log('random cell J: ', randIdxJ);
    var randCell = [randIdxI, randIdxJ];
    console.log('random cell: ', randCell)
    return randCell;
}

// Timer
function setTimer() {
    var minutesLabel = document.getElementById("minutes");
    var secondsLabel = document.getElementById("seconds");
    var totalSeconds = 0;
    gTimer = setInterval(setTime, 1000);
    function setTime() {
        ++totalSeconds;
        secondsLabel.innerHTML = pad(totalSeconds % 60);
        minutesLabel.innerHTML = pad(parseInt(totalSeconds / 60));
    }

    function pad(val) {
        var valString = val + "";
        if (valString.length < 2) {
            return "0" + valString;
        } else {
            return valString;
        }
    }
}

function stopTimer() {
    clearInterval(gTimer);
}

function resetTimer() {
    clearInterval(gTimer);
    var minutesLabel = document.getElementById("minutes");
    var secondsLabel = document.getElementById("seconds");
    secondsLabel.innerHTML = "00";
    minutesLabel.innerHTML = "00";
}