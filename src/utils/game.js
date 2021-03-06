/*
TODO:
- Game states should be converted to strings, will make code easier to understand
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
        this.turnCount = 0;
        this.curPlayer = 1; // need to determine who goes first later one
        this.gameState = 0; // 0 game in progress, 1 player one wins, 2 player two wins, 3 tie

        for(let row = 0; row < 6; row++){
            this.board.push(new Array(7).fill(0));
        }
        for(let col = 0; col < 7; col++){
            this.drop.push(0);
        }
    }

    /*
    Each return should provide a status code
    */
    makeMove(col, curPlayer){
        let capacity = 5; // each column can only take 6 pieces
        if(this.gameState !== 0){
            return 'Game has already ended'; // game has already ended
        }
        if(curPlayer !== this.curPlayer){
            return 'Incorrect player'; // incorrect player
        }
        if(this.drop[col] > capacity){
            return 'Bad move'; // bad move
        }

        this.board[5 - this.drop[col]][col] = curPlayer;
        this.drop[col]++;
        this.turnCount++;
        this.curPlayer = 3 - curPlayer;

        this.gameState = this.determineGameState();

        return 0;
    }

    determineGameState(){
        let across = this.checkAcross();
        let down = this.checkDown();
        let diagonal = this.checkDiagonal();
        let tie = this.checkTie();
    
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
            return tie;
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
        if(this.turnCount >= 42){
            return 3;
        }
        else{
            return 0; // game is still ongoing
        }
    }
    
    /*
    Checks to see if n elements in a line contain the same value
    sr and sc are starting row and starting column respectively
    dr and dc are direction row and direction column respectively
    Returns 0 if line not found, otherwise returns player value
    */
    checkLine(sr, sc, dr, dc, len){
        let val = this.board[sr][sc];
        for(let i = 1; i < len; i++){
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