const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, "Username is required"],
            unique: true,
        },
        password: {
            type: String,
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
        },
        name: {
            type: String,
        },
        address: {
            type: String,
        },
        contact: {
            type: String,
        },
        Img: {
            type: String,
        },
        verify: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

const User = mongoose.model("Admin", adminSchema, "Admin");

module.exports = User;
