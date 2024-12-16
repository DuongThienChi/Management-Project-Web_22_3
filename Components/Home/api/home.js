const express = require("express");
const HomeController = require("../api/homeController");

const router = express.Router();

const { ensureAuthenticated } = require("../../../middlewares/authencation");
// GET Route: Home page
router.get("/", ensureAuthenticated, (req, res) => {
    if (!req.session.isLoggedIn) {
        return res.redirect("/"); // Nếu chưa đăng nhập, redirect về login page
    }
    HomeController.GetHomePage(req, res);
});

module.exports = router;
