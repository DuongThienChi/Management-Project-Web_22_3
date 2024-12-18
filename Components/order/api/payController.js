const PaymentService = require("../domain/PaymentService");

const paymentController = {
    getPayments: async (req, res) => {
        try {
            const {page, sort, order, startDate, endDate, status} = req.query; 
            const { payments, totalPages } = await PaymentService.getPayments(page, sort, order, startDate, endDate, status);
            if (!payments) {
                return res.status(404).json({ message: "No payments found" });
            }
            
            res.render("pages/orderListPage", { 
                title: "Order List", 
                orders: payments, 
                showSidebar: true, 
                showTopbar: true,
                totalPages,
             });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getListPayments: async (req, res) => {
        try {
            const {page, sort, order, startDate, endDate, status} = req.query; 
            const { payments, totalPages } = await PaymentService.getPayments(page, sort, order, startDate, endDate, status);
            if (!payments) {
                return res.status(404).json({ message: "No payments found" });
            }
            
            res.json({payments, totalPages});
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
};

module.exports = paymentController;
