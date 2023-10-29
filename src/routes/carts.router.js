import { Router } from "express";
import { cartManager } from "../dao/managersDB/cartManager.js";

const router = Router();

router.get("/", async (req, res) => {
    try {
        const carts = await cartManager.findAll();
        res
            .status(200)
            .json({ message: "Carts found", carts});
    } catch (error) {
        res
            .status(500)
            .json({ message: error.message });
    }
});

router.post("/", async (req, res) => {
    try {
        const newCart = await cartManager.createCart(req.body);
        res
            .status(200)
            .json({ message: "Cart created", cart: newCart });
    } catch (error) {
        res
            .status(500)
            .json({ message: error });
    }
});

router.get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const cart = await cartManager.findById(id);
        if (!cart) {
            return res
                .status(404)
                .json({ message: "Cart not found" });
        }
        res
            .status(200)
            .json({ message: "Cart found", cart });
    } catch (error) {
        res
            .status(500)
            .json({ message: error.message });
    }
});

router.post("/:cid/product/:pid", async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    if (!quantity || isNaN(quantity) || quantity < 1) {
        return res
            .status(400)
            .json({ message: "Invalid quantity" });
    }

    try {
        const cart = await cartManager.addProductToCart(cid, parseInt(pid), parseInt(quantity));
        if (!cart) {
            return res
                .status(404)
                .json({ message: "Cart not found" });
        }
        res
            .status(200)
            .json({ message: "Product added to cart", cart });
    } catch (error) {
        console.error(error);
        res
            .status(500)
            .json({ message: error.message });
    }
});

router.delete("/:cid/empty", async (req, res) => {
    const { cid } = req.params;
    try {
        const cart = await cartManager.clearCartByCid(cid);
        res
            .status(200)
            .json({ message: "Cart clear", cart });
    } catch (error) {
        res
            .status(500)
            .json({ message: error.message });
    }
});

router.delete("/:cid", async (req, res) => {
    const { cid } = req.params;
    try {
        const deletedCart = await cartManager.deleteCartByCid(cid);
        res
            .status(200)
            .json({ message: "Cart deleted", cart: deletedCart });
    } catch (error) {
        res
            .status(500)
            .json({ message: error.message });
    }
});

export default router;