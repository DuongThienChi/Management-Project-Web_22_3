const User = require("../../auth/data-access/AdminModel");
const bcrypt = require("bcrypt");
const profileService = {
    findUserById: async (userId) => {
        try {
            const user = await User.findById(userId);
            return user;
        } catch (error) {
            console.error(error);
            return null;
        }
    },
    updateUserProfile: async (req, res) => {
        try {
            const userId = req.user.id;
            console.log("Received data in backend:", req.body);

            const user = await User.findById(userId);
            if (!user) {
                return res
                    .status(404)
                    .json({ success: false, message: "User not found" });
            }
            const { name, email, address, contact, password } = req.body;

            const updatedData = {};

            if (name) updatedData.name = name;
            if (email) {
                const emailExist = await User.findOne({ email });
                if (emailExist) {
                    return res
                        .status(400)
                        .json({
                            success: false,
                            message: "Email already exists",
                        });
                }
                updatedData.email = email;
            }
            if (address) updatedData.address = address;
            if (contact) updatedData.contact = contact;
            if (password) {
                const hashedPassword = await bcrypt.hash(password, 10);
                updatedData.password = hashedPassword;
            }

            console.log("Updated Data:", updatedData);

            const updatedUser = await User.findByIdAndUpdate(
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
            return res
                .status(500)
                .json({ success: false, message: "Internal Server Error" });
        }
    },
};

module.exports = profileService;
