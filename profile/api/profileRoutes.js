const express = require("express");
const profileController = require("../api/profileController");
const router = express.Router();

router.get("/", profileController.GetProfilePage); // Route để hiển thị profile
router.post("/update", profileController.UpdateProfile); // Route để cập nhật profile

module.exports = router;
