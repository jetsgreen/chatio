const app = require('express')();
const http = require('http').createServer(app);
const path = require('path');
const express = require('express');
const io = require('socket.io')(http);
const formatMessage = require('./model/messages');
const {userJoin, getCurrentUser} = require('./model/users');

// set up access to public folder
app.use(express.static(path.join(__dirname, 'public')));

const chatBot = 'Chatbot';

// Run when a user connects
io.on('connection', socket => {
    socket.on('joinRoom', ({ username, room }) => {

        const user = userJoin(socket.id, username, room);

        socket.join(user.room);

        // Welcome current User
        socket.emit('message', formatMessage(chatBot, 'Welcome to the chat'));

        // Broadcast when a user connects(this will emit to everyone except user thats connecting)
        socket.broadcast.to(user.room).emit('message', formatMessage(chatBot, `${user.username} has joined the chat`));
    })

    // Listen for chatMessage
    socket.on('chatMessage', (msg) => {
        io.emit('message', formatMessage('USER', msg))
    })

    // This runs when a user disconnects
    socket.on('disconnect', () => {
        io.emit('message', formatMessage(chatBot, 'A user has left the chat'))
    })
});

http.listen(3000, () => {
    console.log('listening on *:3000');
});