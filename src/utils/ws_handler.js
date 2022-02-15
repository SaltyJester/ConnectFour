function firstContact(client, details){
    console.log('First Contact');
    let profile = new Object;
    profile.memo = 'describeRole';
    profile.id = details.nextClientID++;
    if(details.clients.length == 0){
        profile.role = Math.floor(Math.random() * 2) + 1; // random player assignment
    }
    else if(details.clients.length == 1){
        profile.role = 3 - details.clients[0].role; // assign remaining available player
        details.bothPartiesPresent = true;
    }
    else{
        profile.role = -1 //spectator
    }
    details.clients.push({
        ws: client,
        role: profile.role
    });
    client.send(JSON.stringify(profile));
    describeState(details);
}

function describeState(details){
    let message = {
        memo: 'describeState',
        board: details.game.board,
        curPlayer: details.game.curPlayer,
        gameState: details.game.gameState,
        bothPartiesPresent: details.bothPartiesPresent
    }
    details.clients.forEach((client) => {
        client.ws.send(JSON.stringify(message));
    });
    // client.send(JSON.stringify(message));
}

module.exports = {
    firstContact,
    describeState
}