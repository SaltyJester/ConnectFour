// dev functions

// board logic
let board = new Array(6).fill(new Array(7).fill(0)); // row, col
console.log(board);

// front end graphics
let canvas = document.getElementById('canvas');

function draw(){
    if(canvas.getContext){
        ctx = canvas.getContext('2d');
        ctx.canvas.width = 700;
        ctx.canvas.height = 600;

        // ctx.beginPath();
        // ctx.arc(250, 50, 35, 0, 2*Math.PI);
        // ctx.stroke();

        for(let row = 0; row < board.length; row++){
            for(let col = 0; col < board[row].length; col++){
                ctx.beginPath();

                // remember, row = y and col = x
                let x = 50 + 100*col;
                let y = 50 + 100*row;

                console.log(x, y);
                ctx.arc(x, y, 35, 0, 2*Math.PI);
                ctx.stroke();
            }
        }
    }
}