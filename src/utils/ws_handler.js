const jwt = require('jsonwebtoken');

/**
 * When clients intially connect to the server, they need to be assigned a player role
 * Player roles can be 1, 2, or -1 which correspond to Player 1, Player 2, Spectator respectively
 * First client to join is assigned 1 or 2 randomly,
 * next client to join will get the opposite role to the first client,
 * all clients thereafter are designated as spectators.
 */
function firstContact(sessionID ,client, sessionManager){
    let sessionData = sessionManager.sessions[sessionID];

    let profile = new Object;
    profile.id = sessionData.nextClientID++;
    if(Object.keys(sessionData.clients).length == 0){
        profile.role = Math.floor(Math.random() * 2) + 1; // random player assignment
    }
    else if(Object.keys(sessionData.clients).length == 1){
        profile.role = 3 - sessionData.clients[0].role; // assign remaining available player
        sessionData.bothPartiesPresent = true;
    }
    else{
        profile.role = -1; //spectator
    }

    // JWT prevents players from making moves on other players behalf
    let token = jwt.sign({ 
        id: profile.id, 
        role: profile.role,
        sessionID
    }, process.env.TOKEN_SECRET);

    sessionData.clients[profile.id] = {
        ws: client,
        role: profile.role,
    }

    client.send(JSON.stringify({
        memo: 'describeRole',
        profile,
        token
    }));
    describeState(sessionData);
}

/*
Need to notify users of bad requests
Users are authenticated via JWT
*/
function moveMade(moveData, client, sessionManager){
    try{
        let decoded = jwt.verify(moveData.token, process.env.TOKEN_SECRET);
        let sessionData = sessionManager.sessions[decoded.sessionID]
        if(sessionData.bothPartiesPresent){
            let status = sessionData.game.makeMove(moveData.col, decoded.role);
            if(status == 0)
                describeState(sessionData);
            else
                gotBadRequest(status, client);
        }
        else{
            gotBadRequest('Both parties not present', client);
        }
    }
    catch(e){
        // console.log('JWT is invalid');
        gotBadRequest('JWT is invalid', client);
    }
}

function rematchRequested(token, sessionManager){
    try{
        // let decoded 
    }
    catch(e){

    }
}

function towelThrown(sessionManager){

}

/**
 * Sends up-to-date game data back to the client
 */
function describeState(sessionData){
    let rematchOption = (sessionData.game.gameState != 0);

    let message = {
        memo: 'describeState',
        board: sessionData.game.board,
        curPlayer: sessionData.game.curPlayer,
        gameState: sessionData.game.gameState,
        bothPartiesPresent: sessionData.bothPartiesPresent,
        rematchOption
    }

    for(const [key, value] of Object.entries(sessionData.clients)){
        value.ws.send(JSON.stringify(message));
    }
}

function gotBadRequest(error, client){
    let message = {
        memo: 'badRequest',
        error
    }
    client.send(JSON.stringify(message));
}

module.exports = {
    firstContact,
    describeState,
    moveMade
}