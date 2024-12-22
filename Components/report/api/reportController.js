const reportService = require("../domain/reportService");

const reportController = {
    getReportOrder: async (req, res) => {
        try {
            const report = await reportService.getReportOrder();
            res.status(200).json({
                success: true,
                message: "Report order retrieved successfully",
                report,
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
};

module.exports = reportController;
