const users = [];

// Join User to chat
function userJoin(id, username, room){
    const user = {id, username, room};

    users.push(user);

    return user;
}

// Get the current user
function getCurrentUser(id){
    return users.filter(user => user.id === id)
}

module.exports = {
    userJoin,
    getCurrentUser
}