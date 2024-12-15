const PaymentModel = require("../data-access/PayModel");
const UserModel = require("../data-access/userModel");

const PaymentService = {
    getPayments: async (page, sort, order, date) => {
        if (!page) {
            page = 1;
        }


        const payments = await PaymentModel.fetchPayments(page, sort, order, date);

        const totalPayments = await PaymentModel.find().countDocuments();
        const totalPages = Math.ceil(totalPayments / 10);
        return {payments, totalPages};
    },
};

module.exports = PaymentService;
