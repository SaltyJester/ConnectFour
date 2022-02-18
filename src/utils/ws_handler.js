/**
 * When clients intially connect to the server, they need to be assigned a player role
 * Player role (one or two) is selected at random
 * After both roles are filled, all further clients are designated as spectators
 */
function firstContact(client, matchData){
    console.log('First Contact');
    let profile = new Object;
    profile.memo = 'describeRole';
    profile.id = matchData.nextClientID++;
    if(matchData.clients.length == 0){
        profile.role = Math.floor(Math.random() * 2) + 1; // random player assignment
    }
    else if(matchData.clients.length == 1){
        profile.role = 3 - matchData.clients[0].role; // assign remaining available player
        matchData.bothPartiesPresent = true;
    }
    else{
        profile.role = -1 //spectator
    }
    matchData.clients.push({
        ws: client,
        role: profile.role
    });
    client.send(JSON.stringify(profile));
    describeState(matchData);
}

/**
 * Sends up-to-date game data back to the client
 */
function describeState(matchData){
    let message = {
        memo: 'describeState',
        board: matchData.game.board,
        curPlayer: matchData.game.curPlayer,
        gameState: matchData.game.gameState,
        bothPartiesPresent: matchData.bothPartiesPresent
    }
    matchData.clients.forEach((client) => {
        client.ws.send(JSON.stringify(message));
    });
    // client.send(JSON.stringify(message));
}

module.exports = {
    firstContact,
    describeState
}