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
        const totalPages = Math.ceil(totalPayments/10);
        const startIndex = (page - 1) * 10 + 1;
        const endIndex = Math.min(page * 10, totalPayments);
        return { payments, totalPayments, startIndex, endIndex };
    },

    getOrderDetail: async (id) => {
        return await PaymentModel.findById(id)
            .populate("userId", "username")
            .populate({
                path: 'items', // Tên trường tham chiếu
                select: 'Title Price', // Chỉ lấy các trường name và price
            });
    },

    updatePayment: async (id, data) => {
        return await PaymentModel.findByIdAndUpdate(id, data, {
            new: true,
        });
    }
};

module.exports = PaymentService;
