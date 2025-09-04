const express = require('express');
const app = express();
const http = require('http');
const path = require('path');
const crypto = require("crypto");

const server = http.createServer(app);


app.get('/', (req, res) => {
    return res.sendFile(__dirname + '/public/index2.html');
});


function generateAcceptValue(key) {
    return crypto
        .createHash("sha1")
        .update(key + "258EAFA5-E914-47DA-95CA-C5AB0DC85B11", "binary")
        .digest("base64");
}

server.on("upgrade", (req, socket, head) => {
    const key = req.headers['sec-websocket-key'];
    console.log(key);
    const acceptKey = generateAcceptValue(key);
    console.log(acceptKey);

    const headers = [
        'HTTP/1.1 101 Switching Protocols',
        'Upgrade : websocket',
        'Connection : Upgrade',
        `Sec-WebSocket-Accept: ${acceptKey}`,
    ];
});



server.listen(8080, () => {
    console.log('server 2 is running');
})