const userServices = require("../domain/userService");

const UserController = {
    GetUserPage: async (req, res) => {
        try {
            const { search, sort, page } = req.query;

            const usersData = await userServices.getUserListInfo(
                search,
                sort,
                page
            );
            res.render("pages/user", {
                title: "User List",
                users: usersData.users,
                currentPage: usersData.currentPage,
                totalItem: usersData.totalItem,
                startItem: usersData.startItem,
                endItem: usersData.endItem,
                showTopbar: true,
                showSidebar: true,
            });
        } catch (error) {
            console.error("Error fetching users:", error);
            res.status(500).send("An error occurred while fetching users.");
        }
    },
    GetUserListData: async (req, res) => {
        try {
            const { search, sort, page } = req.query;

            const usersData = await userServices.getUserListInfo(
                search,
                sort,
                page
            );
            res.json(usersData);
        } catch (error) {
            console.error("Error fetching users:", error);
            res.status(500).send("An error occurred while fetching users.");
        }
    },
    // UpdateUser: async (req, res) => {
    //     try {
    //         await userServices.updateUserProfile(req, res);
    //     } catch (error) {
    //         console.error(error);
    //     }
    // },
};

module.exports = UserController;
