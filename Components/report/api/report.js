const router = require("express").Router();
const reportController = require("./reportController");

router.get("/order", reportController.getReportOrder);

module.exports = router;
