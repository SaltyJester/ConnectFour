const express = require('express');
const path = require('path');
const app = express();
const port = 3000;
const ws = require('ws');
const wsHandler = require('./utils/ws_handler')
const {ConnectFour} = require('./utils/game');
const {SessionManager} = require('./utils/session_manager');

/**
 * Express.js Code
 */

app.use(express.static(path.join(__dirname, '../public')));

app.get('/', function(req, res){
    res.sendFile(path.join(__dirname, '../public/landing_page.html'));
});

app.post('/create_game', function(req, res){
    let sessionID = sessionManager.createGame();
    res.status(201);
    res.send({sessionID});
});

app.get('/join/:id', (req, res) => {
    if(sessionManager.sessions[req.params.id]){
        return res.status(200).sendFile(path.join(__dirname, '../public/game_page.html'));
    }
    res.status(404).send();
});

//need to make a request for those who already have a URL link to a game

const server = app.listen(port);
console.log('Server has started, listening on port ' + port);

/**
 * Code for managing multiple game sessions
 */
let sessionManager = new SessionManager();

/**
 * Websocket Code
 */

const wss = new ws.WebSocketServer({ noServer: true, clientTracking: true });
server.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (webSocket) => {
        wss.emit('connection', webSocket, request);
    });
});

let sessionData = {
    game: new ConnectFour(),
    nextClientID: 0,
    clients: {},
    bothPartiesPresent: false
}

/**
 * All ws responses from the clients will start here
 * Eventually, we'll have to verify each user is who they say they are
 * cause currently people could just change their ID in the JSON
 */
wss.on('connection', (client, req) => {
    client.on('message', (message) => {
        try{
            message = JSON.parse(message);
        }catch{
            console.log('Did not receive correctly formatted JSON message')
            return;
        }

        // console.log(req.headers['sec-websocket-key']);  <--- we could use this later for authenticating users
        
        if(message.memo === 'firstContact'){
            console.log('First Contact');
            wsHandler.firstContact(client, sessionData);
        }
        else if(message.memo === 'makeMove'){
            console.log('Move Made');
            wsHandler.moveMade(message.data, client, sessionData)
        }
    });

    // client.on('d')

    // console.log(JSON.stringify(wss.clients));
});

// wss.clients <--

//TEST CODE START
// let test = new SessionManager();
// let id = test.createGame();
// id = test.createGame();
// console.log(id)
//TEST CODE END