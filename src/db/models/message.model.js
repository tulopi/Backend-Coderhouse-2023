import { Schema, model } from "mongoose";

const messagesSchema = new Schema({
    email : {
        type:String,
        require:true,
    },
    message : {
        type: [String],
        default: [],
    }
},
    {
        timestamps: true
    }
)

export const messagesModel = new model("messages", messagesSchema)