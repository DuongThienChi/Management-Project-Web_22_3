const router = require("express").Router();
const reportController = require("./reportController");

router.post("/order", reportController.getReportOrder);

module.exports = router;
