const express = require('express');
const path = require('path');
const app = express();
const port = 3000;
const ws = require('ws');

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
let nextClientID = 0;
let clients = [];

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
            console.log("First Contact");
            let profile = new Object;
            profile.memo = "describeRole";
            profile.id = nextClientID++;
            if(clients.length == 0){
                profile.role = Math.floor(Math.random() * 2) + 1; // random player assignment
            }
            else if(clients.length == 1){
                profile.role = 3 - clients[0].role; // assign remaining available player
            }
            else{
                profile.role = -1 //spectator
            }
            clients.push({
                ws: client,
                role: profile.role
            });
            client.send(JSON.stringify(profile));
        }
    });

    // client.on('d')

    // console.log(JSON.stringify(wss.clients));
});

// wss.clients <--