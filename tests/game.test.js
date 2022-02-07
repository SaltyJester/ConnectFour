const {ConnectFour} = require('../src/utils/game');
const {horizontalCases} = require('./fixtures/board_states');

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

test('checkAcross() works as expected', () => {
    horizontalCases.forEach(example => {
        game.board = example.board;
        expect(game.checkAcross()).toEqual(example.expected);
    });
});