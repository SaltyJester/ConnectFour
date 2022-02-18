/**
 * When clients intially connect to the server, they need to be assigned a player role
 * Player role (one or two) is selected at random
 * After both roles are filled, all further clients are designated as spectators
 */
function firstContact(client, sessionData){
    console.log('First Contact');
    let profile = new Object;
    profile.memo = 'describeRole';
    profile.id = sessionData.nextClientID++;
    if(sessionData.clients.length == 0){
        profile.role = Math.floor(Math.random() * 2) + 1; // random player assignment
    }
    else if(sessionData.clients.length == 1){
        profile.role = 3 - sessionData.clients[0].role; // assign remaining available player
        sessionData.bothPartiesPresent = true;
    }
    else{
        profile.role = -1 //spectator
    }
    sessionData.clients.push({
        ws: client,
        role: profile.role
    });
    client.send(JSON.stringify(profile));
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
    sessionData.clients.forEach((client) => {
        client.ws.send(JSON.stringify(message));
    });
    // client.send(JSON.stringify(message));
}

module.exports = {
    firstContact,
    describeState
}