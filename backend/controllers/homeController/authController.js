require("dotenv").config();

const { signup_user, signup_seller } = require("../../models/auth");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// User Signup
exports.signupUser = async (req, res) => {
    try {
        const { full_name, user_name, email, password, phone_number, address, dob, profile_photo } = req.body;

        if (!full_name || !user_name || !email || !password || !phone_number || !address || !dob || !profile_photo) {
            return res.status(400).json({ message: "Please provide all required details to sign up." });
        }

        const existingUser = await signup_user.findOne({ $or: [{ email }, { user_name }] });
        if (existingUser) {
            return res.status(400).json({ message: "This email or username is already registered. Please use a different one." });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new signup_user({
            full_name,
            user_name,
            email,
            password: hashedPassword,
            phone_number,
            address,
            dob,
            profile_photo,
        });
        await newUser.save();

        res.status(201).json({ message: "Welcome aboard! Your account has been successfully created.", user: newUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Oops! Something went wrong on our end. Please try again later." });
    }
};

// Seller Signup
exports.signupSeller = async (req, res) => {
    try {
        const { full_name, user_name, email, password, phone_number, address, dob, profile_photo } = req.body;

        if (!full_name || !user_name || !email || !password || !phone_number || !address || !dob || !profile_photo) {
            return res.status(400).json({ message: "Please provide all required details to sign up." });
        }

        const existingUser = await signup_seller.findOne({ $or: [{ email }, { user_name }] });
        if (existingUser) {
            return res.status(400).json({ message: "This email or username is already registered. Please use a different one." });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new signup_seller({
            full_name,
            user_name,
            email,
            password: hashedPassword,
            phone_number,
            address,
            dob,
            profile_photo,
        });
        await newUser.save();

        res.status(201).json({ message: "Welcome aboard! Your account has been successfully created.", user: newUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Oops! Something went wrong on our end. Please try again later." });
    }
};

// Login
exports.login = async (req, res) => {
    try {
        const { email, password, role } = req.body;
        if (!email || !password || !role) {
            return res.status(400).json({ message: "Please provide email, password, and role to log in." });
        }

        let userModel;
        if (role.code === "user") {
            userModel = signup_user;
        } else if (role.code === "seller") {
            userModel = signup_seller;
        } else {
            return res.status(400).json({ message: "Invalid role. Please select 'user' or 'seller'." });
        }

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "No account found with this email. Please sign up first." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Incorrect password. Please try again." });
        }

        const token = jwt.sign(
            {
                id: user._id,
                email: user.email,
                role: role.code,
            },
            process.env.SECRET_KEY,
            { expiresIn: "1h" } 
        );

        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                email: user.email,
                role: role.code,
            },
        });

    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ message: "An unexpected error occurred. Please try again later.", error: error.message });
    }
};