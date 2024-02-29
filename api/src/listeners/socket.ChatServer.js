import { messageController } from "../controllers/message.controller.js";

const socketChatServer = (socketServer) => {
    socketServer.on("connection", (socket) => {
        messageController.connection(socketServer, socket)
    });

};

export default socketChatServer;