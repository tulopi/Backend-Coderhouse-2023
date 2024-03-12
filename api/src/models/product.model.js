import { Schema, model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productsSchema = new Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    thumbnail:{
        type:String,
        default: "https://via.placeholder.com/150",
        required:true
    },
    code:{
        type:String,
        required:true
    },
    stock:{
        type:Number,
        required:true,
    },
    category:{
        type:String,
        required:true,
    },
    owner: 
        {
            type: Schema.Types.ObjectId,
            ref: "user"
        }
})


productsSchema.plugin(mongoosePaginate);

export const productsModel = model("Products", productsSchema)