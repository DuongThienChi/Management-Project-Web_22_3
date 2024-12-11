const Admin = require("../../auth/data-access/AdminModel");
const bcrypt = require("bcrypt");

const ProfileController = {
    GetProfilePage: async (req, res) => {
        try {
            const userId = req.session.userId;
            const user = await Admin.findById(userId);

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
            const userId = req.session.userId;
            console.log("Received data in backend:", req.body);

            const { name, email, address, contact, password } = req.body;

            const updatedData = {};

            if (name) updatedData.name = name;
            if (email) updatedData.email = email;
            if (address) updatedData.address = address;
            if (contact) updatedData.contact = contact;
            const hashedPassword = await bcrypt.hash(password, 10);
            if (password) updatedData.password = hashedPassword;

            console.log("Updated Data:", updatedData);

            const updatedUser = await Admin.findByIdAndUpdate(
                userId,
                updatedData,
                { new: true }
            );

            if (!updatedUser) {
                return res
                    .status(404)
                    .json({ success: false, message: "User not found" });
            }
        } catch (error) {
            console.error(error);
        }
    },
};

module.exports = ProfileController;
