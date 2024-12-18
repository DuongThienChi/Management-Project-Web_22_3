const PaymentModel = require("../data-access/PayModel");
const UserModel = require("../../users/data-access/UserModel");

const PaymentService = {
    getPayments: async (page, sort, order, startDate, endDate, status) => {
        if (!page) {
            page = 1;
        }

        const payments = await PaymentModel.fetchPayments(
            page,
            sort,
            order,
            startDate,
            endDate,
            status
        );

        const totalPayments = await PaymentModel.find().countDocuments();
        const totalPages = Math.ceil(totalPayments / 10);
        return { payments, totalPages };
    },
};

module.exports = PaymentService;
