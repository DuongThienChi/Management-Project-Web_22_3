const router = require("express").Router();
const paymentController = require("./payController");

router
    .get("/", paymentController.getPayments)
    .get("/api/payments", paymentController.getPayments);

module.exports = router;
