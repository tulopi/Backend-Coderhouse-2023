import { cartService } from "../services/cart.services.js";

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
        try{
            const newcart = await cartService.createSocketCart(req);
            return newcart;
        } catch (error) {
            console.log({message: error.message});
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
        const { cid, pid } = req.params;
        const { quantity } = req.body;
        try {
            const updatedCart = await cartService.addProductToCart(cid, pid, quantity);
            res.status(200).json({ message: "Product added to cart", cart: updatedCart });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    removeProductFromCart: async (req, res) => {
        const { cid, pid } = req.params;
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
    }
};