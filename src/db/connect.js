const mongoose = require("mongoose");

const connectToDb = async (uri) => {
    try {
        await mongoose.connect(uri);
        console.log("CONNECTED TO DB");
    } catch (err) {
        console.error("Error connecting to the database:", err);
        process.exit(1); // Exit the process with a failure code
    }
};

module.exports = connectToDb;