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

let clients = [];

server.on("upgrade", (req, socket, head) => {
    // console.log(req.headers);
    const key = req.headers['sec-websocket-key'];
    const acceptKey = generateAcceptValue(key);

    const headers = [
        'HTTP/1.1 101 Switching Protocols',
        'Upgrade: websocket',
        'Connection: Upgrade',
        `Sec-WebSocket-Accept: ${acceptKey}`,
    ];

    socket.write(headers.join('\r\n') + "\r\n\r\n");

    socket.username = null;
    clients.push(socket);

    socket.on('data', (buffer) => {
        let message = decodeMessage(buffer);

        if (message === null) {
            console.log("Client sent close frame");
            clients = clients.filter(c => c !== socket);
            socket.end();
            return;
        }

        if (!socket.username) {
            socket.username = message;
            return;
        }

        const reply = encodeMessage(`${socket.username} : ${message}`);

        clients.forEach(client => {
            client.write(reply);
        });
    });

    socket.on('close', () => {
        console.log('Connection Disconncted');
        clients = clients.filter((client) => client !== socket);
    })
});



// Decode WebSocket frame
function decodeMessage(buffer) {
    const firstByte = buffer[0];
    const opcode = firstByte & 0x0f;

    if (opcode === 0x8) {
        // Close frame
        return null;
    }

    const secondByte = buffer[1];
    const length = secondByte & 127;
    const maskStart = 2 + (length === 126 ? 2 : length === 127 ? 8 : 0);
    const mask = buffer.slice(maskStart, maskStart + 4);
    const dataStart = maskStart + 4;

    let message = "";
    for (let i = 0; i < length; i++) {
        const byte = buffer[dataStart + i] ^ mask[i % 4];
        message += String.fromCharCode(byte);
    }
    return message;
}

// Encode WebSocket frame
function encodeMessage(message) {
    const json = Buffer.from(message);
    const length = json.length;
    let header;

    if (length < 126) {
        header = Buffer.from([129, length]);
    } else if (length < 65536) {
        header = Buffer.from([129, 126, (length >> 8) & 255, length & 255]);
    } else {
        throw new Error("Message too long");
    }

    return Buffer.concat([header, json]);
}



server.listen(8080, () => {
    console.log('server 2 is running');
})