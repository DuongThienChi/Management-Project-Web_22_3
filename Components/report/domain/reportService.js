const Order = require("../../order/data-access/PayModel");
const Course = require("../../course/data-access/CourseModel");
const reportService = {
    getReportOrder: async (req, res) => {
        try {
            const { day, weekPerMonth, month } = req.body;
            let report = {};
            let filter = null;
            if (day) {
                filter = {
                    status: "paid",
                    createdAt: { $gte: new Date(day) },
                };
                report = await Order.find(filter);
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
                    filter = {
                        status: "paid",
                        createdAt: {
                            $gte: firstDayOfWeek,
                            $lte: lastDayOfWeek,
                        },
                    };
                    report = await Order.find(filter);
                }
            } else if (month) {
                const year = new Date().getFullYear();
                const monthIndex = new Date(
                    `${month.toLowerCase()} 1, ${year}`
                ).getMonth();
                const firstDayOfMonth = new Date(year, monthIndex, 1);
                const lastDayOfMonth = new Date(year, monthIndex + 1, 0);
                filter = {
                    status: "paid",
                    createdAt: { $gte: firstDayOfMonth, $lte: lastDayOfMonth },
                };
                report = await Order.find(filter);
            }
            const topCourses = await Order.aggregate([
                { $match: filter },
                { $unwind: "$items" },
                { $group: { _id: "$items", count: { $sum: 1 } } },
                { $sort: { count: -1 } },
                { $limit: 10 },
            ]);
            const topCoursesDetails = await Promise.all(
                topCourses.map(async (course) => {
                    const courseDetail = await Course.findById(course._id);
                    return courseDetail;
                })
            );
            return { report, topCoursesDetails };
        } catch (error) {
            throw error;
        }
    },
};
module.exports = reportService;
