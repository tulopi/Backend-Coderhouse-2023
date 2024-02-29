// app.js
import { createServer } from "http";
import config from "./config/config.js";
import { logError, logInfo } from "./loggers/index.js";
import socketChatServer from "./listeners/socket.ChatServer.js";
import socketCartServer from "./listeners/socket.CartServer.js";
import app from "./index.js";
import { Server } from "socket.io";

const PORT = parseInt(config.port);

// HTTP Server
const httpServer = createServer(app);

// Socket server
const io = new Server(httpServer);

// Server setup
const enableServers = () => {
    httpServer.listen(PORT, () => {
        logInfo(`🔺 Server running on http://localhost:${PORT}... 🔺`);
    });

    httpServer.on("error", (error) => {
        logError(`Error en servidor ${error}`);
    });

    socketChatServer(io);
    socketCartServer(io);
};

enableServers();