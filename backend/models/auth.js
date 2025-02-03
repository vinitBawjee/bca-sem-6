const mongoose = require("mongoose");

const signup_user = new mongoose.Schema({
    full_name: { type: String, required: true },
    user_name: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    address: { type: String, required: true },
    phone_number: { type: Number, required: true },
    dob: { type: Date, required: true },
    profile_photo: { type: String, required: true },
    password: { type: String, required: true },
}, { timestamps: true });

// Schema for Seller Signup
const signup_seller = new mongoose.Schema({
    full_name: { type: String, required: true },
    user_name: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    address: { type: String, required: true },
    phone_number: { type: Number, required: true },
    dob: { type: Date, required: true },
    profile_photo: { type: String, required: true },
    password: { type: String, required: true },
}, { timestamps: true });

module.exports = {
    signup_user: mongoose.model("signup_user", signup_user),
    signup_seller: mongoose.model("signup_seller", signup_seller),
};

