const chatForm = document.getElementById('chat-form');
const socket = io();

socket.on('message', message =>{
    console.log(message)
});

// Message submit
chatForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    // Get form input value
    const msg = e.target.elements.msg.value;
    // emit message to server
    socket.emit('chatMessage', msg)
});