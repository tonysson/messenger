const io = require('socket.io')(8800,{
    cors : {
        origin : '*',
        methods : ['GET', 'POST']
    }
})

let users = []
const addUser = (userId, socketId, userInfo) => {
    const checkUser = users.some(user => user.userId === userId)
    if(!checkUser) users.push({ userId, socketId, userInfo });
}

const removeUser = (socketId) => {
  users =  users.filter(user => user.socketId !== socketId)
}

const activeFriend = id => {
    return users.find(user => user.userId === id)
}


io.on('connection',(socket) => {
    console.log("Socket is connecting");
    socket.on('addUser',(userId , userInfo) =>{
       addUser(userId,socket.id, userInfo)
       io.emit('getUser',users)
    })

    socket.on('sendMessage',(data) => {
       const active = activeFriend(data.receiverId);
       if(active !== undefined){
        socket.to(active.socketId).emit('getMessage', {
					senderId: data.senderId,
					senderName: data.senderName,
					receiverId: data.receiverId,
					createdAt: data.time,
					message: {
						text: data.message.text,
                        image : data.message.image
					},
				});
       }
    })

    socket.on('typingMessage',(data) => {
        const active = activeFriend(data.receiverId);
				if (active !== undefined) {
					socket.to(active.socketId).emit('getTypingMessage', {
						senderId: data.senderId,
						receiverId: data.receiverId,
						message : data.message
					});
				}
    });

    socket.on('disconnect',() => {
        removeUser(socket.id)
        io.emit('getUser', users);
    })
})