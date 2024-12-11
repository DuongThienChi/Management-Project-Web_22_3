const express = require("express");
const path = require("path");
const authController = require("../api/authController");

const router = express.Router();

router.get("/", (req, res) => {
  res.render("pages/login", { errorMessage: req.flash("errorMessage") });
});

router.post("/", authController.loginUser);

module.exports = router;
