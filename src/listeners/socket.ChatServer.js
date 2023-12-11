import { messageController } from "../controllers/db.controllers/message.controller.js";

const socketChatServer = (socketServer) => {
    socketServer.on("connection", messageController.connection);
};

export default socketChatServer;