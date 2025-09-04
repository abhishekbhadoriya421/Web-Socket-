const express = require('express');
const app = express();
const http = require('http');
const path = require('path');
const crypto = require("crypto");

const server = http.createServer(app);


app.get('/', (req, res) => {
    return res.sendFile(__dirname + '/public/index2.html');
});



server.listen(8080, () => {
    console.log('server 2 is running');
})