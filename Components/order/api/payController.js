const PaymentService = require("../domain/PaymentService");

const paymentController = {
    getPayments: async (req, res) => {
        try {
            const {page, sort, date} = req.query; 
            const { payments, totalPages } = await PaymentService.getPayments(page, sort, date);
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
    }
};

module.exports = paymentController;
