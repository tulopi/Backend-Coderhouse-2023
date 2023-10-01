import { Router } from "express";
import { manager } from "../ProductManager.js";

const router = Router();

router.get("/", async (req, res) => {
    try {
        const products = await manager.getProducts();
        res.status(200).json({ message: "Products found", products });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get("/:id", async (req, res) => {
    const { id } = req.params;
    console.log(id);
    try {
        const product = await manager.getProductById(+id);
        console.log(product);
        if (!product) {
            return res
                .status(404)
                .json({ message: "Product not found with the id provided" });
        }
        res.status(200).json({ message: "Product found", product });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post("/", async (req, res) => {
    const { title, description, price, thumbnail, code, stock } = req.body;
    if (!title || !description || !price || !thumbnail || !code || !stock) {
        return res.status(400).json({ message: "Some data is missing" });
    }
    try {
        const response = await manager.addProduct(
            title,
            description,
            price,
            thumbnail,
            code,
            stock
        );
        res.status(200).json({ message: "Product created", product: response });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.delete("/:idProduct", async (req, res) => {
    const { idProduct } = req.params;
    try {
        const response = await manager.deleteProduct(+idProduct);
        if (!response) {
            return res
                .status(404)
                .json({ message: "Product not found with the id provided" });
        }
        res.status(200).json({ message: "Product deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put("/:idProduct", async (req, res) => {
    const { idProduct } = req.params;
    try {
        const response = await manager.updateProduct(+idProduct, req.body);
        if (!response) {
            return res
                .status(404)
                .json({ message: "Product not found with the id provided" });
        }
        res.status(200).json({ message: "Product updated" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;