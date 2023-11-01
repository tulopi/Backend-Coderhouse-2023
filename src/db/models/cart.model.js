import { ObjectId } from "mongodb";
import { Schema, model } from "mongoose";

const cartsSchema = new Schema({

    products:
        [{
            productId: {
                type: ObjectId,
                ref: "Products",
                require: true
            },
            quantity: {
                type: Number,
                require: true
            }
        }]

})

export const cartModel = new model("Carts", cartsSchema)