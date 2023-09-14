const fs = require('fs');

class ProductManager {
    constructor(path) {
        this.products = [];
        this.path = path;
        this.newId = 1;
    }

    async getProducts() {
        try {
            if (fs.existsSync(this.path)) {
                const productsJSON = await fs.promises.readFile(this.path, 'utf-8');
                this.products = JSON.parse(productsJSON);
            }
            return this.products;
        } catch (error) {
            throw error;
        }
    }

    async getProductsById(idNumber) {
        try {
            const products = await this.getProducts();
            const foundProduct = products.find((element) => {
                return element.id === idNumber;
            });
            console.log(foundProduct);
            return foundProduct;
        } catch (error) {
            throw error;
        }
    }

    async addProduct(title, description, price, thumbnail, insertedCode, stock) {
        try {
            await this.getProducts();

            const isAllFields = (!!title && !!description && !!price && !!thumbnail && !!insertedCode && !!stock);

            if (!isAllFields) {
                throw new Error("All fields are required");
            }

            const isCodeExist = this.products.some((element) => {
                return element.code === insertedCode;
            });

            if (isCodeExist) {
                throw new Error("Error: Product code already exists");
            }

            if (isAllFields && !isCodeExist) {
                const product = {
                    id: this.newId,
                    title,
                    description,
                    price,
                    thumbnail,
                    code: insertedCode,
                    stock
                };

                this.products.push(product);
                this.newId++;
                await fs.promises.writeFile(this.path, JSON.stringify(this.products));
            }
        } catch (error) {
            throw error;
        }
    }

    async updateProduct(idNumber, updated) {
        try {
            await this.getProducts();

            const index = this.products.findIndex((element) => {
                return element.id === idNumber;
            });

            if (updated.code) {
                const isCodeExist = this.products.some((item) => item.code === updated.code);
                if (!isCodeExist) {
                    const modifiedProduct = {
                        ...this.products[index],
                        ...updated
                    };
                    this.products[index] = modifiedProduct;
                    await this.saveProducts(this.products);
                } else {
                    throw new Error("Error: Product code already exists");
                }
            } else {
                const modifiedProduct = {
                    ...this.products[index],
                    ...updated
                };
                this.products[index] = modifiedProduct;
                await this.saveProducts(this.products);
            }
        } catch (error) {
            throw error;
        }
    }

    async deleteProduct(idNumber) {
        try {
            await this.getProducts();

            const index = this.products.findIndex((element) => {
                return element.id === idNumber;
            });

            if (index !== -1) {
                this.products.splice(index, 1);
                await fs.promises.writeFile(this.path, JSON.stringify(this.products));
            } else {
                throw new Error("Error: Product does not exist");
            }
        } catch (error) {
            throw error;
        }
    }

    async saveProducts(elements) {
        try {
            const productsJS = JSON.stringify(elements);
            await fs.promises.writeFile(this.path, productsJS);
        } catch (error) {
            throw error;
        }
    }

    //  //  Uncomment for testing & npm start =)
    // async test() {
    //         //add products
    //     try {
    //         await this.addProduct('Oreo', 'Description 1', 3, './images/oreo.jpg', '123456', 100000);
    //         await this.addProduct('Coca-Cola', 'Description 2', 7, './images/coca-cola.jpg', '679012', 250000);
    //         await this.addProduct('Pepsi', 'Description 3', 6, './images/pepsi.jpg', '234567', 300000);

    //         //del products
    //         await this.deleteProduct(2);
    //         await this.deleteProduct(3);
    //         await this.deleteProduct(1);
    //     } catch (error) {
    //         console.error(error);
    //     }
    // }
};

const productManager = new ProductManager('./productsFile.json');

productManager.test();
