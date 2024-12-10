const Admin = require("../../auth/data-access/AdminModel"); // Đường dẫn đúng đến model
const bcrypt = require('bcrypt');

const ProfileController = {
  GetProfilePage: async (req, res) => {
    try {
      const userId = req.session.userId; // Lấy userId từ session hoặc req
      const user = await Admin.findById(userId);

      if (!user) {
        return res.status(404).send("User not found");
      }

      res.render("pages/profiles", {
        user, // Truyền dữ liệu user vào view
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
      const userId = req.session.userId; // Lấy userId từ session
      console.log("Received data in backend:", req.body); // Log để kiểm tra
  
      const { name, email, address, contact, password } = req.body;
  
      // Khởi tạo một đối tượng dữ liệu mới với các trường cần cập nhật
      const updatedData = {};
  
      if (name) updatedData.name = name;
      if (email) updatedData.email = email;
      if (address) updatedData.address = address;
      if (contact) updatedData.contact = contact;
  
      if (password) updatedData.password = password;

  
      console.log("Updated Data:", updatedData); // Log để kiểm tra dữ liệu sẽ lưu vào DB
  
      const updatedUser = await Admin.findByIdAndUpdate(userId, updatedData, { new: true });
  
      if (!updatedUser) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
  
      res.status(200).json({ success: true, message: 'Profile updated successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  }
  
  
};

module.exports = ProfileController;
