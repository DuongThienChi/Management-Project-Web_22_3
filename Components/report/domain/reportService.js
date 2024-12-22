const Order = require("../../order/data-access/PayModel");

const reportService = {
    getReportOrder: async (req, res) => {
        try {
            const { day, weekPerMonth, month } = req.body;
            let report = {};
            if (day) {
                report = await Order.find({
                    createdAt: { $gte: new Date(day) },
                });
            } else if (weekPerMonth) {
                const parts = weekPerMonth.split("/");
                if (parts.length > 1) {
                    const week = parts[0].toLowerCase();
                    const month = parts[1].toLowerCase();
                    const year = new Date().getFullYear();

                    const monthIndex = new Date(
                        `${month} 1, ${year}`
                    ).getMonth();
                    const firstDayOfMonth = new Date(year, monthIndex, 1);
                    const firstDayOfWeek = new Date(
                        firstDayOfMonth.setDate(
                            (parseInt(week.replace("week", "")) - 1) * 7 + 1
                        )
                    );
                    const lastDayOfWeek = new Date(firstDayOfWeek);
                    lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 6);

                    report = await Order.find({
                        createdAt: {
                            $gte: firstDayOfWeek,
                            $lte: lastDayOfWeek,
                        },
                    });
                }
            } else if (month) {
                const year = new Date().getFullYear();
                const monthIndex = new Date(
                    `${month.toLowerCase()} 1, ${year}`
                ).getMonth();
                const firstDayOfMonth = new Date(year, monthIndex, 1);
                const lastDayOfMonth = new Date(year, monthIndex + 1, 0);

                report = await Order.find({
                    createdAt: { $gte: firstDayOfMonth, $lte: lastDayOfMonth },
                });
            }
            return report;
        } catch (error) {
            throw error;
        }
    },
};
module.exports = reportService;
