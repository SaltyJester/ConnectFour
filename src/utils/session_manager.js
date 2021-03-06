const {ConnectFour} = require('./game');

class SessionManager{
    constructor(){
        this.sessions = {};
        this.nextSessionID = 0; // Eventually I would like to generate a short random string
        this.lastTimeStamp = Date.now(); // client needs to respond after this time to be alive
    }

    createGame(){
        let sessionData = { // the heartbeat functionality might work better if this was it's own class
            game: new ConnectFour(),
            nextClientID: 0,
            clients: {},
            bothPartiesPresent: false
        }

        this.sessions[this.nextSessionID] = sessionData;
        return this.nextSessionID++;
    }

    checkPulse(){
        let dead = [];
        for(const [sessionID, sessionData] of Object.entries(this.sessions)){
            let clients = sessionData.clients;
            for(const [clientID, clientData] of Object.entries(clients)){
                // console.log(clientData.lastPing);
                if(clientData.lastPing < this.lastTimeStamp && !clientData.dead){
                    clientData.dead = true;
                    dead.push({ 
                        sessionID, 
                        clientID,
                        role: clientData.role
                    });
                }
            }
        }
        this.lastTimeStamp = Date.now();
        return dead;
    }
}

// do i want session manager checking lastPing of every client or have a separate class for sessionData that only checks for it's own domain?

// Once i determine a client is dead, how do i update other clients immediately after updating the game state? I can't reach ws_handler from here

module.exports = {
    SessionManager
}