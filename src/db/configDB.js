import mongoose from "mongoose";
import config from "../config.js";

const URI = config.mongoUrl;

mongoose.connect(URI)
    .then(() => {
        console.log("connected to mongodb");
    }).catch((error) => console.log(error));