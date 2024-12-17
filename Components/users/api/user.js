const router = require("express").Router();
const userController = require("../api/userController");
const { ensureAuthenticated } = require("../../../middlewares/authencation");
router
    .get("/", ensureAuthenticated, userController.GetUserPage)
    .get("/user-list-data", ensureAuthenticated, userController.GetUserListData)
    .get("/view/:id", ensureAuthenticated, userController.GetUserDetailPage)
    .post("/ban/:id", ensureAuthenticated, userController.BanUser);

module.exports = router;
