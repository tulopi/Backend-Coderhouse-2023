import { Router } from "express";
import { cartManager } from "../dao/managersDB/cartManager.js";

const router = Router();

// Get all carts
router.get("/", async (req, res) => {
    try {
        const carts = await cartManager.findAll();
        res.status(200).json({ message: "Carts found", carts });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create new cart
router.post("/", async (req, res) => {
    try {
        const newCart = await cartManager.createCart(req.body);
        res.status(200).json({ message: "Cart created", cart: newCart });
    } catch (error) {
        res.status(500).json({ message: error });
    }
});

// Get cart by id
router.get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const cart = await cartManager.findCartById(id);
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }
        res.status(200).json({ message: "Cart found", cart });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Add product to cart
router.post("/:cid/products/:pid", async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    if (!quantity || isNaN(quantity) || quantity < 1) {
        return res.status(400).json({ message: "Invalid quantity" });
    }
    try {
        const cart = await cartManager.addProductToCart(cid, pid, quantity);
        res.status(200).json({ message: "Product added to cart", cart });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

// Delete specific product in cart
router.delete("/:cid/products/:pid", async (req, res) => {
    const { cid, pid } = req.params;
    try {
        const cart = await cartManager.removeProductFromCart(cid, pid);
        res.status(200).json({ message: "Product removed from cart", cart });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

// Update product quantity in cart
router.put("/:cid/products/:pid", async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    if (!quantity || isNaN(quantity) || quantity < 1) {
        return res.status(400).json({ message: "Invalid quantity" });
    }
    try {
        const cart = await cartManager.updateProductQuantity(cid, pid, quantity);
        res.status(200).json({ message: "Product quantity updated in cart", cart });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

// Delete all products in cart
router.delete("/:cid/empty", async (req, res) => {
    const { cid } = req.params;
    try {
        const cart = await cartManager.clearCartByCid(cid);
        res.status(200).json({ message: "Cart cleared", cart });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete by ID
router.delete("/:cid", async (req, res) => {
    const { cid } = req.params;
    try {
        const deletedCart = await cartManager.deleteCartByCid(cid);
        res.status(200).json({ message: "Cart deleted", cart: deletedCart });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;