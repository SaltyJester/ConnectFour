/**
 * When clients intially connect to the server, they need to be assigned a player role
 * Player role (one or two) is selected at random
 * After both roles are filled, all further clients are designated as spectators
 */
function firstContact(client, sessionData){
    let profile = new Object;
    // profile.memo = 'describeRole';
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
    sessionData.clients[profile.id] = {
        ws: client,
        role: profile.role
    }

    // sessionData.clients.push({
    //     ws: client,
    //     role: profile.role
    // });
    client.send(JSON.stringify({
        memo: 'describeRole',
        profile
    }));
    describeState(sessionData);
}

/*
Need to notify users of bad requests
Current implementation allows for cheating, since a user can modify JSON data to be any player
*/
function moveMade(moveData, sessionData){
    console.log(sessionData.game.makeMove(moveData.col, moveData.role));
    describeState(sessionData);
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

    // sessionData.clients.forEach((client) => {
    //     client.ws.send(JSON.stringify(message));
    // });


    // client.send(JSON.stringify(message));
}

module.exports = {
    firstContact,
    describeState,
    moveMade
}