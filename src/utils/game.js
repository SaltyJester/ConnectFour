/*
TODO:

*/

/*
Board Logic, follows [row][col] format
0 is empty, 1 is red, 2 is yellow
"drop[x]" is the next available spot in x column on the board
*/
class ConnectFour{
    constructor(){
        this.board = [];
        this.drop = [];
        this.curPlayer = 1; // need to determine who goes first later one
        this.gameState = 0;

        for(let i = 0; i < 6; i++){
            this.board.push(new Array(7).fill(0));
        }
        for(let i = 0; i < 7; i++){
            this.drop.push(0);
        }
    }

    /*
    Each return should provide a status code
    */
    makeMove(col, curPlayer){
        if(this.gameState !== 0){
            return -1 // game has already ended
        }
        if(curPlayer !== this.curPlayer){
            return -2; // incorrect player
        }
        if(this.drop[col] > 5){
            return -3; // bad move
        }

        this.board[5 - this.drop[col]][col] = curPlayer;
        this.drop[col]++;
        this.curPlayer = 3 - curPlayer;

        // DetermineGameState()


        return 0;
    }

    determineGameState(){
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
    
    checkAcross(){
        for(let row = 0; row < this.board.length; row++){
            for(let col = this.board[row].length - 4; col >= 0; col--){
                let result = this.checkLine(row, col, 0, 1, 4);
                if(result != 0){
                    return result;
                }
            }
        }
        return 0;
    }
    
    checkDown(){
        for(let col = 0; col < this.board[0].length; col++){
            for(let row = this.board.length - 4; row >= 0; row--){
                let result = this.checkLine(row, col, 1, 0, 4);
                if(result != 0){
                    return result;
                }
            }
        }
        return 0;
    }
    
    checkDiagonal(){
        // Down Right
        for(let row = 0; row < this.board.length - 3; row++){
            for(let col = 0; col < this.board[row].length - 3; col++){
                let result = this.checkLine(row, col, 1, 1, 4);
                if(result != 0){
                    return result;
                }
            }
        }
    
        // Down Left
        for(let row = 0; row < this.board.length - 3; row++){
            for(let col = this.board[row].length - 1; col >= this.board[row].length - 4; col--){
                let result = this.checkLine(row, col, 1, -1, 4);
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
    checkTie(){
        for(let row = 0; row < this.board.length; row++){
            for(let col = 0; col < this.board[row].length; col++){
                if(this.board[row][col] == 0){
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
    checkLine(sr, sc, dr, dc, len){
        let val = this.board[sr][sc];
        for(let i = 0; i < len; i++){
            if(this.board[sr + dr*i][sc + dc*i] != val){
                return 0;
            }
        }
        return val;
    }
}

module.exports = {
    ConnectFour
}