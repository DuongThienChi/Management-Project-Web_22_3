const Admin = require("../../auth/data-access/AdminModel");
const profileService = require("../domain/profileService");
const bcrypt = require("bcrypt");

const ProfileController = {
    GetProfilePage: async (req, res) => {
        try {
            const userId = req.user.id;
            const user = await profileService.findUserById(userId);

            if (!user) {
                return res.status(404).send("User not found");
            }

            res.render("pages/profiles", {
                user,
                title: "Profile Page",
                showSidebar: true,
                showTopbar: true,
            });
        } catch (error) {
            console.error(error);
            res.status(500).send("Internal Server Error");
        }
    },

    UpdateProfile: async (req, res) => {
        try {
            await profileService.updateUserProfile(req, res);
        } catch (error) {
            console.error(error);
        }
    },
};

module.exports = ProfileController;
