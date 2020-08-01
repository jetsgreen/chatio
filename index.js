const app = require('express')();
const http = require('http').createServer(app);
const path = require('path');
const express = require('express');
const io = require('socket.io')(http);

// set up access to public folder
app.use(express.static(path.join(__dirname, 'public')));

// Run when a user connects
io.on('connection', socket => {

    socket.emit('message', 'Welcome to the chat');
    // Broadcast when a user connects(this will emit to everyone except user thats connecting)
    socket.broadcast.emit('message', 'A user has joined the chat');

    // This runs when a user disconnects
    socket.on('disconnect', () => {
        io.emit('message', 'A user has left the chat')
    })
    // Listen for chatMessage
    socket.on('chatMessage', (msg)=>{
        io.emit('message', msg)
    })
});

http.listen(3000, () => {
    console.log('listening on *:3000');
});