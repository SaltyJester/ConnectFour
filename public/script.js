/*
Board Logic, follows [row][col] format
0 is empty, 1 is red, 2 is yellow
*/
let board = [];
for(let i = 0; i < 6; i++){
    board.push(new Array(7).fill(0));
}

board[2][2] = 1; // test
board[2][5] = 2; // test

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
    console.log('Hello!');
}