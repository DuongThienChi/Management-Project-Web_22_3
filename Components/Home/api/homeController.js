const { google } = require("googleapis");

const HomeController = {
  GetHomePage: async (req, res) => {
    try {
      const key = require("../../../gganalytics.json");

      const auth = new google.auth.GoogleAuth({
        credentials: key,
        scopes: ["https://www.googleapis.com/auth/analytics.readonly"],
      });

      const authClient = await auth.getClient();

      const analyticsData = google.analyticsdata("v1beta");

      const response = await analyticsData.properties.runReport({
        auth: authClient,
        property: "properties/469695432",
        requestBody: {
          dateRanges: [
            {
              startDate: "30daysAgo",
              endDate: "today",
            },
          ],
          dimensions: [
            { name: "pageTitle" },
            { name: "screenResolution" },
            { name: "country" },
          ],
          metrics: [
            { name: "newUsers" },
            { name: "sessions" },
            { name: "screenPageViews" },
          ],
        },
      });

      const analyticsRows = response.data.rows.map(row => ({
        pageTitle: row.dimensionValues[0].value,
        screenResolution: row.dimensionValues[1].value,
        country: row.dimensionValues[2].value,
        newUsers: parseInt(row.metricValues[0].value, 10),
        sessions: parseInt(row.metricValues[1].value, 10),
        screenPageViews: parseInt(row.metricValues[2].value, 10),
      }));

      const totalNewUsers = analyticsRows.reduce((sum, row) => sum + row.newUsers, 0);
      const totalSessions = analyticsRows.reduce((sum, row) => sum + row.sessions, 0);

      const countrySessions = analyticsRows.reduce((result, row) => {
        result[row.country] = (result[row.country] || 0) + row.sessions;
        return result;
      }, {});

      const mostVisitedCountry = Object.keys(countrySessions).reduce((maxCountry, country) =>
        countrySessions[country] > countrySessions[maxCountry] ? country : maxCountry,
        Object.keys(countrySessions)[0]
      );

      res.render("pages/index", {
        title: "Google Analytics Summary",
        showSidebar: true,
        showTopbar: true,
        totalNewUsers,
        mostVisitedCountry,
        totalSessions,
        analyticsData: analyticsRows,
      });
    } catch (error) {
      console.error("Error fetching data from Google Analytics:", error);

      res.render("pages/index", {
        title: "Google Analytics Data",
        showSidebar: true,
        showTopbar: true,
        totalNewUsers: 0,
        mostVisitedCountry: "N/A",
        totalSessions: 0,
        analyticsData: [],
        error: "Failed to fetch data from Google Analytics",
      });
    }
  },
};

module.exports = HomeController;
