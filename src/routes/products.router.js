import { Router } from "express";
import { productManager } from "../dao/managersDB/productManager.js";

const router = Router();

router.get("/", async (req, res) => {
    try {
        const { limit, page, sortField } = req.query;
        const result = await productManager.findAll({ limit, page, sortField });
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

        router.get("/:id", async (req, res) => {
            const { id } = req.params;
            try {
                const product = await productManager.findById(id);
                if (!product) {
                    return res
                        .status(404)
                        .json({ message: "Product not found with the id provided" });
                }
                res
                    .status(200)
                    .json({ message: "Product found", product });
            } catch (error) {
                res
                    .status(500)
                    .json({ message: error.message });
            }
        });

        router.post("/", async (req, res) => {
            try {
                const createdProduct = await productManager.createOne(req.body);
                res
                    .status(200)
                    .json({ message: "Product created", product: createdProduct });
            } catch (error) {
                res
                    .status(500)
                    .json({ message: error.message });
            }
        });

        router.put("/:idProduct", async (req, res) => {
            const { idProduct } = req.params;
            try {
                await productManager.updateOne(idProduct, req.body);
                res
                    .status(200)
                    .json({ message: "Product updated" });
            } catch (error) {
                res
                    .status(500)
                    .json({ message: error.message });
            };

            router.delete("/:idProduct", async (req, res) => {
                const idProduct = req.params;
                try {
                    await productManager.deleteOne(idProduct);
                    res
                        .status(200)
                        .json({ message: "Poduct deleted" });
                } catch (error) {
                    res.status(500).json({ message: error.message });
                }
            });

        });

        export default router;