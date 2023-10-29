import mongoose from "mongoose";

const URI = "mongodb+srv://tulonv:NdxkT2wswrH7xIBU@cluster0.1rcs8eo.mongodb.net/ecommerce?retryWrites=true&w=majority";

mongoose.connect(URI)
    .then(() => {
        console.log("connected to mongodb");
    }).catch((error) => console.log(error));