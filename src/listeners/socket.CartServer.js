import { cartController } from "../controllers/cart.controller.js";
import { cartService } from "../services/cart.services.js";
import { jwtValidation } from "../middlewares/jwt.middleware.js";

const socketCartServer = (socketServer) => {
    socketServer.on("connection", async (socket) => {
        socket.on("addToCart", async (data) => {
            try {
                const { pid, quantity, cid } = data;
                const cart = await cartController.createCartSocket({ product: pid, quantity, cid });
                socket.emit("productAdded", { message: "Product added to cart", cart });
            } catch (error) {
                console.error(error);
                socket.emit("addToCartError", { message: error.message });
            }
        })
    })
};

export default socketCartServer;