let ws = new WebSocket(window.location.href.replace("http://", "ws://"));
let url = window.location.href;

/*
TODO:
- Work on websocket connection with server
*/

/*
Board Logic, follows [row][col] format
0 is empty, 1 is red, 2 is yellow
"drop[x]" is the next available spot in x column on the board
*/
let sessionID = parseInt(url.substring(url.lastIndexOf('/') + 1));
let clientID;
let role;
let board;
let curPlayer;
let gameState; // not used at the moment
let bothPartiesPresent;
let token;
let moves = []; // for testing purposes

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
    makeMove(col);
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
    else if(message.memo == 'badRequest'){
        didBadRequest(message);
    }
}

function firstContact(){
    let message = {
        memo: 'firstContact',
        sessionID
    }
    ws.send(JSON.stringify(message));
}
function makeMove(col){
    let message = {
        memo: 'makeMove',
        data: {
            col,
            token
        }
    }
    ws.send(JSON.stringify(message));
}

function roleDescribed(message){
    clientID = message.profile.id;
    role = message.profile.role;
    token = message.token;
}

function stateDescribed(message){
    board = message.board;
    curPlayer = message.curPlayer;
    gameState = message.gameState;
    bothPartiesPresent = message.bothPartiesPresent;

    let turnIndicator = document.getElementById('turn_indicator');
    if(role == 1 || role == 2){ // for the actual two players
        if(!bothPartiesPresent){
            turnIndicator.innerText = 'Waiting for the other player';
        }
        else if(gameState == 0){
            if(curPlayer == role)
                turnIndicator.innerText = 'Your turn';
            else
                turnIndicator.innerText = 'Other player\'s turn'
        }
        else if(gameState == 1 || gameState == 2){
            if(role == gameState)
                turnIndicator.innerText = 'You won';
            else
                turnIndicator.innerText = 'You lost'
        }
        else if(gameState == 3){
            turnIndicator.innerText = 'It\'s a tie'
        }
    }
    else if(role == -1){ // for the spectators
        turnIndicator.innerText = "Spectating"
    }

    draw();
}

function didBadRequest(message){
    console.log('Do something with error message')
}

function sendPing(){
    let message = {
        memo: "ping"
    }
    ws.send(JSON.stringify(message));
}