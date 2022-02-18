const express = require('express');
const path = require('path');
const app = express();
const port = 3000;
const ws = require('ws');
const wsHandler = require('./utils/ws_handler')
const {ConnectFour} = require('./utils/game');

/**
 * Express.js Code
 */

app.use(express.static(path.join(__dirname, '../public')));

app.get('/', function(req, res){
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port);
console.log('Server has started, listening on port ' + port);

/**
 * Websocket Code
 */

const wss = new ws.WebSocketServer({ port: 8080, clientTracking: true });
let matchData = {
    game: new ConnectFour(),
    nextClientID: 0,
    clients: [],
    bothPartiesPresent: false
}
// let game = new ConnectFour();
// let nextClientID = 0;
// let clients = [];
// let bothPartiesPresent = false;

/**
 * All ws responses from the clients will start here
 * Eventually, we'll have to verify each user is who they say they are
 * cause currently people could just change their ID in the JSON
 */
wss.on('connection', (client, req) => {
    client.on('message', (message) => {
        message = JSON.parse(message);

        // console.log(req.headers['sec-websocket-key']);  <--- we could use this later for authenticating users
        
        if(message.memo === 'firstContact'){
            wsHandler.firstContact(client, matchData);
        }
    });

    // client.on('d')

    // console.log(JSON.stringify(wss.clients));
});

// wss.clients <--

module.exports = {
    app,
    wss
}