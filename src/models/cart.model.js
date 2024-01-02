import { ObjectId } from "mongodb";
import { Schema, model } from "mongoose";

const cartsSchema = new Schema({

    products:
        [{
            productId: {
                type: ObjectId,
                ref: "Products",
            },
            quantity: {
                type: Number,
                required: true,
            },
            _id: false,
        }]

})

export const cartModel = new model("Carts", cartsSchema)