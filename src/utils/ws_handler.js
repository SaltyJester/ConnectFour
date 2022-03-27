const jwt = require('jsonwebtoken');

/**
 * When clients intially connect to the server, they need to be assigned a player role
 * Player role (one or two) is selected at random
 * After both roles are filled, all further clients are designated as spectators
 */
function firstContact(sessionID ,client, sessionManager){
    if(!sessionManager.sessions[sessionID]){
        console.log("Session ID does not exist");
        return; // need to return an error code to client
    }

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
        profile.role = -1 //spectator
    }

    // JWT prevents players from making moves on other players behalf
    let token = jwt.sign({ id: profile.id, role: profile.role }, process.env.TOKEN_SECRET);

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
function moveMade(moveData, client, sessionData){
    try{
        if(sessionData.bothPartiesPresent){
            let decoded = jwt.verify(moveData.token, process.env.TOKEN_SECRET);
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

/**
 * Sends up-to-date game data back to the client
 */
function describeState(sessionData){
    let message = {
        memo: 'describeState',
        board: sessionData.game.board,
        curPlayer: sessionData.game.curPlayer,
        gameState: sessionData.game.gameState,
        bothPartiesPresent: sessionData.bothPartiesPresent
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