import { cartService } from "../services/cart.services.js";
import { userServices } from "../services/user.services.js";
import { transporter } from "../utils/nodemailer.js";

export const cartController = {
    getAllCarts: async (req, res) => {
        try {
            const carts = await cartService.findAll();
            res.status(200).json({ message: "Carts found", carts });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    createCart: async (req, res) => {
        try {
            const newCart = await cartService.createCart(req);
            res.status(200).json({ message: "Cart created", cart: newCart });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    createCartSocket: async (req, res) => {
        try {
            const newcart = await cartService.createSocketCart(req);
            return newcart;
        } catch (error) {
            console.log({ message: error.message }, "cart.controller");
        }
    },
    getCartById: async (req, res) => {
        const { id } = req.params;
        try {
            const cart = await cartService.findCartById(id);
            res.status(200).json({ message: "Cart found", cart });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    addProductToCart: async (req, res) => {
        const user = req.user;
        console.log(user);
        const userFromDB = await userServices.findById(user)
        const { pid } = req.params;
        const cid = userFromDB.cart;
        const { quantity } = req.body;
        try {
            const updatedCart = await cartService.addProductToCart(cid, pid, quantity);
            res.status(200).json({ message: "Product added to cart", cart: updatedCart });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    removeProductFromCart: async (req, res) => {
        const user = req.user;
        const userFromDB = await userServices.findById(user)
        const { pid } = req.params;
        const cid = userFromDB.cart;
        try {
            const updatedCart = await cartService.removeProductFromCart(cid, pid);
            res.status(200).json({ message: "Product removed from cart", cart: updatedCart });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    updateProductQuantity: async (req, res) => {
        const { cid, pid } = req.params;
        const { quantity } = req.body;
        try {
            const updatedCart = await cartService.updateProductQuantity(cid, pid, quantity);
            res.status(200).json({ message: "Product quantity updated in cart", cart: updatedCart });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    clearCart: async (req, res) => {
        const { cid } = req.params;
        try {
            const clearedCart = await cartService.clearCartByCid(cid);
            res.status(200).json({ message: "Cart cleared", cart: clearedCart });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    deleteCart: async (req, res) => {
        const { cid } = req.params;
        try {
            const deletedCart = await cartService.deleteCartByCid(cid);
            res.status(200).json({ message: "Cart deleted", cart: deletedCart });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    purchase: async (req, res) => {
        try {
            const getUser = await userServices.findById(req.user._id)
            const idCart = getUser.cart;
            const user = req.user;
            const response = await cartService.purchase(idCart, user)
            const mailOptions = {
                from: "Coderhouse-Backend",
                to: getUser.email,
                subject: "Purchase done",
                text: "Your purchase has been processed."
            }
                await transporter.sendMail(mailOptions)
            res.status(200).json({response});
        } catch (error) {
            res.status(401).json("Not authorized", error);
        }
    }
};