import mongoose from "mongoose";

export const connectToDb = async (uri) => {
    await mongoose.connect(uri)
    .then(() => console.log("CONNECTED TO DB"))
    .catch((err) => console.log(err))
}