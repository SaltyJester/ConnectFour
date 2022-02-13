const express = require('express');
const path = require('path');
const app = express();
const port = 3000;
const ws = require('ws');

// express.js code
app.use(express.static(path.join(__dirname, '../public')));

app.get('/', function(req, res){
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port);
console.log('Server has started, listening on port ' + port);

// websocket code
const wss = new ws.WebSocketServer({ port: 8080, clientTracking: true });
let clients = [];

wss.on('connection', (client) => {
    client.on('message', (message) => {
        if(message.toString() === 'ping'){
            client.send('pong');
            // client.send(JSON.stringify(wss.clients));
            // console.log(JSON.stringify(wss.clients));
        }
    });

    // client.on('d')

    console.log(JSON.stringify(wss.clients));
});

// wss.clients <--