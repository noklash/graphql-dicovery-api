const mongoose = require("mongoose");

 const connectToDb = async (uri) => {
    await mongoose.connect(uri)
    .then(() => console.log("CONNECTED TO DB"))
    .catch((err) => console.log(err))
}

module.exports =  connectToDb