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
    GetUserDetailPage: async (req, res) => {
        try {
            const { id } = req.params;
            const user = await userServices.getUserDetailInfo(id);

            if (!user) {
                return res.status(404).send("User not found");
            }

            res.render("pages/userDetail", {
                userDetail: user,
                title: "User Detail",
                showSidebar: true,
                showTopbar: true,
            });
        } catch (error) {
            console.error(error);
            res.status(500).send("Internal Server Error");
        }
    },
    BanUser: async (req, res) => {
        try {
            const { id } = req.params;
            const user = await userServices.banUser(id);
            if (!user) {
                return res.status(404).send("User not found");
            }
            res.status(200).json({
                success: true,
                ban: user,
            });
            //res.redirect("/users");
        } catch (error) {
            console.error(error);
            res.status(500).send("Internal Server Error");
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
