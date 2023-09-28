import { existsSync, promises } from "fs";
const path = "ProductsFile.json";

class ProductManager {
    products = [];

    async getProducts() {
        try {
            if (existsSync(path)) {
                const productsFile = await promises.readFile(path, "utf-8");
                this.products = JSON.parse(productsFile);
            }
            return this.products;
        } catch (error) {
            throw error;
        }
    }

    async getProductById(id) {
        try {
            const products = await this.getProducts();
            return products.find((product) => product.id === id);
        } catch (error) {
            throw error;
        }
    }

    async addProduct(title, description, price, thumbnail, code, stock) {
        try {
            await this.getProducts();

            const isAllFields = !!title && !!description && !!price && !!thumbnail && !!code && !!stock;

            if (!isAllFields) {
                throw new Error("All fields are required");
            }

            const isCodeExist = this.products.some((product) => product.code === code);

            if (isCodeExist) {
                throw new Error("Error: Product code already exists");
            }

            if (isAllFields && !isCodeExist) {
                const product = {
                    id: this.products.length + 1,
                    title,
                    description,
                    price,
                    thumbnail,
                    code,
                    stock,
                };

                this.products.push(product);
                await promises.writeFile(path, JSON.stringify(this.products));
                return product;
            }
        } catch (error) {
            throw error;
        }
    }

    async updateProduct(id, updatedProduct) {
        try {
            await this.getProducts();

            const index = this.products.findIndex((product) => product.id === id);

            if (index !== -1) {
                const updated = { ...this.products[index], ...updatedProduct };
                this.products[index] = updated;
                await promises.writeFile(path, JSON.stringify(this.products));
                return updated;
            } else {
                throw new Error("Product not found");
            }
        } catch (error) {
            throw error;
        }
    }

    async deleteProduct(id) {
        try {
            await this.getProducts();

            const index = this.products.findIndex((product) => product.id === id);

            if (index !== -1) {
                const deletedProduct = this.products.splice(index, 1)[0];
                await promises.writeFile(path, JSON.stringify(this.products));
                return deletedProduct;
            } else {
                throw new Error("Product not found");
            }
        } catch (error) {
            throw error;
        }
    }
}

export const manager = new ProductManager();