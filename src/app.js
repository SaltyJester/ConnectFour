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
 */
wss.on('connection', (client) => {
    client.on('message', (message) => {
        try{
            message = JSON.parse(message);
        }catch{
            console.log('Did not receive correctly formatted JSON message')
            return;
        }
        
        if(message.memo === 'firstContact'){
            console.log('A user is joining session ' + message.sessionID);
            wsHandler.firstContact(message.sessionID, client, sessionManager);
        }
        else if(message.memo === 'makeMove'){
            try{
                let decoded = jwt.verify(message.data.token, process.env.TOKEN_SECRET);
                console.log('Make move request from session: ' + decoded.sessionID + ', player: ' + decoded.role);
                wsHandler.moveMade(message.data, client, sessionManager)
            }
            catch(e){
                console.log('Error occured for makeMove');
            }
        }
        else if(message.memo === 'throwTowel'){
            console.log('someone is a quiter');
        }
    });
});