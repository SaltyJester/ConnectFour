const jwt = require('jsonwebtoken');

/**
 * When clients intially connect to the server, they need to be assigned a player role
 * Player role (one or two) is selected at random
 * After both roles are filled, all further clients are designated as spectators
 */
function firstContact(client, sessionData){
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
function moveMade(moveData, sessionData){
    try{
        if(sessionData.bothPartiesPresent){
            let decoded = jwt.verify(moveData.token, process.env.TOKEN_SECRET);
            sessionData.game.makeMove(moveData.col, decoded.role);
            describeState(sessionData);
        }
    }
    catch(e){
        console.log('JWT is invalid');
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

module.exports = {
    firstContact,
    describeState,
    moveMade
}