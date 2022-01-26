// dev functions

// board logic, will follow [row][col] format
let board = [];
for(let i = 0; i < 6; i++){
    board.push(new Array(7).fill(0));
}
board[2][5] = 1; // test
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
                if(board[row][col] == 0){
                    ctx.fillStyle = '#EEEEEE';
                }
                else{
                    ctx.fillStyle = '#FFFF00';
                }
                ctx.beginPath();

                // remember, row = y and col = x
                let x = 50 + 100*col;
                let y = 50 + 100*row;

                ctx.arc(x, y, 35, 0, 2*Math.PI);
                ctx.fill();
            }
        }
    }
}