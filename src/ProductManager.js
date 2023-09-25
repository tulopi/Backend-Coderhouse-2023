import { existsSync, promises } from "fs";
const path = "productsFile.json";

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


// async function test() {
//     const manager = new ProductManager();

//     try {
//         await manager.addProduct('Producto 1', 'Descripción 1', 10.99, 'imagen1.jpg', 'code1', 100);
//         await manager.addProduct('Producto 2', 'Descripción 2', 15.99, 'imagen2.jpg', 'code2', 150);
//         await manager.addProduct('Producto 3', 'Descripción 3', 20.99, 'imagen3.jpg', 'code3', 200);
//         await manager.addProduct('Producto 4', 'Descripción 4', 25.99, 'imagen4.jpg', 'code4', 250);
//         await manager.addProduct('Producto 5', 'Descripción 5', 30.99, 'imagen5.jpg', 'code5', 300);

//         console.log('Productos agregados con éxito');
//     } catch (error) {
//         console.error('Error al agregar productos:', error.message);
//     }
// }

// test();

export const manager = new ProductManager();