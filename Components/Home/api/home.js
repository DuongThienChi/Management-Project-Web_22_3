const express = require("express");
const HomeController = require("../api/homeController");

const router = express.Router();

const { ensureAuthenticated } = require("../../../middlewares/authencation");
// GET Route: Home page
router.get("/", ensureAuthenticated, HomeController.GetHomePage);

module.exports = router;
