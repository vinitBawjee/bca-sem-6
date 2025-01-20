const mongoose = require("mongoose");

// Schema for User Signup
const signup_user = new mongoose.Schema({
    full_name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone_number: { type: String, required: true },
    address: {
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        zip: { type: String, required: true },
    },
}, { timestamps: true });

// Schema for Seller Signup
const signup_seller = new mongoose.Schema({
    business_name: { type: String, required: true },
    full_name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone_number: { type: String, required: true },
    business_address: {
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        zip: { type: String, required: true },
    },
    gst_number: { type: String, required: true },
}, { timestamps: true });

module.exports = {
    signup_user: mongoose.model("signup_user", signup_user),
    signup_seller: mongoose.model("signup_seller", signup_seller),
};

