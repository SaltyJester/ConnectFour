/*
TODO:
- Make a fixture for dropping pieces based on prebuilt board array
    a. maybe something called movesets.js
*/

const {ConnectFour} = require('../src/utils/game');
const {boardStates} = require('./fixtures/board_states');
const {movesets} = require('./fixtures/movesets');

let game;

beforeEach(() => {
    game = new ConnectFour();
});

test('board is initalized correctly', () => {
    let exampleBoard = [];
    for(let i = 0; i < 6; i++){
        exampleBoard.push(new Array(7).fill(0));
    }
    expect(game.board).toEqual(exampleBoard);
});

test('players go in the correct order', () => {
    expect(game.makeMove(0, 1)).toEqual(0);;
    expect(game.makeMove(0, 1)).toEqual(-2);;
    expect(game.makeMove(0, 2)).toEqual(0);;
    expect(game.makeMove(0, 2)).toEqual(-2);;
});

test('unable to add another piece to an already full column', () =>{
    game.makeMove(3, 1);
    game.makeMove(3, 2);
    game.makeMove(3, 1);
    game.makeMove(3, 2);
    game.makeMove(3, 1);
    expect(game.makeMove(3, 2)).toEqual(0);
    expect(game.makeMove(3, 1)).toEqual(-3);

});

test('detect a horizontal win', () => {
    movesets.horizontalWin.moves.forEach((move) => {
        game.makeMove(move[0], move[1]); //move[0] is column, move[1] is player
    });
    expect(game.gameState).toEqual(movesets.horizontalWin.winner);
});

test('detect a vertical win', () => {
    movesets.verticalWin.moves.forEach((move) => {
        game.makeMove(move[0], move[1]); //move[0] is column, move[1] is player
    });
    expect(game.gameState).toEqual(movesets.verticalWin.winner);
});

test('detect a diagonal win', () => {
    movesets.diagonalWin.moves.forEach((move) => {
        game.makeMove(move[0], move[1]);
    });
    expect(game.gameState).toEqual(movesets.diagonalWin.winner);
});

test('detect a tie', () => {
    movesets.tie.moves.forEach((move) => {
        game.makeMove(move[0], move[1]);
    });
    expect(game.gameState).toEqual(movesets.tie.winner);
});

test('checkAcross() works as expected', () => {
    boardStates.horizontalCases.forEach(example => {
        game.board = example.board;
        expect(game.checkAcross()).toEqual(example.expected);
    });
});

test('checkDown() works as expected', () => {
    boardStates.verticalCases.forEach(example => {
        game.board = example.board;
        expect(game.checkDown()).toEqual(example.expected);
    });
});

test('checkDiagonal() works as expected', () => {
    boardStates.diagonalCases.forEach(example => {
        game.board = example.board;
        expect(game.checkDiagonal()).toEqual(example.expected);
    });
});

test('checkTie() works as expected', () => {
    movesets.tie.moves.forEach((move) => {
        game.makeMove(move[0], move[1]);
    });
    expect(game.turnCount).toEqual(42); // only 42 turns possible
    expect(game.checkTie()).toEqual(3); // 3 represents a tie, 0 means no tie detected
});