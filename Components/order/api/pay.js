const router = require("express").Router();
const paymentController = require("./payController");

router
    .get("/", paymentController.getPayments)
    .get("/api/payments", paymentController.getListPayments)
    .get("/api/payments/:id", paymentController.getOrderDetail)
    .patch("/api/order/:id/update", paymentController.updatePayment)

module.exports = router;
