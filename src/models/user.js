import { Schema, model } from "mongoose";
import bcrypt from "bcrypt"; 
const UserSchema = new Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    password: { type: String, required: true }
});

// Define pre-save hook to hash the password before saving
UserSchema.pre('save', async function(next) {
    // Ensure password is modified or new, otherwise move to the next middleware
    if (!this.isModified('password')) {
        return next();
    }
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(this.password, salt);
        this.password = hashedPassword;
        next();
    } catch (error) {
        return next(error);
    }
});

// Define a method to validate password
UserSchema.methods.isValidPassword = async function(password) {
    try {
        const isValid = await bcrypt.compare(password, this.password);
        return isValid;
    } catch (error) {
        return false;
    }
};

const User = model('User', UserSchema);

export default User;
