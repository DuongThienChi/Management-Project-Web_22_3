const reportService = require("../domain/reportService");

const reportController = {
    getReportOrder: async (req, res) => {
        try {
            const { report, topCoursesDetails } =
                await reportService.getReportOrder(req, res);
            res.status(200).json({
                success: true,
                message: "Report order retrieved successfully",
                report,
                courses: topCoursesDetails,
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
};

module.exports = reportController;
