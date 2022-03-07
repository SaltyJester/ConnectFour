const {ConnectFour} = require('../src/utils/game');
const wsHandler = require('../src/utils/ws_handler')

class MockWebSocket{
    constructor(){
        this.log = [];
    }
    send(data){
        this.log.push(JSON.parse(data));
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

test('firstContact() describes role correctly for first client', () => {
    wsHandler.firstContact(client, sessionData);
    let message = (client.log[0]);

    // first message received should have a memo of 'describeRole'
    expect(message.memo).toEqual('describeRole');
    // client ID for first person should be 0
    expect(message.profile.id).toEqual(0);
    // role for first person should be 1 or 2
    expect(message.profile.role).toBeWithinRange(1,2);
});

expect.extend({
    toBeWithinRange(num, min, max){
        if(num >= min && num <= max){
            return {
                message:() => 
                    `expected ${num} not to be within range ${min} - ${max}`,
                pass: true
            };
        }
        else{
            return {
                message:() => 
                    `expected ${num} to be within range ${min} - ${max}`,
                pass: false
            };
        }
    }
});