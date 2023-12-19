import { messageServices } from "../services/message.services.js";

export const messageController = {
    connection : async (socketServer, socket) => {
        socketServer.emit("chatBox", await messageServices.getMessages());
        socket.on("message", async (info) => {
            const {user, message} = info;
            
            await messageServices.createMessage(user, message);
            socketServer.emit("chatBox", await messageServices.getMessages());
        });

        socket.on("newUser", async(user) => {
            await messageServices.createUser(user)
            socket.broadcast.emit("broadcast", user);
        });

        socket.on("clear", async () => {
            await messageServices.deleteAllMessages();
        });
    }
}