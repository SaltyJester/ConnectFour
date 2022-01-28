/*
Board Logic, follows [row][col] format
0 is empty, 1 is red, 2 is yellow
"drop[x]" is the next available spot in x column on the board
*/
let board = [];
let drop = [];
let curPlayer = 1;
for(let i = 0; i < 6; i++){
    board.push(new Array(7).fill(0));
}
for(let i = 0; i < 7; i++){
    drop.push(0);
}

/*
Canvas Logic
Remember, row = y, col = x
*/
let canvas = document.getElementById('canvas');
canvas.addEventListener('click', clickHandler);

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
    let rect = event.target.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top; // we don't really need this info
    let col = Math.floor(x/100);

    if(drop[col] < 6){
        board[5 - drop[col]][col] = curPlayer;
        drop[col]++;
        curPlayer = 3 - curPlayer;

        // for testing, delete later
        console.log(board);
        console.log(drop);
        console.log('col: ' + col);
    }

    draw();
}