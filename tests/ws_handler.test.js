const WebSocket = require('ws');
const app = require('../src/app');

let ws = new WebSocket('ws://localhost:8080');

test('board is initalized correctly', () => {
    let x = 0;
    expect(x).toEqual(0);
    
});