import { messageManager } from "../dao/managersDB/messageManager.js";

const socketChatServer = (socketServer) => {
    socketServer.on("connection", async (socket) => {
        socketServer.emit("chatBox", await messageManager.getMessages());
        socket.on("message", async (info) => {
            const {user, message} = info;
            
            await messageManager.createMessage(user, message);
            socketServer.emit("chatBox", await messageManager.getMessages());
        });

        socket.on("newUser", async(user) => {
            await messageManager.createUser(user)
            socket.broadcast.emit("broadcast", user);
        });

        socket.on("clear", async () => {
            await messageManager.deleteAllMessages();
        });
    });
};

export default socketChatServer;