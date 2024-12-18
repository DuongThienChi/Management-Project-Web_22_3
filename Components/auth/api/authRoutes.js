const express = require("express");
const path = require("path");
const authController = require("../api/authController");
const {
    ensureGuest,
    ensureAuthenticated,
} = require("../../../middlewares/authencation");
const router = express.Router();

router.get("/", (req, res) => {
    res.render("pages/login");
});

router.post("/", authController.loginUser);
router.post("/logout", ensureAuthenticated, (req, res, next) => {
    req.logout((err) => {
        if (err) {
            console.error("Lỗi khi logout:", err);
            return next(err);
        }
        req.session.destroy((err) => {
            if (err) {
                console.error("Lỗi khi xóa session:", err);
                return next(err);
            }
            console.log("Session đã bị xóa");
            res.clearCookie("connect.sid"); // Xóa cookie chứa session ID
            res.redirect("/");
        });
    });
});

module.exports = router;
