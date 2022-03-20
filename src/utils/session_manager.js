const {ConnectFour} = require('./game');

class SessionManager{
    constructor(){
        this.sessions = {};
        this.nextSessionID = 0; // Eventually I would like to generate a short random string
    }

    createGame(){
        let sessionData = {
            game: new ConnectFour(),
            nextClientID: 0,
            clients: {},
            bothPartiesPresent: false
        }

        this.sessions[this.nextSessionID] = sessionData;
        return this.nextSessionID++;
    }
}

module.exports = {
    SessionManager
}