const { google } = require("googleapis");

const HomeController = {
  GetHomePage: async (req, res) => {
    try {
      // Đọc thông tin tài khoản dịch vụ
      const key = require("../../../gganalytics.json");

      // Tạo GoogleAuth với tài khoản dịch vụ
      const auth = new google.auth.GoogleAuth({
        credentials: key,
        scopes: ["https://www.googleapis.com/auth/analytics.readonly"],
      });

      // Ủy quyền (get client)
      const authClient = await auth.getClient();

      // Khởi tạo Google Analytics Data API (GA4)
      const analyticsData = google.analyticsdata("v1beta");

      // Gửi yêu cầu lấy dữ liệu từ GA4
      const response = await analyticsData.properties.runReport({
        auth: authClient,
        property: "properties/469695432", // Thay bằng Property ID GA4 của bạn
        requestBody: {
          dateRanges: [
            {
              startDate: "30daysAgo",  // Khoảng thời gian từ 30 ngày trước
              endDate: "today",        // Đến hôm nay
            },
          ],
          dimensions: [
            { name: "pageTitle" },        // Tiêu đề trang
            { name: "screenResolution" }, // Loại màn hình
            { name: "country" },          // Quốc gia
          ],
          metrics: [
            { name: "newUsers" },         // Người dùng mới
            { name: "sessions" },         // Số phiên truy cập
            { name: "screenPageViews" },  // Số lần xem trang (thay thế pageviews)
          ],
        },
      });

      // Chuyển đổi dữ liệu thành dạng dễ sử dụng
      const analyticsRows = response.data.rows.map(row => ({
        pageTitle: row.dimensionValues[0].value,
        screenResolution: row.dimensionValues[1].value,
        country: row.dimensionValues[2].value,
        newUsers: row.metricValues[0].value,
        sessions: row.metricValues[1].value,
        screenPageViews: row.metricValues[2].value, // Đổi tên cho trường này
      }));

      // Truyền dữ liệu vào template
      res.render("pages/index", {
        title: "Google Analytics Data",
        showSidebar: true,
        showTopbar: true,
        analyticsData: analyticsRows, // Truyền dữ liệu đã chuyển đổi
      });
    } catch (error) {
      console.error("Error fetching data from Google Analytics:", error);

      // Trả về trang với thông báo lỗi
      res.render("pages/index", {
        title: "Google Analytics Data",
        showSidebar: true,
        showTopbar: true,
        analyticsData: [],
        error: "Failed to fetch data from Google Analytics",
      });
    }
  },
};

module.exports = HomeController;
