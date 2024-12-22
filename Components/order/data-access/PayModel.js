const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    items: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Courses",
            required: true,
            status: {
                type: String,
                enum: ["paid", "pending"],
                default: "pending", // New courses added to payment are initially "pending"
            },
        },
    ],
    total: {
        type: Number,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },

    status: {
        type: String,
        enum: ["paid", "pending"],
        default: "pending",
    },
});

paymentSchema.statics.fetchPayments = async function (
    page,
    sort,
    order,
    startDate,
    endDate,
    status
) {
    const limit = 15;
    const skip = (page - 1) * limit;
    let query = {};

    if (startDate && endDate) {
        query.createdAt = { $gte: startDate, $lte: endDate };
    }

    if (status) {
        query.status = status;
    }

    order = parseInt(order) || -1;

    if (!sort) {
        sort = "createdAt";
    }

    if (sort === "quantity") {
        return this.aggregate([
            {
                $lookup: {
                    from: "Users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "userId",
                },
            },
            {
                $addFields: {
                    status: {
                        $ifNull: ["$status", "pending"],
                    },
                },
            },
            {
                $project: {
                    userId: {
                        $let: {
                            vars: {
                                user: { $arrayElemAt: ["$userId", 0] },
                            },
                            in: {
                                _id: "$$user._id",
                                username: "$$user.username",
                            },
                        },
                    },
                    quantity: {
                        $size: "$items",
                    },
                    items: 1,
                    total: 1,
                    createdAt: 1,
                    status: 1,
                },
            },
            { $sort: { quantity: order } },
            { $limit: limit },
            { $skip: skip },
        ]);
    }

    return this.find(query)
        .populate("userId", "username")
        .sort({ [sort]: order })
        .limit(limit)
        .skip(skip);
};

const PaymentModel = mongoose.model("Payments", paymentSchema, "Payments");
module.exports = PaymentModel;
