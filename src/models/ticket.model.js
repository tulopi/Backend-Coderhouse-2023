import { Schema, Model } from "mongoose";

const ticketSchema = new Schema({
    code:{
        type: String,
        required: true
    },
    purchase_datetime:{
        type: String,
        required: true
    },
    amount:{
        type: Number,
        required: true
    },
    purchaser:{
        type: String,
        required: true
    }
});

export const ticketModel = Model("Tickets", ticketSchema)
