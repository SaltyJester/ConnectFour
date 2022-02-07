const {ConnectFour} = require('../src/utils/game');
const {
    horizontalCases, 
    verticalCases, 
    diagonalCases,
    tieCases
} = require('./fixtures/board_states');

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

test('detect a tie', () => {
    game.board = [
        [2,1,2,1,2,1,0],
        [2,1,2,1,2,1,1],
        [2,1,2,1,2,1,2],
        [1,2,1,2,1,2,1],
        [1,2,1,2,1,2,2],
        [1,2,1,2,1,2,1]
    ];
    game.curPlayer = 2;
    expect(game.makeMove(6,2)).toEqual(-3);
});

test('checkAcross() works as expected', () => {
    horizontalCases.forEach(example => {
        game.board = example.board;
        expect(game.checkAcross()).toEqual(example.expected);
    });
});

test('checkDown() works as expected', () => {
    verticalCases.forEach(example => {
        game.board = example.board;
        expect(game.checkDown()).toEqual(example.expected);
    });
});

test('checkDiagonal() works as expected', () => {
    diagonalCases.forEach(example => {
        game.board = example.board;
        expect(game.checkDiagonal()).toEqual(example.expected);
    });
});

test('checkTie() works as expected', () => {
    tieCases.forEach(example => {
        game.board = example.board;
        expect(game.checkTie()).toEqual(example.expected);
    });
});