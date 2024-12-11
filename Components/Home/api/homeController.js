const HomeController = {
  GetHomePage: (req, res) => {
    res.render("pages/index", {
      title: "Home Page",
      showSidebar: true,
      showTopbar: true,
    });
  },
};

module.exports = HomeController;
