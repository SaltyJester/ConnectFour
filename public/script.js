let ws = new WebSocket('ws://localhost:8080')

/*
TODO:
- Work on websocket connection with server
*/

/*
Board Logic, follows [row][col] format
0 is empty, 1 is red, 2 is yellow
"drop[x]" is the next available spot in x column on the board
*/
let board;
let curPlayer;
let gameState;
let moves = [];

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

/**
 * Websocket Code
 */

let profile; // holds info about the player

// Need to register with the server for player identifcation
ws.onopen = () => {
    firstContact();
}

// All ws responses from the server will start here
ws.onmessage = function(message){
    console.log(JSON.parse(message.data)); // for testing, delete later
    message = JSON.parse(message.data);

    if(message.memo == 'describeRole'){
        roleDescribed(message);
    }
    else if(message.memo == 'describeState'){
        stateDescribed(message);
    }
}

function firstContact(){
    let message = {
        memo: "firstContact"
    }
    ws.send(JSON.stringify(message));
}

function roleDescribed(message){
    profile = message;
}

function stateDescribed(message){
    board = message.board;
    curPlayer = message.curPlayer;
    draw();
}

function sendPing(){
    let message = {
        memo: "ping"
    }
    ws.send(JSON.stringify(message));
}