const authService = require("../domain/authService");
const express = require("express");
const authController = {
    loginUser: async (req, res, next) => {
        try {
            await authService.loginUser(req, res, next);
        } catch (error) {
            console.error("Error logging in:", error); // Log error
            return res.status(500).json({
                message: "Internal Server Error",
            });
        }
    },
};

module.exports = authController;
