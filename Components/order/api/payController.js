const PaymentService = require("../domain/PaymentService");

const paymentController = {
    getPayments: async (req, res) => {
        try {
            const {page, sort, order, startDate, endDate, status} = req.query; 
            const { payments, totalPayments, startIndex, endIndex } = await PaymentService.getPayments(page, sort, order, startDate, endDate, status);
            if (!payments) {
                return res.status(404).json({ message: "No payments found" });
            }
            
            res.render("pages/orderListPage", { 
                title: "Order List", 
                orders: payments, 
                showSidebar: true, 
                showTopbar: true,
                totalPayments,
                startIndex,
                endIndex,
             });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getListPayments: async (req, res) => {
        try {
            const {page, sort, order, startDate, endDate, status} = req.query; 
            const { payments, totalPayments, startIndex, endIndex } = await PaymentService.getPayments(page, sort, order, startDate, endDate, status);
            if (!payments) {
                return res.status(404).json({ message: "No payments found" });
            }
            
            res.json({payments, totalPayments, startIndex, endIndex});
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getOrderDetail: async (req, res) => {
        try {
            const payment = await PaymentService.getOrderDetail(req.params.id);
            if (!payment) {
                return res.status(404).json({ message: "Payment not found" });
            }
            
            res.json(payment);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    updatePayment: async (req, res) => {
        try {
            const payment = await PaymentService.updatePayment(req.params.id, req.body);
            if (!payment) {
                return res.status(404).json({ message: "Payment not found" });
            }
            
            res.json(payment);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
};

module.exports = paymentController;
