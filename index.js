const express = require('express');
const app = express();
const port = 8080;
const http = require('http');
const path = require('path');
const socket = require('socket.io');

const Server = http.createServer(app);

const io = socket(Server);

app.get('/', (req, res) => {
    return res.sendFile(path.join(__dirname + '/public/index.html'));
})

io.on('connecting', (socket) => {
    console.log("New User Connected");

    socket.on('disconnect', () => {
        console.log("User Has disconnected")
    });
});

Server.listen(port, (err) => {
    console.log(`Listening on port ${port}`);
})



// app.listen(port, (err) => {
//     console.log('server is running');
// })