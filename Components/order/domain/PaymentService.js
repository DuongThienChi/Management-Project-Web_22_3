const PaymentModel = require("../data-access/PayModel");
const UserModel = require("../data-access/userModel");

const PaymentService = {
    getPayments: async (page, sort, date) => {
        if (!page) {
            page = 1;
        }

        
        const payments = await PaymentModel.find()
            .populate("items")
            .populate("userId", "username")
            .sort({ createdAt: -1 })
            .skip((page - 1) * 10)
            .limit(10);

        const totalPayments = await PaymentModel.find().countDocuments();
        const totalPages = Math.ceil(totalPayments / 10);
        return {payments, totalPages};
    },
};

module.exports = PaymentService;
