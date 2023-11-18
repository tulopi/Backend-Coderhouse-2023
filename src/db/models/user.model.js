import { Schema, model } from "mongoose";

const userSchema = new Schema({
    first_name:{
        type: String,
        required: true
    },
    last_name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
    },
    role: {
        type: String,
        default: "user"
    },
    isGitHub: {
        type: Boolean,
        default: false,
    }
});

export const userModel = model("Users", userSchema)
