const express = require('express');
const app = express();
const port = 8080;
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');

const server = http.createServer(app);

const io = new Server(server);

app.get('/', (req, res) => {
    return res.sendFile(path.join(__dirname + '/public/index.html'));
})

io.on('connection', (socket) => {
    console.log("New User Connected: " + socket.handshake.auth.username);

    socket.on('patra', (message) => {
        io.emit('jawab', `${socket.handshake.auth.username}: ` + message);
    })
    socket.on('disconnect', () => {
        console.log("User Has disconnected")
    });
});

server.listen(port, (err) => {
    console.log(`Listening on port ${port}`);
})



// app.listen(port, (err) => {
//     console.log('server is running');
// })