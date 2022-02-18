const WebSocket = require('ws');
const app = require('../src/app');
let ws;

beforeAll(() => {
    ws = new WebSocket('ws://localhost:8080');
});

test('board is initalized correctly', () => {
    let x = 0;
    expect(x).toEqual(0);
    
});

afterAll(() => {
    ws.close();
    app.killAll();
});

// app.close();
// wss.close();
// ws.close();