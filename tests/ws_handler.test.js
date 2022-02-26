class fakeWebSocket{
    constructor(){

    }
    send(){
    }
}

// const ws = require('ws');
// jest.mock('ws', () => {
//     return{
//         send: jest.fn(() => console.log('fuck'))
//     }
// });

beforeAll(() => {
    // ws.WebSocket.send = jest.fn(() => {
    //     console.log('iran')
    // }).mockName('killer');
});


test('test', () => {    
    let ws = new fakeWebSocket();
    ws.send();
    expect(client.send('hi')).toBe(undefined);
});