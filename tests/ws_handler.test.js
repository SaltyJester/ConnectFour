const {ConnectFour} = require('../src/utils/game');
const wsHandler = require('../src/utils/ws_handler')
const jwt = require('jsonwebtoken');
const {SessionManager} = require('../src/utils/session_manager');

class MockWebSocket{
    constructor(){
        this.log = [];
    }
    send(data){
        this.log.push(JSON.parse(data));
    }
}

let sessionManager;
let game_1;
let game_2
let client_1;
let client_2;
let client_3;

beforeEach(() => {
    sessionManager = new SessionManager();
    game_1 = sessionManager.createGame();
    game_2 = sessionManager.createGame();

    client_1 = new MockWebSocket();
    client_2 = new MockWebSocket();
    client_3 = new MockWebSocket();
});

// TODO: i need to break this test down into multiple tests
test('firstContact() describes role correctly', () => {
    // client_1
    wsHandler.firstContact(game_1, client_1, sessionManager);
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
    wsHandler.firstContact(game_1, client_2, sessionManager);
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
    wsHandler.firstContact(game_1, client_3, sessionManager);
    let describeRole_3 = client_3.log[0];
    // client_3 should have gotten role of spectator, '-1'
    expect(describeRole_3.profile.role).toEqual(-1);
});

test('Players cannot make a move when both parties are not present', () => {
    wsHandler.firstContact(game_1, client_1, sessionManager);
    client_1_token = client_1.log[0].token;

    let moveData = {
        col: 1,
        token: client_1_token
    };
    wsHandler.moveMade(moveData, client_1, sessionManager);
    expect(client_1.log[2].memo).toEqual('badRequest');
    expect(client_1.log[2].error).toEqual('Both parties not present');
});

test('Players can make a move when both parties are present', () => {
    wsHandler.firstContact(game_1, client_1, sessionManager);
    wsHandler.firstContact(game_1, client_2, sessionManager);

    // client_1_token = client_1.log[0].token;
    // console.log(jwt.verify(client_1_token, process.env.TOKEN_SECRET));

    let moveData = {
        col: 1,
        token: undefined
    };

    if(client_1.log[0].profile.role == 1){
        moveData.token = client_1.log[0].token;
        wsHandler.moveMade(moveData, client_1, sessionManager);
        expect(client_1.log[client_1.log.length - 1].memo).toEqual('describeState');
    }
    else{
        moveData.token = client_2.log[0].token;
        wsHandler.moveMade(moveData, client_2, sessionManager);
        expect(client_2.log[client_2.log.length - 1].memo).toEqual('describeState');
    }
});

// test to make sure players make moves in correct order

// test to make sure players can't make moves when game has ended

test('Players with invalid JWT will get a badRequest memo', () => {
    wsHandler.firstContact(game_1, client_1, sessionManager);
    wsHandler.firstContact(game_1, client_2, sessionManager);
    let token = jwt.sign({
        id: 0,
        role: 1,
    }, 'fakeKey');
    
    let moveData = {
        memo: 'makeMove',
        data: {
            col: 1,
            token
        }
    };

    wsHandler.moveMade(moveData, client_1, sessionManager);
    expect(client_1.log[client_1.log.length - 1].memo).toEqual('badRequest');
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