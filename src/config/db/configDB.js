import mongoose from "mongoose";
import config from "../config.js";

const URI = config.mongoUrl;

mongoose.connect(URI)
    .then(() => {
        console.log("🛜  Connected to MongoDB 🛜");
    }).catch((error) => console.log(error));