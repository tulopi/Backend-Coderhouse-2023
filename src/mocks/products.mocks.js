import { faker } from '@faker-js/faker/locale/es_MX'

export class MockingProducts {
    static randomProducts(amount) {
        return Array(amount)
            .fill(null)
            .map(() => ({
                _id: faker.database.mongodbObjectId(),
                title: faker.commerce.productName(),
                description: faker.commerce.productDescription(),
                code: faker.string.uuid(),
                price: parseInt(faker.commerce.price({ dec: 0 })),
                status: faker.datatype.boolean(),
                stock: faker.number.int({ min: 0, max: 200 }),
                category: faker.commerce.productAdjective(),
                thumbnails: Array(3)
                    .fill(null)
                    .map(() => faker.system.filePath())
            }))
    }
}