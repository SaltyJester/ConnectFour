/*
TODO:
- Work on game logic (determine winners)
*/

/*
Board Logic, follows [row][col] format
0 is empty, 1 is red, 2 is yellow
"drop[x]" is the next available spot in x column on the board
*/
let board = [];
let drop = [];
let curPlayer = 1;
let moves = [];
for(let i = 0; i < 6; i++){
    board.push(new Array(7).fill(0));
}
for(let i = 0; i < 7; i++){
    drop.push(0);
}

//for testing, delete later
board = [
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0]];

function determineGameState(){
    let across = checkAcross();
    let down = checkDown();
    let diagonal = checkDiagonal();
    let tie = checkTie();

    if(across != 0){
        return across;
    }
    else if(down != 0){
        return down;
    }
    else if(diagonal != 0){
        return diagonal;
    }
    else if(tie != 0){
        return -1
    }

    return 0;
}

function checkAcross(){
    for(let row = 0; row < board.length; row++){
        for(let col = board[row].length - 4; col >= 0; col--){
            let result = checkLine(row, col, 0, 1, 4);
            if(result != 0){
                return result;
            }
        }
    }
    return 0;
}

function checkDown(){
    for(let col = 0; col < board[0].length; col++){
        for(let row = board.length - 4; row >= 0; row--){
            let result = checkLine(row, col, 1, 0, 4);
            if(result != 0){
                return result;
            }
        }
    }
    return 0;
}

function checkDiagonal(){
    // Down Right
    for(let row = 0; row < board.length - 3; row++){
        for(let col = 0; col < board[row].length - 3; col++){
            let result = checkLine(row, col, 1, 1, 4);
            if(result != 0){
                return result;
            }
        }
    }

    // Down Left
    for(let row = 0; row < board.length - 3; row++){
        for(let col = board[row].length - 1; col >= board[row].length - 4; col--){
            let result = checkLine(row, col, 1, -1, 4);
            if(result != 0){
                return result;
            }
        }
    }
    return 0;
}

/*
Doesn't check for any winners, just checks to see if board is filled
*/
function checkTie(){
    for(let row = 0; row < board.length; row++){
        for(let col = 0; col < board[row].length; col++){
            if(board[row][col] == 0){
                return false;
            }
        }
    }
    return true;
}

/*
Checks to see if n elements in a line contain the same value
sr and sc are starting row and starting column respectively
dr and dc are direction row and direction column respectively
Returns 0 if line not found, otherwise returns player value
*/
function checkLine(sr, sc, dr, dc, len){
    let val = board[sr][sc];
    for(let i = 0; i < len; i++){
        if(board[sr + dr*i][sc + dc*i] != val){
            return 0;
        }
    }
    return val;
}

/*
Canvas Logic
Remember, row = y, col = x
*/
let canvas = document.getElementById('canvas');
canvas.addEventListener('click', clickHandler);
canvas.addEventListener('mousemove', mousemoveHandler);
canvas.addEventListener('mouseout', mouseoutHandler);

function draw(){
    if(canvas.getContext){
        ctx = canvas.getContext('2d');
        ctx.canvas.width = 700;
        ctx.canvas.height = 600;

        for(let row = 0; row < board.length; row++){
            for(let col = 0; col < board[row].length; col++){
                if(board[row][col] == 0){
                    ctx.fillStyle = '#EEEEEE';
                }
                else if(board[row][col] == 1){
                    ctx.fillStyle = '#D10000';
                }
                else if(board[row][col] == 2){
                    ctx.fillStyle = '#FFDA00';
                }
                ctx.beginPath();

                let x = 50 + 100*col;
                let y = 50 + 100*row;

                ctx.arc(x, y, 35, 0, 2*Math.PI);
                ctx.fill();
            }
        }
    }
}

function clickHandler(event){
    let col = getMousePosition(event);

    if(drop[col] < 6){
        moves.push([col, curPlayer]);
        board[5 - drop[col]][col] = curPlayer;
        drop[col]++;
        curPlayer = 3 - curPlayer;

        // for testing, delete later
        console.log(board);
        console.log(drop);
        console.log('col: ' + col);
        console.log('moves:');
        let moveString = '';
        moves.forEach((move) => {
            moveString+= '['+move[0]+', '+move[1]+'], ';
        });
        console.log(moveString);
        console.log('Gamestate: ' + determineGameState());
    }
    draw();
    highlight(col);
}

/*
This handler will highlight the empty spaces in a column when a mouse hovers over it.
Purpose is to aid in column selection.
*/
function mousemoveHandler(event){
    draw(); // need to redraw the board or we'll get multiple highlighting
    let col = getMousePosition(event);
    highlight(col);
}

/*
Gets rid of column highlight when mouse goes outside of canvas
*/
function mouseoutHandler(event){
    draw();
}

function getMousePosition(event){
    let rect = event.target.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top; // we don't really need this info
    let col = Math.floor(x/100);
    return col;
}

/*
Made this a helper function so I can also use it in clickHandler()
Otherwise the highlighted column will disappear until mouse moved again
*/
function highlight(col){
    ctx.fillStyle = 'rgba(191, 64, 191, 0.5)';
    ctx.beginPath();
    ctx.rect(0 + (100 * col), 0, 100, 600);
    ctx.fill();
}