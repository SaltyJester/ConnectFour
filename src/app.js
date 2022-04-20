const express = require('express');
const path = require('path');
const app = express();
const port = 3000;
const ws = require('ws');
const wsHandler = require('./utils/ws_handler')
const {ConnectFour} = require('./utils/game');
const {SessionManager} = require('./utils/session_manager');
const jwt = require('jsonwebtoken');

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

app.get('/list_sessions', (req, res) => {
    res.status(200).send(sessionManager.sessions);
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

/**
 * All ws responses from the clients will start here
 * Eventually, we'll have to verify each user is who they say they are
 * cause currently people could just change their ID in the JSON
 * 
 * TO DO: each client should be sending a token for every message so we only process valid requests
 */
wss.on('connection', (client) => {
    client.on('message', (message) => {
        try{
            message = JSON.parse(message);
            
        }catch{
            console.log('Did not receive correctly formatted JSON message')
            return;
        }
        
        // let decoded;
        let sessionID;
        let role;
        let clientID;
        if(message.memo === 'firstContact'){
            console.log('A user is joining session ' + message.sessionID);
            wsHandler.firstContact(message.sessionID, client, sessionManager);
        }
        else{
            try {
                let decoded = jwt.verify(message.token, process.env.TOKEN_SECRET);
                sessionID = decoded.sessionID;
                role = decoded.role;
                clientID = decoded.id;
            }
            catch(e){
                console.log('Received invalid JSON Web Token');
            }
        }

        if(message.memo === 'makeMove'){
            console.log('Make move request from session: ' + sessionID + ', player: ' + role);
            wsHandler.moveMade(sessionID, role, message.col, client, sessionManager);
        }
        else if(message.memo === 'requestRematch'){
            console.log('Player ' + role + ' in session ' + sessionID + 'requested a rematch');
            wsHandler.rematchRequested(sessionID, client, sessionManager);
        }
        else if(message.memo === 'requestForfeit'){
            console.log('Player ' + role + ' in session ' + sessionID + ' is a quiter');
            wsHandler.forfeitRequested(sessionID, role, client, sessionManager);
        }
        else if(message.memo === 'heartbeat'){
            wsHandler.heartbeat(sessionID, clientID, sessionManager)
        }
    });
});

wss.on('disconnect', (client) => {
    console.log('someone just left ' + client)
});

// setInterval(() => {
//     try{
//         let sessionData = sessionManager.sessions[0];
//         console.log(sessionData);
//         message = {
//             memo: "test"
//         }
//         sessionData.clients[0].ws.send(JSON.stringify(message));
//     }
//     catch(e){

//     }
// }, 3000)