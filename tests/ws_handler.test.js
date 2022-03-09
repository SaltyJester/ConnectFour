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
let client_1;
let client_2;
let client_3;

beforeEach(() => {
    sessionData = {
        game: new ConnectFour(),
        nextClientID: 0,
        clients: {},
        bothPartiesPresent: false
    }

    client_1 = new MockWebSocket();
    client_2 = new MockWebSocket();
    client_3 = new MockWebSocket();
});

test('firstContact() describes role correctly', () => {
    // client_1
    wsHandler.firstContact(client_1, sessionData);
    let describeRole_1 = client_1.log[0];
    let describeState_1 = client_1.log[1];
    // first message received should have a memo of 'describeRole'
    expect(describeRole_1.memo).toEqual('describeRole');
    // client ID for first person should be 0
    expect(describeRole_1.profile.id).toEqual(0);
    // role for first person should be 1 or 2
    expect(describeRole_1.profile.role).toBeWithinRange(1,2);
    // client should have received a 'describeState' memo right after 'describeBoard'
    expect(describeState_1.memo).toEqual('describeState');
    // describeState should show bothPartiesPresent as false
    expect(describeState_1.bothPartiesPresent).toBeFalsy();

    // client_2
    wsHandler.firstContact(client_2, sessionData);
    let describeRole_2 = (client_2.log[0]);
    let describeState_2 = (client_2.log[1]);
    // client ID for second person should be 1
    expect(describeRole_2.profile.id).toEqual(1);
    // role for second client should be 1 or 2, but should be different from client_1
    expect(describeRole_2.profile.role).toBeWithinRange(1,2);
    expect(describeRole_2.profile.role != describeRole_1.profile.role).toBeTruthy();
    // describeState should show bothPartiesPresent as true
    expect(describeState_2.bothPartiesPresent).toBeTruthy();
    
    // client_1 should have gotten a second describeState message
    describeState_1a = client_1.log[2];
    expect(describeState_1a.memo).toEqual('describeState');

    // client_3
    wsHandler.firstContact(client_3, sessionData);
    let describeRole_3 = client_3.log[0];
    // client_3 should have gotten role of spectator, '-1'
    expect(describeRole_3.profile.role).toEqual(-1);
});

expect.extend({
    toBeWithinRange(num, min, max){
        if(num >= min && num <= max){
            return {
                describeRole_1:() => 
                    `expected ${num} not to be within range ${min} - ${max}`,
                pass: true
            };
        }
        else{
            return {
                describeRole_1:() => 
                    `expected ${num} to be within range ${min} - ${max}`,
                pass: false
            };
        }
    }
});