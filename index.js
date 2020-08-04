const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const formatMessage = require('./model/messages');
const { userJoin, getCurrentUser, userLeave, getRoomUsers } = require('./model/users');

const app = express();
const server = http.createServer(app);
const io = require('socket.io').listen(server);

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

        // Send users and room info
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        })
    });

    // Listen for chatMessage
    socket.on('chatMessage', (msg) => {
        const user = getCurrentUser(socket.id);
        io.to(user.room).emit('message', formatMessage(user.username, msg))
    })

    // This runs when a user disconnects
    socket.on('disconnect', () => {

        const user = userLeave(socket.id);
        if (user) {
            io.to(user.room).emit('message', formatMessage(chatBot, `${user.username} has left the chat`));

            // Send users and room info
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            })
        }

    })
});

const PORT = process.env.PORT || 3000;
server.listen(3000, () => {
    console.log(`server running on port ${PORT}`);
});