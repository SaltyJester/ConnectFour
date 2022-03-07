const {ConnectFour} = require('../src/utils/game');
const wsHandler = require('../src/utils/ws_handler')

class MockWebSocket{
    constructor(){
        this.log = [];
    }
    send(data){
        this.log.push(data);
    }
}

let sessionData;
let client;

beforeEach(() => {
    sessionData = {
        game: new ConnectFour(),
        nextClientID: 0,
        clients: {},
        bothPartiesPresent: false
    }

    client = new MockWebSocket();
});


test('firstContact', () => {    
    wsHandler.firstContact(client, sessionData);
    // console.log(client.log);
});